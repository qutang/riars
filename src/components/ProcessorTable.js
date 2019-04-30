import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import './ProcessorTable.css';

class ProcessorTable extends React.Component {
    constructor(props) {
        super(props);
    }

    initDataSource(processors) {
        const dataSource = processors.map((processor, index) => {
            const data = {
                key: String(index)
            }
            const processorObj = processor.toTable();
            processorObj.inputUrls = processorObj.inputUrls.join(', ');
            processorObj.selected = String(processorObj.selected);
            const result = { ...data, ...processorObj }
            return result
        });
        return dataSource;
    }

    initColumns(processor) {
        const processorObj = processor.toTable();
        const keys = Object.keys(processorObj);
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
        const processors = this.props.processors;
        const dataSource = this.initDataSource(processors);
        const columns = this.initColumns(processors[0]);
        return (
            <Table
                bordered
                pagination={false}
                className='processor-table'
                dataSource={dataSource}
                columns={columns}></Table>
        )
    }
}

export default ProcessorTable;