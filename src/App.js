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
            sensors: [],
            processors: [],
            apiServicePort: '5000',
            apiServiceProtocol: 'http://',
            apiServiceHost: 'localhost',
            accelerometerSamplingRate: 50,
            accelerometerDynamicRange: 8,
            sensorDefaultPort: 8000,
            predictions: [new Prediction([{ label: 'Walking', score: 0.3 }, { label: 'Sitting', score: 0.6 }, { label: 'Lying', score: 0.2 }]), new Prediction([{ label: 'Walking', score: 0.3 }, { label: 'Sitting', score: 0.6 }, { label: 'Lying', score: 0.2 }]), new Prediction([{ label: 'Walking', score: 0.2 }, { label: 'Sitting', score: 0.7 }, { label: 'Lying', score: 0.3 }])]
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
        const scannedSensorAddresses = ['Sensor A', 'Sensor B', 'Sensor C'];
        const currentSensors = this.state.sensors;
        let updatedSensors = [];
        if (currentSensors.length > 0) {
            const newSensorAddrs = scannedSensorAddresses.filter((address) => Sensor.find(address, currentSensors).length == 0);
            const newSensors = newSensorAddrs.map((addr) => new Sensor(addr));
            updatedSensors = [...currentSensors, ...newSensors];
        } else {
            updatedSensors = scannedSensorAddresses.map((addr) => new Sensor(addr));
        }

        updatedSensors = updatedSensors.map((sensor, index) => {
            sensor.order = index;
            return sensor;
        })

        this.setState(
            {
                sensors: updatedSensors
            }
        )
        message.success('Finished scanning nearby sensors')
    }

    selectSensors(selectedAddresses) {
        console.log(selectedAddresses);
        const sensors = this.state.sensors;
        const updatedSensors = sensors.map((sensor) => {
            if (selectedAddresses.indexOf(sensor.address) != -1) {
                sensor.selected = true
            } else {
                sensor.selected = false
            }
            return sensor.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
        message.success('Selected: ' + selectedAddresses.join(','));
    }

    changeAccelerometerSamplingRate(samplingRate) {
        const updatedSensors = this.state.sensors.map((sensor) => {
            sensor.samplingRate = samplingRate;
            return sensor.clone();
        });
        this.setState({
            accelerometerSamplingRate: samplingRate,
            sensors: updatedSensors
        });
        message.success('Updated sampling rate for sensors');
    }

    changeAccelerometerDynamicRange(dynamicRange) {
        const updatedSensors = this.state.sensors.map((sensor) => {
            sensor.dynamicRange = dynamicRange;
            return sensor.clone();
        });
        this.setState({
            accelerometerDynamicRange: dynamicRange,
            sensors: updatedSensors
        });
        message.success('Updated dynamic range for sensors');
    }

    changeSensorPlacement(address, value) {
        const updatedSensors = this.state.sensors.map((sensor) => {
            if (sensor.address == address) {
                sensor.name = value;
            }
            return sensor.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
    }

    changeSensorPort(address, value) {
        const updatedSensors = this.state.sensors.map((sensor) => {
            if (sensor.address == address) {
                sensor.port = value;
            }
            return sensor.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
    }

    runSensors() {
        console.log('running sensors');
        const updatedSensors = this.state.sensors.map((sensor) => {
            if (sensor.selected) {
                sensor.status = 'running';
            }
            return sensor.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
    }

    stopSensors() {
        console.log('stopping sensors');
        const updatedSensors = this.state.sensors.map((sensor) => {
            if (sensor.selected) {
                sensor.status = 'stopped';
            }
            return sensor.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
    }

    queryProcessors() {
        const existingProcessors = this.state.processors;
        let newProcessors = [new Processor('activity-model'), new Processor('posture-model')];
        newProcessors = newProcessors.filter((processor) =>
            !Processor.find(processor.name, existingProcessors)
        );
        const updatedProcessors = [...existingProcessors, ...newProcessors];
        console.log(updatedProcessors);
        this.setState({
            processors: updatedProcessors
        });
    }

    selectProcessor(name) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (name == processor.name) {
                processor.selected = true;
            } else {
                processor.selected = false;
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    changeProcessorWindowSize(value) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.windowSize = value;
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    changeProcessorUpdateRate(value) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.updateRate = value;
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    changeProcessorInputs(inputUrls) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.inputUrls = inputUrls;
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    changeProcessorNumberOfWindows(value) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.numberOfWindows = value;
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    changeProcessorPort(value) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.port = value;
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    runProcessor() {
        console.log('running processor');
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.status = 'running';
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
        });
    }

    stopProcessor() {
        console.log('stopping processor');
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (processor.selected) {
                processor.status = 'stopped';
            }
            return processor.clone();
        })
        this.setState({
            processors: updatedProcessors
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
                sensors={this.state.sensors}
                availableSensorAddresses={this.state.availableSensorAddresses}
                samplingRate={this.state.accelerometerSamplingRate}
                dynamicRange={this.state.accelerometerDynamicRange}
                defaultPort={this.state.sensorDefaultPort}
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
            content: <RunSensors runSensors={this.runSensors.bind(this)} stopSensors={this.stopSensors.bind(this)} sensors={this.state.sensors} />,
            validateNext: () => {
                console.log('step 4 -> step 5');
                this.queryProcessors();
            },
            validateBack: () => null
        }, {
            title: 'Setup model',
            subTitle: 'setup model and activity recognition task',
            description: 'Use the following form to setup a processor, as explained by each item. The settings of all processors may be reviewed using the "Processors" tab.',
            content: <SetupProcessor
                sensors={this.state.sensors}
                processors={this.state.processors}
                selectProcessor={this.selectProcessor.bind(this)}
                changeProcessorWindowSize={this.changeProcessorWindowSize.bind(this)}
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
                <Guide steps={steps} sensors={this.state.sensors} processors={this.state.processors} />
                {/* <DebugDrawer /> */}
            </div >
        )
    }
}

export default hot(module)(App);