import React, { Component } from 'react';
import { Tabs, Collapse } from 'antd';
import SensorTable from './SensorTable';
import ProcessorTable from './ProcessorTable';


class SystemMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const TabPane = Tabs.TabPane;
        const Panel = Collapse.Panel;
        const sensors = this.props.sensors;
        const processors = this.props.processors;
        return (
            <Collapse bordered={false} defaultActiveKey={['instruction']}>
                <Panel header="Instruction" key="instruction" className='monitor-panel'>{this.props.children}</Panel>
                {sensors.length > 0 && <Panel header="Sensors" key="sensors" className='monitor-panel'>
                    <SensorTable sensors={sensors} />
                </Panel>
                }
                {processors.length > 0 && <Panel header="Processors" key="processor" className='monitor-panel'>
                    <ProcessorTable processors={processors} />
                </Panel>}
            </Collapse>
        )
    }
}

export default SystemMonitor;