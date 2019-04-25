import React, { Component } from 'react';
import { Input, InputNumber, Select } from 'antd';
import './ApiServiceSetting.css';


class ApiServiceSetting extends React.Component {
    constructor(props) {
        super(props);
    }

    changeServiceProtocol(value) {
        const protocol = value;
        const host = this.props.service.host;
        const port = this.props.service.port;
        console.log(this.props)
        this.props.updateService(protocol, host, port);
    }

    changeServicePort(value) {
        const protocol = this.props.service.protocol;
        const host = this.props.service.host;
        const port = value;
        this.props.updateService(protocol, host, port);
    }

    changeServiceHost(e) {
        const protocol = this.props.service.protocol;
        const host = e.target.value;
        const port = this.props.service.port;
        this.props.updateService(protocol, host, port);
    }

    render() {
        const InputGroup = Input.Group;
        const Option = Select.Option;
        const service = this.props.service;
        const protocolSelect = (
            <Select className='service-protocol-setting' defaultValue={service.protocol} onChange={this.changeServiceProtocol.bind(this)}>
                <Option value="http">Http://</Option>
                <Option value="https">Https://</Option>
            </Select>
        )
        const portSelect = (
            <InputNumber defaultValue={service.port} step={1} min={3000} max={99999} onChange={this.changeServicePort.bind(this)} />
        )
        return (
            <div className='api-service-setting'>
                <InputGroup compact>
                    {protocolSelect}
                    <Input className='service-host-setting' defaultValue={service.host} placeholder='hostname or IP address' onChange={this.changeServiceHost.bind(this)} />
                    {portSelect}
                </InputGroup>
            </div>
        )
    }
}

export default ApiServiceSetting;