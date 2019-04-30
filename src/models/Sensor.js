
class Sensor {
    constructor(address) {
        this._address = address
        this._port = undefined
        this._host = 'localhost'
        this._samplingRate = undefined
        this._dynamicRange = undefined
        this._name = undefined
        this._status = 'stopped'
        this._order = undefined
        this._selected = false
        this._errorCode = undefined
        this._webworker = undefined
        this._refreshRate = 1
    }

    static get PREDEFINED_PLACEMENTS() {
        return {
            'DW': 'Dominant wrist (DW)',
            'DA': 'Dominant ankle (DA)',
            'DT': 'Dominant thigh (DT)',
            'DH': 'Dominant hip (DH)',
            'NDW': 'Nondominant wrist (NDW)',
            'NDA': 'Nondominant ankle (NDA)',
            'NDH': 'Nondominant hip (NDH)'
        }
    }

    static find(address, sensors) {
        const foundSensor = sensors.filter((sensor) => sensor.address == address)

        return foundSensor.length > 0 ? foundSensor[0] : undefined;
    }

    clone() {
        const sensor = new Sensor(this.address);
        sensor.selected = this.selected;
        sensor.name = this.name;
        sensor.port = this.port;
        sensor.host = this.host;
        sensor.samplingRate = this.samplingRate;
        sensor.dynamicRange = this.dynamicRange;
        sensor.status = this.status;
        sensor.order = this.order;
        sensor.errorCode = this.errorCode;
        sensor.webworker = this.webworker;
        sensor.refreshRate = this.refreshRate;
        return sensor;
    }

    get refreshRate() {
        return this._refreshRate;
    }

    set refreshRate(value) {
        this._refreshRate = value;
    }

    get webworker() {
        return this._webworker
    }

    set webworker(worker) {
        this._webworker = worker;
    }

    get url() {
        return 'ws://' + this._host + ":" + this._port;
    }

    get address() {
        return this._address
    }

    get port() {
        return this._port
    }

    get host() {
        return this._host
    }

    get samplingRate() {
        return this._samplingRate
    }

    get dynamicRange() {
        return this._dynamicRange
    }

    get name() {
        return this._name
    }

    get status() {
        return this._status
    }

    get order() {
        return this._order
    }

    get selected() {
        return this._selected
    }

    get errorCode() {
        return this._errorCode
    }

    set address(address) {
        this._address = address
    }

    set port(port) {
        this._port = port
    }

    set host(host) {
        this._host = host
    }

    set samplingRate(samplingRate) {
        this._samplingRate = samplingRate
    }

    set dynamicRange(dynamicRange) {
        this._dynamicRange = dynamicRange
    }

    set name(name) {
        this._name = name
    }

    set status(status) {
        this._status = status
    }

    set order(order) {
        this._order = order
    }

    set selected(selected) {
        this._selected = selected
    }

    set errorCode(error) {
        this._errorCode = error
    }

    toTable() {
        let { selected, order, address, name, host, port, samplingRate, dynamicRange, status, errorCode } = this;
        return { selected, order, address, name, host, port, samplingRate, dynamicRange, status, errorCode }
    }

    toJSON() {
        let { order, address, name, host, port, samplingRate, dynamicRange } = this;
        return { order, address, name, host, port, sr: samplingRate, grange: dynamicRange }
    }

    static fromJSON(jsonData) {
        const sensor = new Sensor(jsonData.address);
        sensor.order = jsonData.order
        sensor.name = jsonData.name
        sensor.host = jsonData.host
        sensor.port = jsonData.port
        sensor.samplingRate = jsonData.sr
        sensor.dynamicRange = jsonData.grange
        sensor.status = jsonData.status
        sensor.errorCode = jsonData.error_code
        return sensor;
    }
}

export default Sensor;