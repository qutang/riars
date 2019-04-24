import React, { Component } from 'react';
import { Tag, Badge } from 'antd';
import './UserPredictionMonitor.css';


class UserPredictionMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    correctLabel() {

    }

    renderCurrentPrediction() {
        const currentPrediction = this.props.predictions[this.props.predictions.length - 1]
        const topN = currentPrediction.immutablePrediction;
        return this._renderPrediction(topN, false, currentPrediction.duration, 1);
    }

    renderPastPredictions(n) {
        const startIndex = Math.max(0, this.props.predictions.length - n - 1);
        const stopIndex = this.props.predictions.length - 1;
        const pastPredictions = this.props.predictions.slice(startIndex, stopIndex);
        return pastPredictions.map((prediction, index) => {
            const predictionSet = prediction.immutablePrediction;
            const tags = this._renderPrediction(predictionSet, true, prediction.duration, this.props.predictions.length - index);
            return <div key={index} className={'past-prediction'}>
                {tags}
            </div>
        })
    }

    _renderPrediction(predictionSet, past = true, duration, pastIndex) {
        const displayTime = Math.round(duration * pastIndex * 10.0) / 10.0;
        return (
            <div>
                <h3>{displayTime + ' seconds ago'}</h3>
                {predictionSet.map((prediction) => {
                    return (
                        <Tag key={prediction.label} className='prediction-tag' color={past ? "#bfbfbf" : "#108ee9"} style={{ opacity: prediction.score, fontSize: "1.5em", padding: "0.5em", color: past ? 'black' : 'white', fontWeight: "bold" }} onchange={this.correctLabel.bind(this)
                        }> <Badge color="red" />{prediction.label}</Tag >
                    )
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