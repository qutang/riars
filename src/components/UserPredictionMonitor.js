import React, { Component } from 'react';
import { Slider } from 'antd';
import PredictionTagGroup from './PredictionTagGroup';
import './UserPredictionMonitor.css';


class UserPredictionMonitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0
        };
        this.sessionStartTime = -1;
        this.latestPredictionTime = -1;
    }

    addPredictionNote(index, note) {
        this.props.addPredictionNote(index, note);
    }

    renderCurrentPrediction() {
        const currentPrediction = this.props.predictions[this.props.predictions.length - 1]
        return this._renderPrediction(currentPrediction, false, this.props.predictions.length - 1, 1);
    }

    renderPastPredictions(n) {
        const startIndex = Math.max(0, this.props.predictions.length - n - 1);
        const stopIndex = this.props.predictions.length - 1;
        const pastPredictions = this.props.predictions.slice(startIndex, stopIndex);
        return pastPredictions.map((prediction, index) => {
            const tags = this._renderPrediction(prediction, true, startIndex + index, this.props.predictions.length - index);
            return <div key={index} className={'past-prediction'}>
                {tags}
            </div>
        })
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
        if (this.props.predictions.length) {
            const displayTime = Math.round((this.state.currentTime - this.sessionStartTime) * 10.0) / 10.0;
            return (
                <div className='now-panel'>
                    <h3>Collecting data for now: {displayTime} seconds</h3>
                </div>
            )
        }
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

    render() {
        const p = this.props.predictions;
        if (p.length && p[p.length - 1].stopTime != this.latestPredictionTime) {
            this.sessionStartTime = this.state.currentTime;
            this.latestPredictionTime = p[p.length - 1].stopTime;
        }
        return (
            this.props.predictions.length > 0 && <div className='user-prediction-monitor-container'>
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