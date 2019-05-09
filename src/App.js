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
import WebWorker from './webworkers/WebWorker';
import buildSensorWorker from './webworkers/sensor_worker';
import buildProcessorWorker from './webworkers/processor_worker';
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
            isStartingProcessor: false,
            isStoppingProcessor: false,
            accelerometerSamplingRate: 50,
            accelerometerDynamicRange: 8,
            predictions: [],
            annotations: [],
            numOfPastPredictions: 3
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
        const updatedProcessors = this.state.processors.map(p => {
            p.host = service.host;
            return p.clone();
        });
        this.setState({
            apiService: service,
            sensors: updatedSensors,
            processors: updatedProcessors
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
                this.queryExistingSensors();
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
            const existingSensors = this.state.sensors;
            const updatedSensors = sensors.map(sensor => {
                const found = Sensor.find(sensor.address, existingSensors);
                sensor.webworker = new WebWorker(buildSensorWorker);
                if (found) {
                    found.update(sensor);
                    return found;
                } else {
                    return sensor;
                }
            });
            if (status == 200) {
                this.setState({
                    sensors: updatedSensors,
                    isScanningSensors: false
                });
            } else {
                message.error('Failed to scan sensors');
            }
        });
    }

    queryExistingSensors() {
        const existingSensors = this.state.sensors;
        const connectedSensors = existingSensors.filter(s => s.isConnected);
        if (connectedSensors.length > 0) {
            return;
        }
        this.state.apiService.queryExistingSensors((sensors, status) => {
            if (status == 200) {
                const existingSensors = this.state.sensors;
                const updatedSensors = Sensor.merge(existingSensors, sensors).map(s => {
                    if (!s.webworker) {
                        s.webworker = new WebWorker(buildSensorWorker);
                    }
                    return s.clone();
                });
                console.log(updatedSensors);
                this.setState({
                    sensors: updatedSensors
                });
            } else {
                message.error('Failed to query sensors');
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
                        existingSensor.update(foundSensor);
                        return existingSensor.clone();
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
        this.state.sensors.forEach(sensor => {
            if (sensor.isConnected) {
                this.disconnectSensor(sensor);
            }
        });
        this.state.apiService.stopSensors(this.state.sensors, (sensors, status) => {
            if (status == 200) {
                const existingSensors = this.state.sensors;
                const updatedSensors = existingSensors.map((existingSensor) => {
                    const foundSensor = Sensor.find(existingSensor.address, sensors);
                    if (foundSensor != undefined) {
                        existingSensor.update(foundSensor);
                        // existingSensor.isConnected = false;
                    }
                    return existingSensor.clone();
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

    connectSensor(sensor) {
        const updatedSensors = this.state.sensors.map(s => {
            if (s.address == sensor.address) {
                s.isConnecting = true;
            }
            return s.clone();
        });
        this.setState({
            sensors: updatedSensors
        });
        this.state.apiService.connectSensor(sensor, (newData) => {
            if (newData == 'error' || newData == 'stopped') {
                message.error('Connection to ' + sensor.name + ' is in error or stopped, stop connection.');
                const updatedSensors = this.state.sensors.map(s => {
                    if (s.address == sensor.address) {
                        s.isConnected = false;
                    }
                    return s.clone();
                });
                this.setState({
                    sensors: updatedSensors
                });
            } else {
                const currentSensor = Sensor.find(sensor.address, this.state.sensors);
                let currentDatasets = [];
                if (currentSensor) {
                    currentDatasets = currentSensor.datasets;
                }
                const duration = sensor.dataBufferSize;
                const newDatasets = newData.datasets;
                console.log(currentDatasets);

                const newLegends = new Set(newDatasets.map(dataset => dataset.label));
                const existingLegends = new Set(currentDatasets.map(dataset => dataset.label));

                const updatedLegends = Array.from(new Set([...newLegends, ...existingLegends]));

                const updatedDatasets = updatedLegends.map((legend, index) => {
                    if (newLegends.has(legend) && existingLegends.has(legend)) {
                        console.log('append ' + legend);
                        const currentDataset = currentDatasets.filter(dataset => dataset.label == legend)[0];
                        const newDataset = newDatasets.filter(dataset => dataset.label == legend)[0];
                        let updatedData = currentDataset.data.concat(newDataset.data);
                        const stopTime = updatedData[updatedData.length - 1].x;
                        const startTime = stopTime - duration;
                        updatedData = updatedData.filter(sample => sample.x >= startTime && sample.x < stopTime);
                        return {
                            label: legend,
                            data: updatedData
                        }
                    } else if (newLegends.has(legend) && !existingLegends.has(legend)) {
                        console.log('add ' + legend);
                        const newDataset = newDatasets.filter(dataset => dataset.label == legend)[0];
                        return {
                            label: legend,
                            data: newDataset.data
                        }
                    } else {
                        // no new data
                        const currentDataset = currentDatasets.filter(dataset => dataset.label == legend)[0];
                        return {
                            label: legend,
                            data: currentDataset.data
                        }
                    }
                });

                console.log(updatedDatasets);

                const updatedSensors = this.state.sensors.map(s => {
                    if (s.address == sensor.address) {
                        s.isConnected = true;
                        s.datasets = updatedDatasets;
                        s.isConnecting = false;
                    }
                    return s.clone();
                });

                this.setState({
                    sensors: updatedSensors
                });
            }
        });
    }

    disconnectSensor(sensor) {
        this.state.apiService.disconnectSensor(sensor);
    }

    queryProcessors() {
        this.state.apiService.queryProcessors((processors, status) => {
            const existingProcessors = this.state.processors;
            const updatedProcessors = Processor.mergeForRight(existingProcessors, processors)
            if (status == 200) {
                this.setState({
                    processors: updatedProcessors
                });
            } else {
                console.error('Can not retrieve processors');
            }
        });
    }

    selectProcessor(name) {
        const processors = this.state.processors;
        const updatedProcessors = processors.map((processor) => {
            if (name == processor.name) {
                processor.selected = true;
                processor.webworker = new WebWorker(buildProcessorWorker);
            } else {
                processor.selected = false;
                processor.webworker = undefined;
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
        this.setState({
            isStartingProcessor: true
        });
        let processor = this.state.processors.filter(p => p.selected);
        processor = processor.length > 0 ? processor[0] : undefined;
        if (processor != undefined) {
            this.state.apiService.runProcessor(processor, (p, status) => {
                // run callback
                if (status == 200) {
                    const existingProcessors = this.state.processors;
                    const updatedProcessors = existingProcessors.map((existingProcessor) => {
                        if (existingProcessor.name == p.name) {
                            existingProcessor.update(p);
                        }
                        return existingProcessor.clone();
                    });
                    this.setState({
                        processors: updatedProcessors
                    });
                    this.state.apiService.connectProcessor(processor, (data) => {
                        // connection callback
                        if (data == 'error' || data == 'stopped') {
                            message.error('Connection to ' + processor.name + ' is in error or stopped, stop connection.');
                            this.setState({
                                isStoppingProcessor: false
                            });
                        } else {
                            let updatedPredictions = [];
                            const existingPredictions = this.state.predictions;
                            const newPredictions = data.map(predictionJson => {
                                const prediction = Prediction.fromJSON(predictionJson);
                                return prediction;
                            });
                            if (existingPredictions.length == 0) {
                                updatedPredictions = newPredictions;
                            } else {
                                updatedPredictions = existingPredictions.concat(newPredictions);
                            }
                            this.setState({
                                isStartingProcessor: false,
                                predictions: updatedPredictions
                            });
                        }
                    });
                } else {
                    message.error('Failed to start selected processor: ' + status);
                }
            });
        }
    }

    stopProcessor() {
        this.setState({
            isStoppingProcessor: true
        });
        setTimeout(() => {
            this.setState({
                isStoppingProcessor: false
            });
            message.error('Time out in stopping processor, force reset');
        }, 10 * 1000);
        let processor = this.state.processors.filter(p => p.selected);
        processor = processor.length > 0 ? processor[0] : undefined;
        if (processor != undefined && processor.status == 'running') {
            // append stop time to the last annotation
            this.completeAnnotation();
            this.state.apiService.stopProcessor(processor, (p, status) => {
                console.log(p);
                if (status == 200) {
                    const existingProcessors = this.state.processors;
                    const updatedProcessors = existingProcessors.map((existingProcessor) => {
                        if (existingProcessor.name == p.name) {
                            existingProcessor.update(p);
                        }
                        return existingProcessor.clone();
                    });
                    this.setState({
                        processors: updatedProcessors
                    });
                    this.state.apiService.disconnectProcessor(processor);
                    message.success('uploading prediction corrections...')
                    this.state.apiService.uploadPredictions(this.state.predictions, processor.name, (m) => {
                        if (m == 'success') {
                            message.success('uploaded prediction corrections...')
                            this.setState({
                                predictions: []
                            });
                        } else {
                            message.error('failed to upload prediction corrections!')
                        }
                    });
                    message.success('uploading annotations...')
                    this.state.apiService.uploadAnnotations(this.state.annotations, processor.name, (m) => {
                        if (m == 'success') {
                            message.success('uploaded annotations...')
                            this.setState({
                                annotations: []
                            });
                        } else {
                            message.error('failed to upload annotations!')
                        }
                    });
                } else {
                    message.error('Failed to stop selected processor');
                }
            });
        }
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

    annotate(label) {
        const annotations = this.state.annotations;
        if (annotations.length == 0) {
            annotations.push({
                label_name: label,
                start_time: new Date().getTime() / 1000.0
            });
        } else {
            const lastAnnotation = annotations[annotations.length - 1];
            if (lastAnnotation['stop_time'] == undefined) {
                lastAnnotation['stop_time'] = new Date().getTime() / 1000.0;
                if (label != lastAnnotation.label_name) {
                    annotations.push({
                        label_name: label,
                        start_time: new Date().getTime() / 1000.0
                    });
                }
            } else {
                annotations.push({
                    label_name: label,
                    start_time: new Date().getTime() / 1000.0
                });
            }
        }
        const updatedAnnotations = annotations.slice(0);
        this.setState({
            annotations: updatedAnnotations
        });
    }

    completeAnnotation() {
        const annotations = this.state.annotations;
        if (annotations.length > 0) {
            const lastAnnotation = annotations[annotations.length - 1];
            if (lastAnnotation['stop_time'] == undefined) {
                lastAnnotation['stop_time'] = new Date().getTime() / 1000.0;
            }
        }
        const updatedAnnotations = annotations.slice(0);
        this.setState({
            annotations: updatedAnnotations
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

    changeNumOfPastPredictions(value) {
        this.setState({
            numOfPastPredictions: value
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
                scanSensors={this.scanSensors.bind(this)}
                querySensors={this.queryExistingSensors.bind(this)} />,
            validateNext: () => null,
            validateBack: () => null
        }, {
            title: 'Run and monitor sensors',
            subTitle: 'Submit settings, run and monitor sensors',
            description: 'Review sensor settings using the "Sensors" Tab, click "Submit settings and run sensors" to submit the settings to API server and start running the sensors. Click "Stop sensors" to stop the running of all sensors. You may check the monitor panel below to display the signal of the raw sensor data after you click "Connect" button to connect to the sensor\'s output signal.',
            content: <RunSensors runSensors={this.runSensors.bind(this)} stopSensors={this.stopSensors.bind(this)} sensors={this.state.sensors} isStartingSensors={this.state.isStartingSensors} isStoppingSensors={this.state.isStoppingSensors} connectSensor={this.connectSensor.bind(this)} disconnectSensor={this.disconnectSensor.bind(this)} />,
            validateNext: () => {
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
            content: <RunProcessor runProcessor={this.runProcessor.bind(this)} processors={this.state.processors} stopProcessor={this.stopProcessor.bind(this)} isStartingProcessor={this.state.isStartingProcessor} isStoppingProcessor={this.state.isStoppingProcessor} predictions={this.state.predictions} annotations={this.state.annotations} annotate={this.annotate.bind(this)} numOfPastPredictions={this.state.numOfPastPredictions} correctLabel={this.correctLabel.bind(this)} addPredictionNote={this.addPredictionNote.bind(this)} changeNumOfPastPredictions={this.changeNumOfPastPredictions.bind(this)} />,
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