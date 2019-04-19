import { log } from "util";

import React, { Component } from 'react';
import { Slider, Input, Button } from 'antd';
import './SetupSensors.css';

class SetupSensors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            samplingRate: 50,
            dynamicRange: 8
        }
    }

    render() {
        console.log(this.props.selectedSensors);
        return (
            <div id='step-setup-sensors'>
                <h4>Sampling Rate</h4>
                <Slider
                    defaultValue={this.state.samplingRate}
                    max={100}
                    min={10}
                    step={10}
                    tipFormatter={(value) => {
                        return `${value} Hz`
                    }} />
                <h4>Dynamic range</h4>
                <Slider
                    defaultValue={this.state.dynamicRange}
                    max={16}
                    min={2}
                    step={1}
                    tipFormatter={(value) => {
                        return `${value} g`
                    }} />
                {
                    this.props.selectedSensors.map((address) => {
                        return (
                            <div>
                                <h4>{address}</h4>

                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default SetupSensors
