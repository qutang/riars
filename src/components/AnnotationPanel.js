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
                            if (label.isMutualExclusive) {
                                const meAnnotations = annotations.filter(({ is_mutual_exclusive, ...rest }) => is_mutual_exclusive);
                                const lastMeAnnotation = meAnnotations.length > 0 ? meAnnotations[meAnnotations.length - 1] : undefined;
                                if (lastMeAnnotation != undefined && lastMeAnnotation['stop_time'] == undefined && label.name == lastMeAnnotation.label_name) {
                                    isOn = true;
                                }
                            }
                            else {
                                const notMeSameAnnotations = annotations.filter(({ is_mutual_exclusive, label_name, ...rest }) => !is_mutual_exclusive && label_name === label.name);
                                const lastNotMeSameAnnotation = notMeSameAnnotations.length > 0 ? notMeSameAnnotations[notMeSameAnnotations.length - 1] : undefined;
                                if (lastNotMeSameAnnotation != undefined && lastNotMeSameAnnotation['stop_time'] == undefined) {
                                    isOn = true;
                                }
                            }
                        }
                        return <AnnotationTag key={label.name} label={label} annotate={this.annotate.bind(this)} isOn={isOn} />
                    })
                }
            </div>
        )
    }
}

export default AnnotationPanel;