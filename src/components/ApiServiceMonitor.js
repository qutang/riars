import React, { Component } from 'react';
import { Badge, Popover, Input, Tooltip } from 'antd';
import ApiServiceSetting from './ApiServiceSetting';

class ApiServiceMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const service = this.props.service;
        const status = service.status == 'running' ? 'success' : 'error';
        const url = service.getUrl();
        return (

            <div className='api-service-status'>
                <Popover className='api-service-popover' content={<ApiServiceSetting service={service} title='Set api service' updateService={this.props.updateService} />} trigger="click" arrowPointAtCenter>
                    <Tooltip title={url + ' is ' + status + '; click to set new service address.'}>
                        <Badge status={status} text={'Service address: ' + url} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                </Popover>
            </div >
        )
    }
}

export default ApiServiceMonitor;