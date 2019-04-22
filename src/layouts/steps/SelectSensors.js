import React, { Component } from 'react';
import { Button, Checkbox, Spin } from 'antd';
import './SelectSensors.css';

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
            </div >
        )
    }
}

export default SelectSensors;