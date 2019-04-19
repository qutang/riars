import React, { Component } from "react";
import { hot } from 'react-hot-loader';
import Guide from './layouts/Guide';
import './App.css';
import { message } from 'antd';
import CreateSubject from './layouts/steps/CreateSubject';
import SelectSensors from './layouts/steps/SelectSensors';
import DebugDrawer from './components/DebugDrawer';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.steps = [{
            title: 'Check API service',
            subTitle: 'check if RIARS service is up',
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Create subject',
            subTitle: 'set subject id',
            content: <CreateSubject pattern='RIAR_##' onCreate={this.createSubject.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Select sensors',
            subTitle: 'scan and select nearby devices',
            content: <SelectSensors onSubmit={this.selectSensors.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Setup sensors',
            subTitle: 'choose placement and set parameters for sensors',
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Check sensor status',
            subTitle: 'check if sensors are running correctly and can be viewed from remote',
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Setup model',
            subTitle: 'setup model and activity recognition task',
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Run and monitor',
            subTitle: 'start experiment session',
            validateNext: () => null,
            validateBack: () => null
        }];
        this.apiService = {
            'url': 'localhost:5000'
        }
        this.state = {
            currentSubject: undefined,
            selectedSensors: []
        }
    }

    createSubject(subjectId) {
        this.setState({ currentSubject: subjectId });
        message.success('Created ' + subjectId);
    }

    selectSensors(selectedAddresses) {
        this.setState({
            selectedSensors: selectedAddresses
        });
        message.success('Selected: ' + selectedAddresses.join(','));
    }

    render() {
        return (
            <div className='app-container' >
                <Guide steps={this.steps} />
            </div>
        )
    }
}

export default hot(module)(App);