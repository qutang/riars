class Processor {
    constructor(name) {
        this._name = name
        this._port = undefined
        this._host = undefined
        this._updateRate = undefined
        this._windowSize = undefined
        this._numberOfWindows = undefined
        this._status = 'stopped'
        this._inputUrls = []
    }

    static copy(theOtherProcessor) {
        const newProcessor = new Processor(theOtherProcessor.name);
        newProcessor.port = theOtherProcessor.port;
        newProcessor.host = theOtherProcessor.host;
        newProcessor.updateRate = theOtherProcessor.updateRate;
        newProcessor.windowSize = theOtherProcessor.windowSize;
        newProcessor.status = theOtherProcessor.status;
        newProcessor.numberOfWindows = theOtherProcessor.numberOfWindows;
        newProcessor.inputUrls = theOtherProcessor.inputUrls.slice(0);
        return newProcessor;
    }

    get name() {
        return this._name
    }

    get port() {
        return this._port
    }

    get host() {
        return this._host
    }

    get updateRate() {
        return this._updateRate
    }

    get windowSize() {
        return this._windowSize
    }


    get status() {
        return this._status
    }

    get numberOfWindows() {
        return this._numberOfWindows
    }

    get inputUrls() {
        return this._inputUrls
    }

    set name(name) {
        this._name = name
    }

    set port(port) {
        this._port = port
    }

    set host(host) {
        this._host = host
    }

    set updateRate(updateRate) {
        this._updateRate = updateRate
    }

    set windowSize(windowSize) {
        this._windowSize = windowSize
    }

    set status(status) {
        this._status = status
    }

    set numberOfWindows(numberOfWindows) {
        this._numberOfWindows = numberOfWindows
    }

    set inputUrls(inputUrls) {
        this._inputUrls = inputUrls
    }

    toJSON() {
        let { name, host, port, updateRate, windowSize, numberOfWindows, inputUrls, status } = this;
        return { name, host, port, updateRate, windowSize, numberOfWindows, inputUrls, status }
    }
}

export default Processor;