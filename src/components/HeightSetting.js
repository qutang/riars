import React from 'react';
import { Input, Select, InputNumber, Divider } from 'antd';


class HeightSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: 'cm',
            displayHeight: [0, 0]
        }
    }

    onUnitChange(value) {
        var newDisplayHeight;
        if (value == 'cm') {
            newDisplayHeight = this.toCm(this.state.displayHeight, 'ft&in');
        } else {
            newDisplayHeight = this.toFtIn(this.state.displayHeight, 'cm');
        }
        this.setState({
            displayHeight: newDisplayHeight,
            unit: value
        })
    }

    onHeightCmChange(value) {
        this.setState({
            displayHeight: [value]
        });
        this.props.changeHeight(this.toCm([value], this.state.unit)[0]);
    }

    onHeightFeetChange(value) {
        this.setState({
            displayHeight: [value, this.state.displayHeight[1]]
        });
        this.props.changeHeight(this.toCm([value, this.state.displayHeight[1]], this.state.unit)[0]);
    }

    onHeightInchChange(value) {
        this.setState({
            displayHeight: [this.state.displayHeight[0], value]
        });
        this.props.changeHeight(this.toCm([this.state.displayHeight[0], value], this.state.unit)[0]);
    }

    toCm(value, unit) {
        if (unit == 'cm') {
            return value.slice(0);
        } else {
            return [value[0] * 30.48 + value[1] * 2.54];
        }
    }

    toFtIn(value, unit) {
        if (unit == 'cm') {
            var inches = value[0] / 2.54;
            var feet = Math.floor(inches / 12);
            var inch = inches % 12;
            return [feet, inch];
        } else {
            return value.slice(0);
        }
    }

    render() {
        const Option = Select.Option;
        const unitComponent = (
            <Select onChange={this.onUnitChange.bind(this)} value={this.state.unit}>
                <Option value="ft&in">ft & in</Option>
                <Option value="cm">cm</Option>
            </Select>
        )
        const cmHeightComponent = (
            <InputNumber className='create-subject-item-control' step={0.1} min={100.0} max={250.0} placeholder='Enter height' value={this.state.displayHeight[0]} onChange={this.onHeightCmChange.bind(this)} />
        )

        const ftHeightComponent = (
            <div className='create-subject-item-control'>
                <InputNumber step={0.1} min={0} max={10.0} value={this.state.displayHeight[0]} onChange={this.onHeightFeetChange.bind(this)} /> <InputNumber step={0.1} min={0} max={11.0} value={this.state.displayHeight[1]} onChange={this.onHeightInchChange.bind(this)} />
            </div>
        )
        return (
            <>
                {this.state.unit == 'cm' ? cmHeightComponent : ftHeightComponent}
                {unitComponent}
            </>
        )
    }
}

export default HeightSetting;