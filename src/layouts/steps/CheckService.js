import React, { Component } from 'react';
import { Input, Button } from 'antd';
import './CheckService.css';


class CheckService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.api_host,
            checking: false
        }
    }

    handleChange(e) {
        this.setState({
            url: e.target.value
        })
    }

    handleSubmit() {
        this.setState({
            checking: true
        })
        const url = this.state.url
        setTimeout(() => {
            this.props.onCheckService(url);
            this.setState({
                checking: false
            })
        }, 2000);
    }

    render() {
        return (
            <div id='step-check-service'>
                <Input
                    addonBefore={this.props.api_protocol}
                    addonAfter={':' + this.props.api_port}
                    defaultValue={this.props.api_host}
                    onChange={(e) => this.handleChange(e)}
                    onPressEnter={() => this.handleSubmit()}>
                </ Input>
                <Button loading={this.state.checking} type='primary' onClick={() => this.handleSubmit()}>Check availability</Button>
            </div>
        )
    }
}

export default CheckService;