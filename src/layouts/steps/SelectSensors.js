import React, { Component } from 'react';
import { Button, Checkbox, Spin, Slider, InputNumber, Select } from 'antd';
import './SelectSensors.css';
import SensorSetting from '../../components/SensorSetting';
import SharedSensorSetting from '../../components/SharedSensorSetting';

const CheckboxGroup = Checkbox.Group;

class SelectSensors extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSelectChange(checkedList) {
        this.props.onSubmit(checkedList);
    }

    render() {
        const sensorOptions = this.props.sensors.map((sensor) => {
            return {
                label: sensor.address,
                value: sensor.address
            }
        }
        );
        const defaultOptions = this.props.sensors.filter((sensor) => sensor.selected).map((sensor) => {
            return sensor.address
        });

        return (
            <div id='step-select-sensors'>
                <Button type='primary'
                    onClick={this.props.scanSensors}
                    loading={this.props.isScanningSensors}>
                    Scan nearby devices
                </Button>
                <div className='list-select-sensors'>
                    <CheckboxGroup
                        options={sensorOptions}
                        defaultValue={defaultOptions}
                        onChange={this.handleSelectChange.bind(this)} />
                </div>
                <div className='setup-sensors'>
                    <div className='shared-sensor-settings'>
                        {this.props.sensors.length > 0 && <SharedSensorSetting changeAccelerometerSamplingRate={this.props.changeAccelerometerSamplingRate} changeAccelerometerDynamicRange={this.props.changeAccelerometerDynamicRange} samplingRate={this.props.samplingRate} dynamicRange={this.props.dynamicRange} />}
                    </div>
                    <div className='individual-sensor-settings'>
                        {
                            this.props.sensors.map((sensor) => {
                                return (
                                    sensor.selected && <SensorSetting key={sensor.address} sensor={sensor} changeSensorPlacement={this.props.changeSensorPlacement} changeSensorPort={this.props.changeSensorPort}></SensorSetting>
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