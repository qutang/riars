import axios from 'axios';
import Subject from './Subject';
import Sensor from './Sensor';

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
                    const sensor = new Sensor(deviceJson.address);
                    sensor.name = deviceJson.name;
                    sensor.port = deviceJson.port;
                    sensor.samplingRate = deviceJson.sr;
                    sensor.dynamicRange = deviceJson.grange;
                    sensor.status = deviceJson.status;
                    sensor.errorCode = deviceJson.error_code;
                    if (sensor.status == 'running') {
                        sensor.host = deviceJson.host;
                        sensor.selected = true;
                        sensor.order = deviceJson.order;
                    } else {
                        sensor.host = 'localhost';
                        sensor.port = 8000;
                    }
                    return sensor;
                });
                callback(sensors, 200);
            } else {
                callback([], response.status)
            }
        });
    }
}

export default ApiService;