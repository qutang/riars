class Sensor {
    constructor(address) {
        this._address = address
        this._port = undefined
        this._host = undefined
        this._samplingRate = undefined
        this._dynamicRange = undefined
        this._name = undefined
        this._status = 'stopped'
        this._order = undefined
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

    toJSON() {
        let { order, address, name, host, port, samplingRate, dynamicRange, status } = this;
        return { order, address, name, host, port, samplingRate, dynamicRange, status }
    }
}

export default Sensor;