import React, { Component } from "react";
import { Tag, Icon } from 'antd';
import { hot } from 'react-hot-loader';
import Guide from './layouts/Guide';
import './App.css';
import { message } from 'antd';
import CreateSubject from './layouts/steps/CreateSubject';
import SelectSensors from './layouts/steps/SelectSensors';
import CheckService from './layouts/steps/CheckService';
import RunSensors from './layouts/steps/RunSensors';
import SetupProcessor from './layouts/steps/SetupProcessor';
import RunProcessor from './layouts/steps/RunProcessor';
import Sensor from './models/Sensor';
import Processor from './models/Processor';
import Prediction from './models/Prediction';
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
            sensorDefaultPort: 8000,
            predictions: [new Prediction([{ label: 'Walking', score: 0.3 }, { label: 'Sitting', score: 0.6 }, { label: 'Lying', score: 0.2 }]), new Prediction([{ label: 'Walking', score: 0.3 }, { label: 'Sitting', score: 0.6 }, { label: 'Lying', score: 0.2 }]), new Prediction([{ label: 'Walking', score: 0.2 }, { label: 'Sitting', score: 0.7 }, { label: 'Lying', score: 0.3 }])]
        }
        console.log(this.state.predictions);
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

    changeProcessorUpdateRate(value) {
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.updateRate = value;
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    changeProcessorInputs(inputUrls) {
        console.log(inputUrls);
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.inputUrls = inputUrls;
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    changeProcessorNumberOfWindows(value) {
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.numberOfWindows = value;
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    changeProcessorPort(value) {
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.port = value;
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    runProcessor() {
        console.log('running processor');
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.status = 'running'
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    stopProcessor() {
        console.log('stopping processor');
        const updatedProcessor = Processor.copy(this.state.selectedProcessor);
        updatedProcessor.status = 'stopped';
        this.setState({
            selectedProcessor: updatedProcessor
        });
    }

    render() {
        const steps = [{
            title: 'Check API service',
            subTitle: 'check if RIARS service is up',
            description: "Input the server address (IP or webserver name) and click 'Check availability' to check if the API server is running correctly.",
            content: <CheckService api_protocol={this.state.apiServiceProtocol} api_port={this.state.apiServicePort} api_host={this.state.apiServiceHost} onCheckService={this.checkApiService.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Create subject',
            subTitle: 'set subject id',
            description: "Type in a subject ID and click 'Create' to create a subject folder for data logging on the API server. Hover over the '!' icon to see the required naming pattern for the subject ID.",
            content: <CreateSubject pattern='RIAR_##' onCreate={this.createSubject.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Select sensors',
            subTitle: 'scan and select nearby devices',
            description: 'Scan to discover more nearby available sensors, and check sensor list to select them. Sensor settings will be displayed on the right panel once a sensor is selected. You may set up shared parameters for sensors on the left panel.',
            content: <SelectSensors onSubmit={this.selectSensors.bind(this)}
                availableSensorAddresses={this.state.availableSensorAddresses}
                selectedSensors={this.state.selectedSensors}
                samplingRate={this.state.accelerometerSamplingRate}
                dynamicRange={this.state.accelerometerDynamicRange}
                defaultPort={this.state.sensorDefaultPort}
                selectedSensorAddresses={this.state.selectedSensors.map((sensor) => sensor.address)}
                changeAccelerometerSamplingRate={this.changeAccelerometerSamplingRate.bind(this)}
                changeAccelerometerDynamicRange={this.changeAccelerometerDynamicRange.bind(this)}
                changeSensorPlacement={this.changeSensorPlacement.bind(this)}
                changeSensorPort={this.changeSensorPort.bind(this)}
                scanSensors={this.scanSensors.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Run and monitor sensors',
            subTitle: 'Submit settings, run and monitor sensors',
            description: 'Review sensor settings using the "Sensors" Tab, click "Submit settings and run sensors" to submit the settings to API server and start running the sensors. Click "Stop sensors" to stop the running of all sensors. You may check the monitor panel below to display the signal of the raw sensor data after you click "Connect" button to connect to the sensor\'s output signal.',
            content: <RunSensors runSensors={this.runSensors.bind(this)} stopSensors={this.stopSensors.bind(this)} selectedSensors={this.state.selectedSensors} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Setup model',
            subTitle: 'setup model and activity recognition task',
            description: 'Use the following form to setup a processor, as explained by each item. The settings of all processors may be reviewed using the "Processors" tab.',
            content: <SetupProcessor sensors={this.state.selectedSensors} processorNames={this.state.availableProcessorNames}
                selectedProcessor={this.state.selectedProcessor}
                defaultWindowSize={this.state.selectedProcessor ? this.state.selectedProcessor.windowSize || 12.8 : 12.8} selectProcessor={this.selectProcessor.bind(this)} changeProcessorWindowSize={this.changeProcessorWindowSize.bind(this)}
                changeProcessorUpdateRate={this.changeProcessorUpdateRate.bind(this)}
                changeProcessorInputs={this.changeProcessorInputs.bind(this)}
                changeProcessorNumberOfWindows={this.changeProcessorNumberOfWindows.bind(this)}
                changeProcessorPort={this.changeProcessorPort.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Run and monitor',
            subTitle: 'start experiment session',
            description: 'Use the "Processors" tab to review the settings of different processors and confirm the selected processor. Click "Submit settings and run the processor" to start running the processor and generate predictions. Click "Stop the processor" to stop the running processor. On the left monitor panel, you may see the visualization display that is optimized for experts; on the right monitor panel, you may see the visualization display shown to the subject (novice user).',
            content: <RunProcessor runProcessor={this.runProcessor.bind(this)} stopProcessor={this.stopProcessor.bind(this)} selectedProcessor={this.state.selectedProcessor} predictions={this.state.predictions} />,
            validateNext: () => null,
            validateBack: () => null
        }];
        return (
            <div className='app-container' >
                <h2><Icon type="experiment" theme="twoTone" twoToneColor="#1890ff" /><span style={{ color: "#1890ff", fontFamily: "sans-serif" }}>RIAR</span> <small>experiment platform</small></h2>
                <Guide steps={steps} sensors={this.state.selectedSensors} processors={this.state.selectedProcessor ? [this.state.selectedProcessor] : []} />
                {/* <DebugDrawer /> */}
            </div >
        )
    }
}

export default hot(module)(App);