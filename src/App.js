import React, { Component } from "react";
import { Icon } from 'antd';
import { hot } from 'react-hot-loader';
import Guide from './layouts/Guide';
import './App.css';
import { message } from 'antd';
import SelectSensors from './layouts/steps/SelectSensors';
import RunSensors from './layouts/steps/RunSensors';
import SetupProcessor from './layouts/steps/SetupProcessor';
import RunProcessor from './layouts/steps/RunProcessor';
import Sensor from './models/Sensor';
import Processor from './models/Processor';
import Prediction from './models/Prediction';
import ApiService from './models/ApiService';
import Subject from './models/Subject';
import { version } from '../package.json';
import DebugDrawer from './components/DebugDrawer';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSubject: undefined,
            sensors: [],
            processors: [],
            apiService: new ApiService(),
            subjects: [],
            isScanningSensors: false,
            isStartingSensors: false,
            isStoppingSensors: false,
            accelerometerSamplingRate: 50,
            accelerometerDynamicRange: 8,
            predictions: [new Prediction([{ label: 'Walking', score: 0.3 }, { label: 'Sitting', score: 0.6 }, { label: 'Lying', score: 0.2 }]), new Prediction([{ label: 'Walking', score: 0.3 }, { label: 'Sitting', score: 0.6 }, { label: 'Lying', score: 0.2 }]), new Prediction([{ label: 'Walking', score: 0.2 }, { label: 'Sitting', score: 0.7 }, { label: 'Lying', score: 0.3 }])]
        }
    }

    updateService(protocol, host, port) {
        const service = this.state.apiService.clone();
        service.protocol = protocol;
        service.host = host;
        service.port = port;
        const updatedSensors = this.state.sensors.map(sensor => {
            sensor.host = service.host;
            return sensor.clone();
        });
        this.setState({
            apiService: service,
            sensors: updatedSensors
        });
    }

    checkApiService() {
        this.state.apiService.checkAvailable((success) => {
            const service = this.state.apiService.clone();
            service.status = (success ? 'running' : 'stopped');
            this.setState({
                apiService: service
            });
            if (success) {
                this.querySubjects();
            }
        });
    }

    componentDidMount() {
        this.checkApiService();
        setInterval(() => {
            this.checkApiService();
        }, 1000 * 10);
    }

    querySubjects() {
        this.state.apiService.querySubjects((subjects, status) => {
            this.setState({
                subjects: subjects
            });
            if (status == 200) {

            } else {

            }
        });
    }

    selectSubject(subjectId) {
        const subjects = this.state.subjects;
        const selectedSubj = subjects.filter((s) => s.id == subjectId)[0];
        this.state.apiService.selectSubject(selectedSubj, (updatedSubj, status) => {
            const updatedSubjects = subjects.map((subject) => {
                if (updatedSubj.id == subject.id) {
                    subject.selected = updatedSubj.selected
                } else {
                    subject.selected = false
                }
                return subject.clone()
            });
            this.setState({
                subjects: updatedSubjects
            });
            if (status != 200) {
                message.error('Subject id is not found on the server');
            } else {
                message.success('Selected subject: ' + updatedSubj.id);
            }
        });
    }

    createSubject(subjJson) {
        const newSubject = Subject.fromJSON(subjJson);
        this.state.apiService.createSubject(newSubject, (newSubject, status) => {
            if (status == 200) {
                const subjects = this.state.subjects;
                subjects.push(newSubject);
                const updatedSubjects = subjects.map((subject) => {
                    if (newSubject.id == subject.id) {
                        subject.selected = newSubject.selected
                    } else {
                        subject.selected = false
                    }
                    return subject.clone()
                })
                this.setState({
                    subjects: updatedSubjects
                });
            } else {
                message('Failed to create new subject: ' + status);
            }
        });
    }

    scanSensors() {
        this.setState({
            isScanningSensors: true
        })
        this.state.apiService.scanSensors((sensors, status) => {
            if (status == 200) {
                this.setState({
                    sensors: sensors,
                    isScanningSensors: false
                });
            } else {
                message.error('Failed to scan sensors');
            }
        });
    }

    selectSensors(selectedAddresses) {
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
                sensor.order = value;
            }
            return sensor.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
    }

    runSensors() {
        this.setState({
            isStartingSensors: true
        });
        this.state.apiService.runSensors(this.state.sensors, (sensors, status) => {
            console.log(sensors);
            if (status == 200) {
                const existingSensors = this.state.sensors;
                const updatedSensors = existingSensors.map((existingSensor) => {
                    const foundSensor = Sensor.find(existingSensor.address, sensors);
                    if (foundSensor != undefined) {
                        return foundSensor;
                    } else {
                        return existingSensor.clone();
                    }
                });
                this.setState({
                    sensors: updatedSensors,
                    isStartingSensors: false
                });
            } else {
                message.error('Failed to start selected sensors');
            }
        });
    }

    stopSensors() {
        this.setState({
            isStoppingSensors: true
        });
        this.state.apiService.stopSensors(this.state.sensors, (sensors, status) => {
            console.log(sensors);
            if (status == 200) {
                const existingSensors = this.state.sensors;
                const updatedSensors = existingSensors.map((existingSensor) => {
                    const foundSensor = Sensor.find(existingSensor.address, sensors);
                    if (foundSensor != undefined) {
                        return foundSensor;
                    } else {
                        return existingSensor.clone();
                    }
                });
                this.setState({
                    sensors: updatedSensors,
                    isStoppingSensors: false
                });
            } else {
                message.error('Failed to stop selected sensors');
            }
        });
    }

    queryProcessors() {
        const existingProcessors = this.state.processors;
        let newProcessors = [new Processor('activity-model'), new Processor('posture-model')];
        newProcessors = newProcessors.filter((processor) =>
            !Processor.find(processor.name, existingProcessors)
        );
        const updatedProcessors = [...existingProcessors, ...newProcessors];
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

    correctLabel(index, label) {
        const predictions = this.state.predictions;
        const updatedPredictions = predictions.map((prediction, i) => {
            if (index == i) {
                prediction.correction = label;
            }
            return prediction.clone();
        })
        this.setState({
            predictions: updatedPredictions
        });
    }

    addPredictionNote(index, note) {
        const predictions = this.state.predictions;
        const updatedPredictions = predictions.map((prediction, i) => {
            if (index == i) {
                prediction.correctionNote = note;
            }
            return prediction.clone();
        })
        this.setState({
            predictions: updatedPredictions
        });
    }

    render() {
        const steps = [{
            title: 'Setup sensors',
            subTitle: 'Select and setup nearby sensors',
            description: 'Scan to discover more nearby available sensors, and check sensor list to select them. Sensor settings will be displayed on the right panel once a sensor is selected. You may set up shared parameters for sensors on the left panel.',
            content: <SelectSensors onSubmit={this.selectSensors.bind(this)}
                sensors={this.state.sensors}
                isScanningSensors={this.state.isScanningSensors}
                samplingRate={this.state.accelerometerSamplingRate}
                dynamicRange={this.state.accelerometerDynamicRange}
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
            content: <RunSensors runSensors={this.runSensors.bind(this)} stopSensors={this.stopSensors.bind(this)} sensors={this.state.sensors} isStartingSensors={this.state.isStartingSensors} isStoppingSensors={this.state.isStoppingSensors} />,
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
            content: <RunProcessor runProcessor={this.runProcessor.bind(this)} stopProcessor={this.stopProcessor.bind(this)} selectedProcessor={this.state.selectedProcessor} predictions={this.state.predictions} correctLabel={this.correctLabel.bind(this)} addPredictionNote={this.addPredictionNote.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }];
        return (
            <div className='app-container' >
                <h2><Icon type="experiment" theme="twoTone" twoToneColor="#1890ff" /><span style={{ color: "#1890ff", fontFamily: "sans-serif" }}>RIAR</span> <small>experiment platform <code style={{ fontSize: "0.8em", color: "#cf1322" }}>{version}</code></small></h2>
                <Guide
                    steps={steps}
                    sensors={this.state.sensors}
                    processors={this.state.processors}
                    service={this.state.apiService}
                    updateService={this.updateService.bind(this)}
                    subjects={this.state.subjects}
                    selectSubject={this.selectSubject.bind(this)}
                    createSubject={this.createSubject.bind(this)} />
                {/* <DebugDrawer /> */}
            </div >
        )
    }
}

export default hot(module)(App);