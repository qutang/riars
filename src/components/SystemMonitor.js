import React, { Component } from 'react';
import { Tabs } from 'antd';
import SensorTable from './SensorTable';
import ProcessorTable from './ProcessorTable';


class SystemMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const TabPane = Tabs.TabPane;
        const sensors = this.props.sensors;
        const processors = this.props.processors;
        return (
            <Tabs tabPosition='left'>
                <TabPane tab="Instruction" key="instruction">{this.props.children}</TabPane>
                {sensors.length > 0 && <TabPane tab="Sensors" key="sensors">
                    <SensorTable sensors={sensors} />
                </TabPane>
                }
                {processors.length > 0 && <TabPane tab="Processors" key="processor">
                    <ProcessorTable processors={processors} />
                </TabPane>}
            </Tabs>
        )
    }
}

export default SystemMonitor;