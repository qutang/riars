import React, { Component } from 'react';
import { Slider, Spin, Statistic } from 'antd';
import PredictionTagGroup from './PredictionTagGroup';
import './UserPredictionMonitor.css';


class UserPredictionMonitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPredicting: false,
            currentTime: 0
        }
        this.lastNumOfPredictions = 0;
        this.windowStartTime = 0;
        this.calibrationCountDown = 100;
        this.predictionTime = 0;
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

    componentDidMount() {
        this.windowStartTime = 0;
        this.calibrationCountDown = 100;
        this.predictionTime = 0;
    }

    componentDidMount() {
        this.setState({
            currentTime: new Date().getTime() / 1000.0
        });
        setInterval(() => {
            this.setState({
                currentTime: new Date().getTime() / 1000.0
            })
        }, 1000);
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
        return (
            <div>
                <h3>{displayTimeStart + '-' + displayTime + ' seconds ago'}</h3>
                <PredictionTagGroup index={index} prediction={prediction} isPast={past} correctLabel={this.props.correctLabel} addPredictionNote={this.props.addPredictionNote} />
            </div>
        )
    }

    renderNowPanel() {
        let panelContent;
        const selectedProcessor = this.props.processors.filter(p => p.selected)[0];
        if (selectedProcessor.status == 'running' && this.props.predictions.length == 0) {
            this.lastNumOfPredictions = 0;
            this.windowStartTime = 0;
            this.calibrationCountDown = 100;
            this.predictionTime = 0;
            panelContent = (<h3><Spin /> Calibrating timestamps...</h3>);
        }
        else if (this.props.predictions.length == 1 && this.calibrationCountDown > 0) {
            this.windowStartTime = this.props.predictions[0].startTime + 2 * selectedProcessor.windowSize;
            const deadline = this.props.predictions[0].stopTime + selectedProcessor.windowSize;
            this.calibrationCountDown = Math.ceil(deadline - this.state.currentTime);
            if (this.calibrationCountDown > 0) {
                panelContent = (
                    <h3>Data collection will start in {this.calibrationCountDown} seconds</h3>
                );
            }
        }
        else if (this.props.predictions.length >= 1) {
            let deadline = this.windowStartTime + selectedProcessor.windowSize;
            const displaySeconds = Math.ceil(deadline - this.state.currentTime);
            if (displaySeconds == 0) {
                this.windowStartTime = this.windowStartTime + selectedProcessor.windowSize;
                this.onFinishDataCollection();
            }
            panelContent = (
                <h3>Data collection for current window finishes in {displaySeconds} seconds</h3>
            );
        }
        return (
            <div className='now-panel'>
                {panelContent}
            </div>
        )
    }

    render() {
        const p = this.props.predictions;
        if (p.length > this.lastNumOfPredictions) {
            this.onFinishPrediction();
        }
        return (
            <div className='user-prediction-monitor-container'>
                <div className='user-prediction-monitor-control'>
                    <h4>Choose number of past predictions to show</h4>
                    <Slider className='num-of-past-prediction' min={0} max={10} defaultValue={3} value={this.props.numOfPastPredictions} onChange={this.props.changeNumOfPastPredictions}></Slider>
                </div>
                <div className='user-prediction-monitor'>
                    {this.renderPastPredictions(this.props.numOfPastPredictions)}
                    <div className='current-prediction'>
                        {this.renderCurrentPrediction()}
                    </div>
                    {this.renderNowPanel()}
                </div>
            </div>
        );
    }
}

export default UserPredictionMonitor;