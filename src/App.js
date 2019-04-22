import React, { Component } from "react";
import { hot } from 'react-hot-loader';
import Guide from './layouts/Guide';
import './App.css';
import { message } from 'antd';
import CreateSubject from './layouts/steps/CreateSubject';
import SelectSensors from './layouts/steps/SelectSensors';
import CheckService from './layouts/steps/CheckService';
import SetupSensors from './layouts/steps/SetupSensors';
import RunSensors from './layouts/steps/RunSensors';
import SensorTable from './components/SensorTable';
import SetupProcessor from './layouts/steps/SetupProcessor';
import Sensor from './models/Sensor';
import Processor from './models/Processor';
import DebugDrawer from './components/DebugDrawer';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSubject: undefined,
            selectedSensors: [],
            availableSensorAddresses: [],
            selectedProcessor: undefined,
            availableProcessorNames: [],
            apiServicePort: '5000',
            apiServiceProtocol: 'http://',
            apiServiceHost: 'localhost',
            accelerometerSamplingRate: 50,
            accelerometerDynamicRange: 8,
            sensorDefaultPort: 8000
        }
    }

    checkApiService(url) {
        this.setState({
            apiServiceHost: url
        });
        const apiUrl = this.state.apiServiceProtocol + this.state.apiServiceHost + ":" + this.state.apiServicePort;
        this.queryProcessors();
        message.success(apiUrl + " is available");
    }

    createSubject(subjectId) {
        this.setState({ currentSubject: subjectId });
        message.success('Created ' + subjectId);
    }

    scanSensors() {
        const selectedAddresses = [];
        if (this.state.selectSensors !== undefined) {
            selectedAddresses = this.state.selectSensors.map((sensor) => sensor.address);
        }
        const scannedSensorAddresses = ['Sensor A', 'Sensor B', 'Sensor C']
        const availableSensorAddresses = [...new Set([...selectedAddresses, ...scannedSensorAddresses])]
        this.setState(
            {
                availableSensorAddresses: availableSensorAddresses
            }
        )
        message.success('Finished scanning nearby sensors')
    }

    selectSensors(selectedAddresses) {
        const selectedSensors = selectedAddresses.map((address, index) => {
            const sensor = new Sensor(address);
            sensor.dynamicRange = this.state.accelerometerDynamicRange;
            sensor.samplingRate = this.state.accelerometerSamplingRate;
            sensor.order = index;
            sensor.port = this.state.sensorDefaultPort + index;
            sensor.status = 'stopped';
            return sensor;
        });
        this.setState({
            selectedSensors: selectedSensors
        });
        message.success('Selected: ' + selectedAddresses.join(','));
    }

    changeAccelerometerSamplingRate(samplingRate) {
        const updatedSensors = this.state.selectedSensors.map((sensor) => {
            sensor.samplingRate = samplingRate;
            return sensor;
        });
        this.setState({
            accelerometerSamplingRate: samplingRate,
            selectedSensors: updatedSensors
        });
        message.success('Updated sampling rate for selected sensors');
    }

    changeAccelerometerDynamicRange(dynamicRange) {
        const updatedSensors = this.state.selectedSensors.map((sensor) => {
            sensor.dynamicRange = dynamicRange;
            return sensor;
        });
        this.setState({
            accelerometerDynamicRange: dynamicRange,
            selectedSensors: updatedSensors
        });
        message.success('Updated dynamic range for selected sensors');
    }

    changeSensorPlacement(address, value) {
        const updatedSensors = this.state.selectedSensors.map((sensor) => {
            if (sensor.address == address) {
                sensor.name = value;
            }
            return sensor;
        });
        this.setState({
            selectedSensors: updatedSensors
        });
    }

    changeSensorPort(address, value) {
        const updatedSensors = this.state.selectedSensors.map((sensor) => {
            if (sensor.address == address) {
                sensor.port = value;
            }
            return sensor;
        });
        this.setState({
            selectedSensors: updatedSensors
        });
    }

    runSensors() {
        console.log('running sensors');
        const updatedSensors = this.state.selectedSensors.map((sensor) => {
            sensor.status = 'running';
            return sensor;
        });
        this.setState({
            selectedSensors: updatedSensors
        });
    }

    stopSensors() {
        console.log('stopping sensors');
        const updatedSensors = this.state.selectedSensors.map((sensor) => {
            sensor.status = 'stopped';
            return sensor;
        });
        this.setState({
            selectedSensors: updatedSensors
        });
    }

    queryProcessors() {
        this.setState({
            availableProcessorNames: ['activity-model', 'posture-model']
        });
    }

    selectProcessor(name) {
        const selectedProcessor = new Processor(name);
        this.setState({
            selectedProcessor: selectedProcessor
        });
    }

    changeProcessorWindowSize(value) {
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.windowSize = value;
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    render() {
        const steps = [{
            title: 'Check API service',
            subTitle: 'check if RIARS service is up',
            content: <CheckService api_protocol={this.state.apiServiceProtocol} api_port={this.state.apiServicePort} api_host={this.state.apiServiceHost} onCheckService={this.checkApiService.bind(this)} />,
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
            content: <SelectSensors onSubmit={this.selectSensors.bind(this)}
                availableSensorAddresses={this.state.availableSensorAddresses}
                selectedSensorAddresses={this.state.selectedSensors.map((sensor) => sensor.address)}
                scanSensors={this.scanSensors.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Setup sensors',
            subTitle: 'choose placement and set parameters for sensors',
            content: <SetupSensors
                selectedSensors={this.state.selectedSensors}
                samplingRate={this.state.accelerometerSamplingRate}
                dynamicRange={this.state.accelerometerDynamicRange}
                defaultPort={this.state.sensorDefaultPort}
                changeAccelerometerSamplingRate={this.changeAccelerometerSamplingRate.bind(this)}
                changeAccelerometerDynamicRange={this.changeAccelerometerDynamicRange.bind(this)}
                changeSensorPlacement={this.changeSensorPlacement.bind(this)}
                changeSensorPort={this.changeSensorPort.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Run and monitor sensors',
            subTitle: 'Submit settings, run and monitor sensors',
            description: <SensorTable sensors={this.state.selectedSensors} />,
            content: <RunSensors runSensors={this.runSensors.bind(this)} stopSensors={this.stopSensors.bind(this)} selectedSensors={this.state.selectedSensors} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Setup model',
            subTitle: 'setup model and activity recognition task',
            content: <SetupProcessor sensors={this.state.selectedSensors} processorNames={this.state.availableProcessorNames} defaultWindowSize={this.state.selectedProcessor ? this.state.selectedProcessor.windowSize || 12.8 : 12.8} selectProcessor={this.selectProcessor.bind(this)} changeProcessorWindowSize={this.changeProcessorWindowSize.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Run and monitor',
            subTitle: 'start experiment session',
            validateNext: () => null,
            validateBack: () => null
        }];
        return (
            <div className='app-container' >
                <Guide steps={steps} />
            </div>
        )
    }
}

export default hot(module)(App);