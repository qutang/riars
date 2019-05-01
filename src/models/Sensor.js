
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
        this._datasets = []
        this._dataBufferSize = 12.8
        this._isConnected = false
        this._isConnecting = false
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

    update(anotherSensor) {
        this.selected = anotherSensor.selected;
        this.name = anotherSensor.name || this.name;
        this.port = anotherSensor.port || this.port;
        this.host = anotherSensor.host || this.port;
        this.samplingRate = anotherSensor.samplingRate || this.samplingRate;
        this.dynamicRange = anotherSensor.dynamicRange || this.dynamicRange;
        this.status = anotherSensor.status || this.status;
        this.order = anotherSensor.order || this.order;
        this.errorCode = anotherSensor.errorCode || this.errorCode;
        this.webworker = this.webworker == undefined ? anotherSensor.webworker : this.webworker;
        this.refreshRate = anotherSensor.refreshRate || this.refreshRate;
        this.datasets = anotherSensor.datasets || this.datasets;
        this.isConnected = anotherSensor.isConnected == undefined ? this.isConnected : anotherSensor.isConnected;
        this.dataBufferSize = anotherSensor.dataBufferSize || this.dataBufferSize;
        this.isConnecting = anotherSensor.isConnecting == undefined ? this.isConnecting : anotherSensor.isConnecting;
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
        sensor.datasets = this.datasets;
        sensor.isConnected = this.isConnected;
        sensor.dataBufferSize = this.dataBufferSize;
        return sensor;
    }

    get isConnecting() {
        return this._isConnecting;
    }

    set isConnecting(value) {
        this._isConnecting = value;
    }

    get dataBufferSize() {
        return this._dataBufferSize;
    }

    set dataBufferSize(value) {
        this._dataBufferSize = value;
    }

    get isConnected() {
        return this._isConnected;
    }

    set isConnected(value) {
        this._isConnected = value;
    }

    get datasets() {
        return this._datasets;
    }

    set datasets(value) {
        this._datasets = value;
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
        let { selected, order, address, name, host, port, samplingRate, dynamicRange, status, errorCode, webworker, refreshRate, datasets, dataBufferSize, isConnected } = this;
        return { selected: String(selected), order, address, name, host, port, samplingRate, dynamicRange, status, errorCode, webworker: String(webworker != undefined), refreshRate, datasets: datasets.length, dataBufferSize, isConnected: String(isConnected) }
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