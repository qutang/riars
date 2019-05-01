import axios from 'axios';
import Subject from './Subject';
import Sensor from './Sensor';
import Processor from './Processor';

class ApiService {
    constructor() {
        this._host = 'localhost';
        this._port = 5000;
        this._protocol = 'http';
        this._status = 'stopped';
    }

    clone() {
        const newService = new ApiService();
        newService.host = this.host;
        newService.port = this.port;
        newService.protocol = this.protocol;
        newService.status = this.status;
        return newService;
    }

    get host() {
        return this._host
    }

    set host(value) {
        this._host = value
    }

    get status() {
        return this._status
    }

    set status(value) {
        this._status = value
    }

    get protocol() {
        return this._protocol
    }

    set protocol(value) {
        this._protocol = value
    }

    get port() {
        return this._port
    }

    set port(value) {
        this._port = value
    }

    getUrl() {
        return this._protocol + '://' + this._host + ":" + this._port;
    }

    checkAvailable(callback) {
        axios.get(this.getUrl(), {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            callback(response.status == 200);
        }).catch((error) => {
            callback(false);
        });
    }

    querySubjects(callback) {
        const subjectApiUrl = this.getUrl() + '/api/subjects';
        axios.get(subjectApiUrl, {
            responseType: 'json',
        }).then((response) => {
            if (response.status == 200) {
                const data = response.data;
                const subjects = data.map((subjJson) => {
                    return Subject.fromJSON(subjJson);
                });
                callback(subjects, 200);
            } else {
                callback([], response.status);
            }
        }).catch(error => {
            callback([], error);
        });
    }

    selectSubject(subject, callback) {
        const subjectApiUrl = this.getUrl() + '/api/subjects';
        axios.post(subjectApiUrl, subject.toJSON()).then((response) => {
            if (response.status == 200) {
                const updatedSubject = Subject.fromJSON(response.data);
                callback(updatedSubject, 200);
            } else if (response.status == 405) {
                const updatedSubject = Subject.fromJSON(response.data);
                callback(updatedSubject, 405);
            }
        });
    }

    createSubject(subject, callback) {
        const subjectApiUrl = this.getUrl() + '/api/subjects';
        axios.put(subjectApiUrl, subject.toJSON()).then((response) => {
            if (response.status == 200) {
                const newSubject = Subject.fromJSON(response.data);
                callback(newSubject, 200);
            } else {
                callback(null, response.status);
            }
        });
    }

    scanSensors(callback) {
        const sensorApiUrl = this.getUrl() + '/api/sensors';
        axios.get(sensorApiUrl).then(response => {
            if (response.status == 200) {
                const devicesJson = response.data;
                const sensors = devicesJson.map((deviceJson, index) => {
                    const sensor = Sensor.fromJSON(deviceJson);
                    if (sensor.status == 'running') {
                        sensor.host = deviceJson.host;
                        sensor.selected = true;
                        sensor.order = deviceJson.order;
                    } else {
                        sensor.host = 'localhost';
                        sensor.port = 8000;
                        sensor.order = sensor.port;
                    }
                    return sensor;
                });
                callback(sensors, 200);
            } else {
                callback([], response.status)
            }
        });
    }

    runSensors(sensors, callback) {
        const sensorApiUrl = this.getUrl() + '/api/sensors';
        const requestData = sensors.filter(sensor => sensor.selected).map((sensor) => sensor.toJSON());
        axios.put(sensorApiUrl, requestData).then(response => {
            if (response.status == 200) {
                const devicesJson = response.data;
                const sensors = devicesJson.map((deviceJson, index) => {
                    const sensor = Sensor.fromJSON(deviceJson);
                    if (sensor.status == 'running') {
                        sensor.selected = true;
                    }
                    return sensor;
                });
                callback(sensors, 200);
            } else {
                callback([], response.status)
            }
        }).catch(error => {
            callback([], error);
        });
    }

    stopSensors(sensors, callback) {
        const sensorApiUrl = this.getUrl() + '/api/sensors';
        const requestData = sensors.filter(sensor => sensor.selected).map((sensor) => sensor.toJSON());
        axios.delete(sensorApiUrl, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestData
        }).then(response => {
            if (response.status == 200) {
                const devicesJson = response.data;
                const sensors = devicesJson.map((deviceJson, index) => {
                    const sensor = Sensor.fromJSON(deviceJson);
                    sensor.selected = true;
                    return sensor;
                });
                callback(sensors, 200);
            } else {
                callback([], response.status)
            }
        });
    }

    connectSensor(sensor, callback) {
        sensor.webworker.addEventListener('message', (e) => {
            if (e.data.action == 'error') {
                callback('error');
            } else if (e.data.action == 'data') {
                if (e.data.content && e.data.content.datasets.length > 0) {
                    callback(e.data.content);
                }
            } else if (e.data.action == 'stopped') {
                callback('stopped');
            }
        });
        sensor.webworker.postMessage({
            'action': 'start',
            'host': sensor.host,
            'port': sensor.port,
            'update_rate': sensor.refreshRate
        });
    }

    disconnectSensor(sensor) {
        sensor.webworker.postMessage({
            'action': 'stop',
            'port': sensor.port
        });
    }

    queryProcessors(callback) {
        const processorApiUrl = this.getUrl() + '/api/processors';
        axios.get(processorApiUrl).then(response => {
            if (response.status == 200) {
                const processorJson = response.data;
                const processors = processorJson.map((jsonObj, index) => {
                    const processor = Processor.fromJSON(jsonObj);
                    return processor;
                });
                callback(processors, 200);
            } else {
                callback([], response.status);
            }
        });
    }

    runProcessor(processor, callback) {
        const processorApiUrl = this.getUrl() + '/api/processors/' + processor.name;
        const requestData = processor.toJSON();
        console.log(requestData);
        const api = this;
        axios.put(processorApiUrl, requestData).then(response => {
            if (response.status == 200) {
                const processorJson = response.data;
                const processor = Processor.fromJSON(processorJson);
                if (processor.status == 'running') {
                    processor.selected = true;
                }
                callback(processor, 200);
            } else {
                callback(undefined, response.status);
            }
        }).catch(error => {
            callback(undefined, error);
        });
    }

    connectProcessor(processor, callback) {
        processor.webworker.addEventListener('message', (e) => {
            if (e.data.action == 'error') {
                callback('error');
            } else if (e.data.action == 'data') {
                if (e.data.content && e.data.content.length > 0) {
                    callback(e.data.content);
                }
            } else if (e.data.action == 'stopped') {
                callback('stopped');
            }
        });
        processor.webworker.postMessage({
            'action': 'start',
            'host': processor.host,
            'port': processor.port,
            'update_rate': processor.refreshRate
        });
    }

    disconnectProcessor(processor) {
        processor.webworker.postMessage({
            'action': 'stop',
            'port': processor.port
        });
    }

    stopProcessor(processor, callback) {
        const processorApiUrl = this.getUrl() + '/api/processors/' + processor.name;
        const requestData = processor.toJSON();
        const api = this;
        axios.delete(processorApiUrl, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestData
        }).then(response => {
            if (response.status == 200) {
                const processorJson = response.data;
                const processor = Processor.fromJSON(processorJson);
                processor.selected = true;
                callback(processor, 200);
            } else {
                callback(undefined, response.status)
            }
        });
    }
}

export default ApiService;