import React, { Component } from 'react';
import { Input } from 'antd';
import AnnotationTag from './AnnotationTag';


class AnnotationPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    annotate(label) {
        console.log('annotating label');
        this.props.annotate(label);
    }

    render() {
        const annotations = this.props.annotations;
        const labels = this.props.labels;
        return (
            <div className='label-list'>
                {
                    labels.map((label) => {
                        let isOn = false;
                        if (annotations.length > 0) {
                            const lastAnnotation = annotations[annotations.length - 1];
                            if (lastAnnotation['stop_time'] == undefined && label == lastAnnotation.label_name) {
                                isOn = true;
                            }
                        }
                        return <AnnotationTag key={label} label={label} annotate={this.annotate.bind(this)} isOn={isOn} />
                    })
                }
            </div>
        )
    }
}

export default AnnotationPanel;