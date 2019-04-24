import React, { Component } from 'react';
import { Tag, Badge } from 'antd';
import PredictionTag from './PredictionTag';
import './UserPredictionMonitor.css';


class UserPredictionMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    correctLabel(index, label) {
        this.props.correctPredictionLabel(index, label);
    }

    renderCurrentPrediction() {
        const currentPrediction = this.props.predictions[this.props.predictions.length - 1]
        return this._renderPrediction(currentPrediction, false, 1);
    }

    renderPastPredictions(n) {
        const startIndex = Math.max(0, this.props.predictions.length - n - 1);
        const stopIndex = this.props.predictions.length - 1;
        const pastPredictions = this.props.predictions.slice(startIndex, stopIndex);
        return pastPredictions.map((prediction, index) => {
            const tags = this._renderPrediction(prediction, true, this.props.predictions.length - index);
            return <div key={index} className={'past-prediction'}>
                {tags}
            </div>
        })
    }

    _renderPrediction(prediction, past = true, pastIndex) {
        const displayTime = Math.round(prediction.duration * pastIndex * 10.0) / 10.0;
        const predictionSet = prediction.immutablePrediction;
        return (
            <div>
                <h3>{displayTime + ' seconds ago'}</h3>
                {predictionSet.map((pr) => {
                    return <PredictionTag key={pr.label} pr={pr} past={past} correctLabel={this.correctLabel.bind(this)} prediction={prediction} />
                })}
            </div>
        )
    }

    render() {

        return (
            <div className='user-prediction-monitor'>
                {this.renderPastPredictions(5)}
                <div className='current-prediction'>
                    {this.renderCurrentPrediction()}
                </div>
            </div>
        );
    }
}

export default UserPredictionMonitor;