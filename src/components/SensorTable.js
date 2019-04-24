import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import './SensorTable.css';

class SensorTable extends React.Component {
    constructor(props) {
        super(props);
    }

    initDataSource(sensors) {
        const dataSource = sensors.map((sensor, index) => {
            const data = {
                key: String(index)
            }
            const sensorObj = sensor.toTable()
            sensorObj.selected = String(sensorObj.selected);
            const result = { ...data, ...sensorObj }
            return result
        });
        return dataSource;
    }

    initColumns(sensor) {
        const sensorObj = sensor.toTable();
        const keys = Object.keys(sensorObj);
        const result = keys.map((key) => {
            return {
                title: key,
                dataIndex: key,
                key: key
            }
        });
        return result;
    }

    render() {
        const sensors = this.props.sensors;
        const dataSource = this.initDataSource(sensors);
        const columns = this.initColumns(sensors[0]);
        return (
            <Table
                bordered
                pagination={false}
                className='sensor-table'
                dataSource={dataSource}
                columns={columns}></Table>
        )
    }
}

export default SensorTable;