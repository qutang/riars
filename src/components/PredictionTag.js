import React, { Component } from 'react';
import { Tag, Badge, Button } from 'antd';


class PredictionTag extends React.Component {
    constructor(props) {
        super(props);
    }

    correctLabel(e) {
        console.log('correcting label');
        const pr = this.props.pr;
        this.props.correctLabel(this.props.prediction, pr.label);
    }

    render() {
        const past = this.props.past;
        const pr = this.props.pr;
        const prediction = this.props.prediction;
        return (
            <Tag
                className='pr-tag'
                color={past ? "#bfbfbf" : "#108ee9"}
                style={{ opacity: pr.score, fontSize: "1.5em", padding: "0.5em", color: past ? 'black' : 'white', fontWeight: "bold" }} > <a onClick={this.correctLabel.bind(this)}><Badge color={prediction.correction == pr.label ? "green" : "red"} />{pr.label}</a></Tag>
        )
    }
}

export default PredictionTag;