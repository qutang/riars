import React, { Component } from 'react';
import { Button, Checkbox, Spin, Slider, InputNumber, Select } from 'antd';
import './SelectSensors.css';
import SensorSetting from '../../components/SensorSetting';

const CheckboxGroup = Checkbox.Group;

class SelectSensors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanning: false
        }
    }

    handleScan() {
        this.setState({
            scanning: true
        })
        setTimeout(() => {
            this.props.scanSensors();
            this.setState({
                scanning: false
            })
        }, 2000);
    }

    handleSelectChange(checkedList) {
        this.props.onSubmit(checkedList);
    }

    render() {
        return (
            <div id='step-select-sensors'>
                <Button type='primary'
                    onClick={this.handleScan.bind(this)}
                    loading={this.state.scanning}>
                    Scan nearby devices
                </Button>
                <div className='list-select-sensors'>
                    <CheckboxGroup
                        options={this.props.availableSensorAddresses}
                        value={this.props.selectedSensorAddresses}
                        onChange={this.handleSelectChange.bind(this)} />
                </div>
                <div className='setup-sensors'>
                    <div className='shared-sensor-settings'>
                        <h3>Shared sensor settings</h3>
                        <h4>Accelerometer sampling rate</h4>
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
                        <h4>Accelerometer dynamic range</h4>
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
                    </div>
                    <div className='individual-sensor-settings'>
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
            </div >
        )
    }
}

export default SelectSensors;