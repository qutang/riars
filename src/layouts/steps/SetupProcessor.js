import React, { Component } from 'react';
import { Input, Select, Button, Slider, InputNumber } from 'antd';
import Sensor from '../../models/Sensor';
import './SetupProcessor.css';

class SetupProcessor extends React.Component {
    constructor(props) {
        super(props);
        this.predefinedPlacements = Sensor.PREDEFINED_PLACEMENTS;
        this.windowSizeMarkers = {
            12.8: '12.8 s',
            6.4: '6.4 s',
            3.2: '3.2 s'
        };
    }

    handleWindowSizeChange(value) {
        this.props.changeProcessorWindowSize(value);
    }

    handleProcessorChange(name) {
        this.props.selectProcessor(name);
    }

    handleInputChange(values) {
        this.props.changeProcessorInputs(values);
    }

    handleUpdateRateChange(value) {
        this.props.changeProcessorUpdateRate(value);
    }

    handleNumberOfWindowsChange(value) {
        this.props.changeProcessorNumberOfWindows(value);
    }

    handlePortChange(value) {
        this.props.changeProcessorPort(value);
    }

    render() {
        const Option = Select.Option;
        const sensors = this.props.sensors;
        const processorNames = this.props.processorNames;
        console.log(processorNames);
        return (
            <div id='step-setup-processor'>
                <h3>Select a processor</h3>
                <Select className='select-a-processor'
                    defaultValue={this.props.selectedProcessor ? this.props.selectedProcessor.name : undefined}
                    onChange={this.handleProcessorChange.bind(this)}>
                    {
                        processorNames.map((name) => {
                            return (
                                <Option key={name} value={name}>
                                    {name}
                                </Option>
                            )
                        })
                    }
                </Select>
                <h3>Select input sensors</h3>
                <Select className='select-processor-input'
                    onChange={this.handleInputChange.bind(this)}
                    defaultValue={this.props.selectedProcessor ? this.props.selectedProcessor.inputUrls : []}
                    mode="multiple">
                    {
                        sensors.map((sensor) => {
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
                    defaultValue={this.props.defaultWindowSize}
                    tooltipVisible={true}
                    tipFormatter={(value) => value + ' s'}
                    min={2}
                    max={30}
                    step={0.5}
                    marks={this.windowSizeMarkers}
                    onChange={this.handleWindowSizeChange.bind(this)}>
                </Slider>
                <h3>Choose update rate</h3>
                <Slider className='choose-processor-update-rate'
                    defaultValue={this.props.selectedProcessor ? this.props.selectedProcessor.updateRate : 12.8}
                    tooltipVisible={true}
                    tipFormatter={(value) => value + ' s'}
                    min={2}
                    max={30}
                    step={0.5}
                    marks={this.windowSizeMarkers}
                    onChange={this.handleUpdateRateChange.bind(this)}>
                </Slider>
                <h3>Set automatic stop</h3>
                <p>The number of windows of samples to be processed before the processor automatically shuts down. When it is 0, the processor will run forever until user manually stops it.</p>
                <InputNumber
                    defaultValue={this.props.selectedProcessor ? this.props.selectedProcessor.numberOfWindows : 0}
                    min={0}
                    onChange={this.handleNumberOfWindowsChange.bind(this)}></InputNumber>
                <h3>Choose output port</h3>
                <InputNumber
                    defaultValue={this.props.selectedProcessor ? this.props.selectedProcessor.port : 9000}
                    min={0}
                    onChange={this.handlePortChange.bind(this)}></InputNumber>
            </div >

        )
    }
}

export default SetupProcessor;