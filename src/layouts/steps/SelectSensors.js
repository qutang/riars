import React, { Component } from 'react';
import { Button, Checkbox, Spin } from 'antd';
import './SelectSensors.css';

const CheckboxGroup = Checkbox.Group;

class SelectSensors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSensorAddresses: [],
            candidateSensorAddresses: [],
            scanning: false
        }
    }

    handleScan() {
        this.setState({
            scanning: true
        })
        setTimeout(() => {
            this.setState({
                candidateSensorAddresses: [
                    'sensor A', 'sensor B', 'sensor C'
                ],
                scanning: false
            })
        }, 2000);
    }

    handleSelectChange(checkedList) {
        this.setState({
            selectedSensorAddresses: checkedList
        })
        this.props.onSubmit(checkedList);
    }

    render() {
        return (
            <div id='step-select-sensors'>
                <Button type='primary' onClick={() => this.handleScan()} loading={this.state.scanning}>Scan nearby devices</Button>
                <div className='list-select-sensors'>
                    <CheckboxGroup options={this.state.candidateSensorAddresses} value={this.state.selectedSensorAddresses} onChange={(checkedList) => this.handleSelectChange(checkedList)} />
                </div>
            </div >
        )
    }
}

export default SelectSensors;