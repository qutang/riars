import React, { Component } from 'react';
import { Select, Slider, InputNumber } from 'antd';

class ProcessorSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Option = Select.Option;
        const processors = this.props.processors;
        const selectedProcessor = processors.filter((p) => p.selected);
        return (
            <div className='processor-settings'>
                <h3>Select a processor</h3>
                <Select className='select-a-processor'
                    defaultValue={selectedProcessor.length > 0 ? selectedProcessor[0].name : undefined}
                    onChange={this.props.handleProcessorChange.bind(this)}>
                    {
                        processors.map((processor) => {
                            return (
                                <Option key={processor.name} value={processor.name}>
                                    {processor.name}
                                </Option>
                            )
                        })
                    }
                </Select>
            </div>
        )
    }
}

export default ProcessorSelector;