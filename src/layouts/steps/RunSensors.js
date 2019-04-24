import React, { Component } from 'react';
import { Button } from 'antd';
import SensorMonitor from '../../components/SensorMonitor';
import './RunSensors.css';

class RunSensors extends React.Component {
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
            this.props.runSensors();
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
            this.props.stopSensors();
            this.setState({
                stopping: false
            })
        }, 2000);
    }

    render() {
        const sensors = this.props.sensors;
        return (
            <div id='step-run-sensors'>
                <div className='run-sensors-control'>
                    <Button type='primary' loading={this.state.submitting} onClick={this.handleRun.bind(this)}>Submit settings and run sensors</Button>
                    <Button loading={this.state.stopping} onClick={this.handleStop.bind(this)}>Stop sensors</Button>
                </div>
                <div className='sensor-monitors'>
                    {
                        sensors.map((sensor) => {
                            return (
                                sensor.selected && <SensorMonitor key={sensor.address} sensor={sensor} />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default RunSensors;