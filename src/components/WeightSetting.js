import React, { Component } from 'react';
import { Select, Input } from 'antd';

class WeightSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayWeight: "",
            unit: "kg"
        }
    }

    onWeightChange(e) {
        var value = e.target.value;
        console.log(value);
        this.setState({
            displayWeight: value
        });
        this.props.changeWeight(this.toKg(value, this.state.unit));
    }

    onUnitChange(value) {
        var newDisplayWeight;
        if (value == 'kg') {
            newDisplayWeight = this.toKg(this.state.displayWeight, 'lb');
        } else {
            newDisplayWeight = this.toLb(this.state.displayWeight, 'kg');
        }
        this.setState({
            displayWeight: newDisplayWeight,
            unit: value
        });
    }

    toLb(value, unit) {
        if (unit == 'kg') {
            return value * 2.2046;
        } else {
            return value;
        }
    }

    toKg(value, unit) {
        if (unit == 'kg') {
            return value;
        } else {
            return value / 2.2046;
        }
    }

    render() {
        const Option = Select.Option;
        const unitComponent = (
            <Select onChange={this.onUnitChange.bind(this)} value={this.state.unit}>
                <Option value="kg">kg</Option>
                <Option value="lb">lb</Option>
            </Select>
        );
        return (
            <Input className='create-subject-item-control' step={1} addonAfter={unitComponent} value={this.state.displayWeight} onChange={this.onWeightChange.bind(this)} placeholder="Enter weight" />
        )
    }
}

export default WeightSetting;