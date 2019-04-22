import { log } from "util";

import React, { Component } from 'react';
import { Slider, InputNumber, Button, Select } from 'antd';
import SensorSetting from '../../components/SensorSetting';
import './SetupSensors.css';

class SetupSensors extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.selectedSensors.map((sensor) => sensor.address));
        return (
            <div id='step-setup-sensors'>
                <h3>Sampling Rate</h3>
                <Slider
                    onChange={this.props.changeAccelerometerSamplingRate}
                    tooltipVisible
                    defaultValue={this.props.samplingRate}
                    max={100}
                    min={10}
                    step={10}
                    tipFormatter={(value) => {
                        return `${value} Hz`
                    }} />
                <h3>Dynamic range</h3>
                <Slider
                    onChange={this.props.changeAccelerometerDynamicRange}
                    tooltipVisible
                    defaultValue={this.props.dynamicRange}
                    max={16}
                    min={2}
                    step={1}
                    tipFormatter={(value) => {
                        return `${value} g`
                    }} />
                <div className='setup-sensors-each'>
                    {
                        this.props.selectedSensors.map((sensor) => {
                            return (
                                <SensorSetting key={sensor.address} sensor={sensor} changeSensorPlacement={this.props.changeSensorPlacement} changeSensorPort={this.props.changeSensorPort}
                                    defaultPort={this.props.defaultPort}></SensorSetting>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default SetupSensors
