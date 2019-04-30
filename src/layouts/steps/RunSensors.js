import React, { Component } from 'react';
import { Button } from 'antd';
import SensorMonitor from '../../components/SensorMonitor';
import './RunSensors.css';

class RunSensors extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const sensors = this.props.sensors;
        return (
            <div id='step-run-sensors'>
                <div className='run-sensors-control'>
                    <Button type='primary' loading={this.props.isStartingSensors} onClick={this.props.runSensors}>Submit settings and run sensors</Button>
                    <Button loading={this.props.isStoppingSensors} onClick={this.props.stopSensors}>Stop sensors</Button>
                </div>
                <div className='sensor-monitors'>
                    {
                        sensors.map((sensor) => {
                            return (
                                sensor.selected && <SensorMonitor key={sensor.address} sensor={sensor} connectSensor={this.props.connectSensor} />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default RunSensors;