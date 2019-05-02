import React, { Component } from 'react';
import { Tag, Badge, Button } from 'antd';
import Prediction from '../models/Prediction';


class PredictionTag extends React.Component {
    constructor(props) {
        super(props);
    }

    correctLabel() {
        this.props.correctLabel(this.props.pr.label);
    }

    render() {
        const past = this.props.past;
        const pr = this.props.pr;
        const flag = this.props.flag == 'red' ? 'white' : 'green';
        return (
            <a className='prediction-tag' onClick={this.correctLabel.bind(this)}  ><Tag
                className='prediction-tag-tag'
                color={past ? "rgba(191, 191, 191, " + pr.score + ')' : "rgba(16,142,233," + pr.score + ')'}
                style={{ color: 'black', fontWeight: "bold", border: "2px solid " + flag }} >{Prediction.PREDEFINED_CLASS_ABBR[pr.label] ? Prediction.PREDEFINED_CLASS_ABBR[pr.label] : pr.label}</Tag></a>
        )
    }
}

export default PredictionTag;