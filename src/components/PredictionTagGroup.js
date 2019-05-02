import React, { Component } from 'react';
import { Input } from 'antd';
import PredictionTag from './PredictionTag';


class PredictionTagGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    correctLabel(label) {
        console.log('correcting label');
        const index = this.props.index;
        this.props.correctLabel(index, label);
    }

    addNote(e) {
        const index = this.props.index;
        this.props.addPredictionNote(index, e.target.value);
    }

    render() {
        const prediction = this.props.prediction;
        const predictionList = prediction.prediction;
        const isPast = this.props.isPast;
        return (
            <div className='prediction-list'>
                <Input className='prediction-note' placeholder='Type notes' onChange={this.addNote.bind(this)} onPressEnter={this.addNote.bind(this)} value={prediction.correctionNote}></Input>
                {
                    predictionList.map((pr) => {
                        const flag = pr.label == prediction.correction ? 'green' : 'red';
                        return <PredictionTag key={pr.label} pr={pr} past={isPast} correctLabel={this.correctLabel.bind(this)} flag={flag} />
                    })
                }
            </div>
        )
    }
}

export default PredictionTagGroup;