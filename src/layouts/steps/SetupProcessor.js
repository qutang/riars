import React, { Component } from 'react';
import { Input, Select, Button, Slider } from 'antd';
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

    render() {
        const Option = Select.Option;
        const sensors = this.props.sensors;
        const processorNames = this.props.processorNames;
        console.log(processorNames);
        return (
            <div id='step-setup-processor'>
                <h3>Select a processor</h3>
                <Select className='select-a-processor'
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
                    mode="multiple">
                    {
                        sensors.map((sensor) => {
                            return (
                                <Option key={sensor.address} value={sensor.address}>
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
                {/* <h3>Choose update rate</h3>
                <Slider className='choose-processor-update-rate'
                    defaultValue={this.props.defaultWindowSize}
                    tooltipVisible={true}
                    tipFormatter={(value) => value + ' s'}
                    min={2}
                    max={30}
                    step={0.5}
                    marks={this.windowSizeMarkers}
                    onChange={this.handleUpdateRateChange.bind(this)}>
                </Slider> */}
            </div>

        )
    }
}

export default SetupProcessor;