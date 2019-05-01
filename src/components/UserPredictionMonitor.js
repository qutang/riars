import React, { Component } from 'react';
import { Tag, Badge } from 'antd';
import PredictionTagGroup from './PredictionTagGroup';
import './UserPredictionMonitor.css';


class UserPredictionMonitor extends React.Component {
    constructor(props) {
        super(props);
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
            const tags = this._renderPrediction(prediction, true, index, this.props.predictions.length - index);
            return <div key={index} className={'past-prediction'}>
                {tags}
            </div>
        })
    }

    _renderPrediction(prediction, past = true, index, pastIndex) {
        const displayTime = Math.round(prediction.duration * pastIndex * 10.0) / 10.0;
        return (
            <div>
                <h3>{displayTime + ' seconds ago'}</h3>
                <PredictionTagGroup index={index} prediction={prediction} isPast={past} correctLabel={this.props.correctLabel} addPredictionNote={this.props.addPredictionNote} />
            </div>
        )
    }

    render() {

        return (
            this.props.predictions.length && <div className='user-prediction-monitor'>
                {this.renderPastPredictions(3)}
                <div className='current-prediction'>
                    {this.renderCurrentPrediction()}
                </div>
            </div>
        );
    }
}

export default UserPredictionMonitor;