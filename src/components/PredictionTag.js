import React, { Component } from 'react';
import { Tag, Badge, Button } from 'antd';


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
        return (
            <a className='prediction-tag' onClick={this.correctLabel.bind(this)}><Tag
                color={past ? "#bfbfbf" : "#108ee9"}
                style={{ opacity: pr.score, fontSize: "1.5em", padding: "0.5em", color: past ? 'black' : 'white', fontWeight: "bold" }} > <Badge color={this.props.flag} style={{ opactiy: 1 }} />{pr.label}</Tag></a>
        )
    }
}

export default PredictionTag;