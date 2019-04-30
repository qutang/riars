import React, { Component } from 'react';
import { Select, Slider, InputNumber } from 'antd';
import Sensor from '../models/Sensor';

class ProcessorSetting extends React.Component {
    constructor(props) {
        super(props);
        this.predefinedPlacements = Sensor.PREDEFINED_PLACEMENTS;
        this.windowSizeMarkers = {
            12.8: '12.8 s',
            6.4: '6.4 s',
            3.2: '3.2 s'
        };
    }

    render() {
        const sensors = this.props.sensors;
        const Option = Select.Option;
        const p = this.props.processor;
        return (
            <div className='processor-settings'>
                <h3>Select input sensors</h3>
                <Select className='select-processor-input'
                    onChange={this.props.handleInputChange.bind(this)}
                    defaultValue={undefined}
                    value={p.inputUrls}
                    mode="multiple">
                    {
                        sensors.filter((sensor) => sensor.selected).map((sensor) => {
                            return (
                                <Option key={sensor.name} value={sensor.url}>
                                    {this.predefinedPlacements[sensor.name]}
                                </Option>
                            )
                        })
                    }
                </Select>
                <h3>Choose window size</h3>
                <Slider className='choose-processor-window-size'
                    defaultValue={12.8}
                    value={p.windowSize}
                    tooltipVisible={true}
                    tipFormatter={(value) => value + ' s'}
                    min={2}
                    max={30}
                    step={0.5}
                    marks={this.windowSizeMarkers}
                    onChange={this.props.handleWindowSizeChange.bind(this)}>
                </Slider>
                <h3>Choose update rate</h3>
                <Slider className='choose-processor-update-rate'
                    defaultValue={12.8}
                    value={p.updateRate}
                    tooltipVisible={true}
                    tipFormatter={(value) => value + ' s'}
                    min={2}
                    max={30}
                    step={0.5}
                    marks={this.windowSizeMarkers}
                    onChange={this.props.handleUpdateRateChange.bind(this)}>
                </Slider>
                <h3>Set automatic stop</h3>
                <p>The number of windows of samples to be processed before the processor automatically shuts down. When it is 0, the processor will run forever until user manually stops it.</p>
                <InputNumber
                    value={p.numberOfWindows}
                    defaultValue={0}
                    min={0}
                    onChange={this.props.handleNumberOfWindowsChange.bind(this)}></InputNumber>
                <h3>Choose output port</h3>
                <InputNumber
                    defaultValue={9000}
                    value={p.port}
                    min={0}
                    onChange={this.props.handlePortChange.bind(this)}></InputNumber>
            </div>
        )
    }
}

export default ProcessorSetting;