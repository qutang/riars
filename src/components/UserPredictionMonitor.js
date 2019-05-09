import React, { Component } from 'react';
import { Slider, Spin, Icon, Statistic } from 'antd';
import PredictionTagGroup from './PredictionTagGroup';
import AnnotationPanel from './AnnotationPanel';
import VoiceFeedback from '../models/VoiceFeedback';
import './UserPredictionMonitor.css';


class UserPredictionMonitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPredicting: false,
            currentTime: 0,
            voiceOn: false
        }
        this.lastNumOfPredictions = 0;
        this.windowStartTime = 0;
        this.calibrationCountDown = 100;
        this.predictionTime = 0;
        this.voiceFeedback = new VoiceFeedback();
        this.selectedProcessor = undefined;
        this.stage = 'stop';
        this.nowPanelContent = undefined;
        this.labels = [];
        this.isResting = true;
    }

    addPredictionNote(index, note) {
        this.props.addPredictionNote(index, note);
    }

    renderCurrentPrediction() {
        if (this.props.predictions.length >= 2 && this.state.isPredicting) {
            return <h3>Making activity prediction...</h3>
        } else if (this.props.predictions.length >= 3 && !this.state.isPredicting) {
            const currentPrediction = this.props.predictions[this.props.predictions.length - 1]
            return this._renderPrediction(currentPrediction, false, this.props.predictions.length - 1, 1);
        }
    }

    onFinishDataCollection() {
        this.setState({
            isPredicting: true
        });
    }

    onFinishPrediction() {
        this.lastNumOfPredictions = this.props.predictions.length;
        this.setState({
            isPredicting: false
        });
    }

    onVoiceFeedbackEnd(event) {
        this.setState({
            voiceOn: false
        });
    }

    componentDidMount() {
        this.selectedProcessor = this.props.processors.filter(p => p.selected)[0];
        this.setState({
            currentTime: new Date().getTime() / 1000.0
        });
        setInterval(() => {
            this.setState({
                currentTime: new Date().getTime() / 1000.0
            });
        }, 1000);
        setInterval(() => {
            if (!this.isResting && this.props.predictions.length > 1) {
                const lastPrediction = this.props.predictions[this.props.predictions.length - 1];
                this.voiceFeedback.speakPrediction(lastPrediction, this.onVoiceFeedbackEnd.bind(this));
                this.setState({
                    voiceOn: true
                });
            }
        }, 30 * 1000);
    }

    renderPastPredictions(n) {
        let startIndex;
        let stopIndex;
        if (this.state.isPredicting) {
            startIndex = Math.max(2, this.props.predictions.length - n);
            stopIndex = this.props.predictions.length;
        } else {
            startIndex = Math.max(2, this.props.predictions.length - n - 1);
            stopIndex = this.props.predictions.length - 1;
        }
        const pastPredictions = this.props.predictions.slice(startIndex, stopIndex);
        return pastPredictions.map((prediction, index) => {
            const tags = this._renderPrediction(prediction, true, startIndex + index, this.props.predictions.length - index);
            return <div key={index} className={'past-prediction'}>
                {tags}
            </div>
        });
    }

    _renderPrediction(prediction, past = true, index, pastIndex) {
        const displayTime = Math.round((this.state.currentTime - prediction.stopTime) * 10.0) / 10.0;
        const displayTimeStart = Math.round((this.state.currentTime - prediction.startTime) * 10.0) / 10.0;
        let windowType;
        return (
            <div>
                <h3>{displayTimeStart + '-' + displayTime + ' seconds ago'}</h3>
                <PredictionTagGroup index={index} prediction={prediction} isPast={past} correctLabel={this.props.correctLabel} addPredictionNote={this.props.addPredictionNote} />
            </div>
        )
    }

    onInit() {
        this.lastNumOfPredictions = 0;
        this.windowStartTime = 0;
        this.calibrationCountDown = 100;
        this.predictionTime = 0;
        // set now panel
        this.nowPanelContent = <h3><Spin /> Calibrating timestamps...</h3>;
        // set init annotation
        if (this.props.annotations.length == 0) {
            this.props.annotate('BREAK');
        }
    }

    onCalibrate() {
        this.windowStartTime = this.props.predictions[0].startTime + 2 * this.selectedProcessor.windowSize;
        const deadline = this.props.predictions[0].stopTime + this.selectedProcessor.windowSize;
        this.calibrationCountDown = Math.ceil(deadline - this.state.currentTime);
        this.labels = this.props.predictions[0].prediction.map(p => p.label);
        this.labels.push('SYNC');
        this.labels.push('BREAK');
        // set now panel
        if (this.calibrationCountDown > 0) {
            this.nowPanelContent =
                <>
                    <h3>Data collection will start in {this.calibrationCountDown} seconds</h3>
                    <AnnotationPanel labels={this.labels} annotations={this.props.annotations} annotate={this.props.annotate} />
                </>;
        }
    }

    onRun() {
        let deadline = this.windowStartTime + this.selectedProcessor.windowSize;
        const displaySeconds = Math.ceil(deadline - this.state.currentTime);
        if (displaySeconds == 0) {
            this.windowStartTime = this.windowStartTime + this.selectedProcessor.windowSize;
            this.onFinishDataCollection();
        }
        if (this.props.predictions.length > this.lastNumOfPredictions) {
            this.onFinishPrediction();
        }
        // set now panel
        this.nowPanelContent = <>
            <h3>Data collection for current window finishes in {displaySeconds} seconds {this.state.voiceOn && <Icon type="sound" />}</h3>
            <AnnotationPanel labels={this.labels} annotations={this.props.annotations} annotate={this.props.annotate} />
        </>;

        // when break is on
        if (this.props.annotations.length > 0) {
            const lastAnnotation = this.props.annotations[this.props.annotations.length - 1];
            if (lastAnnotation.label_name == 'BREAK' && lastAnnotation['stop_time'] == undefined) {
                this.isResting = true;
            } else {
                this.isResting = false;
            }
        } else {
            this.isResting = false;
        }
    }

    onStop() {
        this.nowPanelContent = <h3>Stopped</h3>;
    }

    setStage() {
        if (this.selectedProcessor == undefined) {
            this.stage = 'stop';
            return;
        }
        if (this.selectedProcessor.status == 'stopped' && this.props.predictions.length == 0) {
            this.stage = 'stop';
        } else if (this.selectedProcessor.status == 'running' && this.props.predictions.length == 0) {
            this.stage = 'init';
        } else if (this.props.predictions.length == 1 && this.calibrationCountDown > 0) {
            this.stage = 'calibrate';
        } else if (this.props.predictions.length >= 1) {
            this.stage = 'run';
        }
    }

    handleStage() {
        if (this.stage == 'init') {
            this.onInit();
        }
        else if (this.stage == 'calibrate') {
            this.onCalibrate();
        }
        else if (this.stage == 'run') {
            this.onRun();
        } else if (this.stage == 'stop') {
            this.onStop();
        }
    }

    render() {
        this.setStage();
        this.handleStage();
        return (
            <div className='user-prediction-monitor-container'>
                <div className='user-prediction-monitor-control'>
                    <h4>Choose number of past predictions to show</h4>
                    <Slider className='num-of-past-prediction' min={0} max={10} defaultValue={3} value={this.props.numOfPastPredictions} onChange={this.props.changeNumOfPastPredictions}></Slider>
                </div>
                <div className='user-prediction-monitor'>
                    <div className='now-panel'>
                        {this.nowPanelContent}
                    </div>
                    <div className='current-prediction'>
                        {this.renderCurrentPrediction()}
                    </div>
                    {this.renderPastPredictions(this.props.numOfPastPredictions)}
                </div>
            </div>
        );
    }
}

export default UserPredictionMonitor;