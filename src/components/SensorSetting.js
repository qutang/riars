import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Sensor from '../models/Sensor';


class SensorSetting extends React.Component {
    constructor(props) {
        super(props)

    }

    handlePlacementChange(value) {
        const address = this.props.sensor.address;
        this.props.changeSensorPlacement(address, value);
    }

    handlePortChange(value) {
        const address = this.props.sensor.address;
        this.props.changeSensorPort(address, value);
    }

    componentDidMount() {
        this.handlePlacementChange(this.props.sensor.name);
    }

    render() {
        const sensor = this.props.sensor;
        const Option = Select.Option;
        const predefinedPlacements = Sensor.PREDEFINED_PLACEMENTS;
        return (
            <div className='setup-a-sensor'>
                <h3>{sensor.address}</h3>
                <h5>Select placement</h5>
                <Select
                    defaultValue={sensor.name}
                    className='choose-placement'
                    showSearch
                    placeholder="Select a placement"
                    onChange={this.handlePlacementChange.bind(this)}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {
                        Object.keys(predefinedPlacements).map((value, index) => {
                            console.log(value)
                            return (
                                <Option key={value} value={value}>{predefinedPlacements[value]}</Option>
                            )
                        })
                    }
                </Select>
                <h5>Select port</h5>
                <InputNumber min={8000} max={8100} defaultValue={8000} value={sensor.port} onChange={this.handlePortChange.bind(this)} />
            </div>
        )
    }
}

export default SensorSetting;