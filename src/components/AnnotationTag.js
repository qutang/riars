import React, { Component } from 'react';
import { Tag, Badge, Button } from 'antd';
import Prediction from '../models/Prediction';


class AnnotationTag extends React.Component {
    constructor(props) {
        super(props);
    }

    annotate() {
        this.props.annotate(this.props.label);
    }

    render() {
        const label = this.props.label;
        const flag = this.props.isOn ? "#a0d911" : "#cf1322";
        return (
            <a className='annotation-tag' onClick={this.annotate.bind(this)}  ><Tag
                className='annotation-tag-tag'
                color={flag}
                style={{ color: 'white', fontWeight: "bold", border: "2px solid  white" }} >{Prediction.PREDEFINED_CLASS_ABBR[label] ? Prediction.PREDEFINED_CLASS_ABBR[label] : label}</Tag></a>
        )
    }
}

export default AnnotationTag;