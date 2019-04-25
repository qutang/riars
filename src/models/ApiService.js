import axios from 'axios';

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
}

export default ApiService;