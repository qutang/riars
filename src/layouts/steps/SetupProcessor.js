import React, { Component } from 'react';
import { Select } from 'antd';
import Sensor from '../../models/Sensor';
import ProcessorSetting from '../../components/ProcessorSetting';
import ProcessorSelector from '../../components/ProcessorSelector';
import './SetupProcessor.css';

class SetupProcessor extends React.Component {
    constructor(props) {
        super(props);
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
        const sensors = this.props.sensors;
        const processors = this.props.processors;
        const selectedProcessor = processors.filter((processor) => processor.selected);
        console.log(selectedProcessor);
        return (
            <div id='step-setup-processor'>
                <ProcessorSelector
                    processors={processors}
                    handleProcessorChange={this.handleProcessorChange.bind(this)} />
                {
                    processors.map((p) => {
                        return (
                            p.selected && <ProcessorSetting
                                key={p.name}
                                sensors={sensors}
                                handleInputChange={this.handleInputChange.bind(this)}
                                handleNumberOfWindowsChange={this.handleNumberOfWindowsChange.bind(this)}
                                handlePortChange={this.handlePortChange.bind(this)}
                                handleUpdateRateChange={this.handleUpdateRateChange.bind(this)}
                                handleWindowSizeChange={this.handleWindowSizeChange.bind(this)}
                                processor={p} />
                        )
                    })
                }
            </div >

        )
    }
}

export default SetupProcessor;