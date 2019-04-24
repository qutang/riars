import React, { Component } from 'react';
import { Slider } from 'antd';

class SharedSensorSetting extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.changeAccelerometerSamplingRate(this.props.samplingRate);
        this.props.changeAccelerometerDynamicRange(this.props.dynamicRange);
    }

    render() {
        return (
            <div>
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
        )
    }
}

export default SharedSensorSetting;