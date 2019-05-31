import React, { Component } from 'react';
import { Button, Empty } from 'antd';
import UserPredictionMonitor from '../../components/UserPredictionMonitor';
import './RunProcessor.css';

class RunProcessor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='step-run-processor'>
                <div className='run-processor-control'>
                    <Button type='primary' loading={this.props.isStartingProcessor} onClick={this.props.runProcessor}>Submit settings and run the processor</Button>
                    <Button loading={this.props.isStoppingProcessor} onClick={this.props.stopProcessor}>Stop the processor</Button>
                    <Button loading={this.props.isUploadingAnnotations} onClick={this.props.uploadAnnotations}>Upload annotations</Button>
                </div>
                <div className='processor-monitors'>
                    <div className='expert-monitors'>
                    </div>
                    <div className='user-monitors'>
                        <UserPredictionMonitor predictions={this.props.predictions} processors={this.props.processors} annotations={this.props.annotations} numOfPastPredictions={this.props.numOfPastPredictions} changeNumOfPastPredictions={this.props.changeNumOfPastPredictions} annotate={this.props.annotate} correctLabel={this.props.correctLabel}
                            addPredictionNote={this.props.addPredictionNote.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}

export default RunProcessor;