import React, { Component } from 'react';
import { Button, Empty } from 'antd';
import UserPredictionMonitor from '../../components/UserPredictionMonitor';
import './RunProcessor.css';

class RunProcessor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            stopping: false
        }
    }

    handleRun() {
        this.setState({
            submitting: true
        });
        setTimeout(() => {
            this.props.runProcessor();
            this.setState({
                submitting: false
            })
        }, 2000);
    }

    handleStop() {
        this.setState({
            stopping: true
        });
        setTimeout(() => {
            this.props.stopProcessor();
            this.setState({
                stopping: false
            })
        }, 2000);
    }

    render() {
        return (
            <div id='step-run-processor'>
                <div className='run-processor-control'>
                    <Button type='primary' loading={this.state.submitting} onClick={this.handleRun.bind(this)}>Submit settings and run the processor</Button>
                    <Button loading={this.state.stopping} onClick={this.handleStop.bind(this)}>Stop the processor</Button>
                </div>
                <div className='processor-monitors'>
                    <div className='expert-monitors'>
                    </div>
                    <div className='user-monitors'>
                        <UserPredictionMonitor predictions={this.props.predictions} />
                    </div>

                </div>

            </div>
        )
    }
}

export default RunProcessor;