import React, { Component } from 'react';
import { Tag } from 'antd';
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
        const mutualExclusiveFlag = this.props.label.isMutualExclusive ? 'solid' : 'dashed';
        return (
            <a className='annotation-tag' onClick={this.annotate.bind(this)}  ><Tag
                className='annotation-tag-tag'
                color={flag}
                style={{ color: 'white', fontWeight: "bold", border: "2px " + mutualExclusiveFlag + " white" }} >{Prediction.PREDEFINED_CLASS_ABBR[label.name] ? Prediction.PREDEFINED_CLASS_ABBR[label.name] : label.name}</Tag></a>
        )
    }
}

export default AnnotationTag;