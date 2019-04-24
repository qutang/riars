class Processor {
    constructor(name) {
        this._name = name
        this._port = 9000
        this._host = 'localhost'
        this._updateRate = 12.8
        this._windowSize = 12.8
        this._numberOfWindows = 0
        this._status = 'stopped'
        this._inputUrls = []
        this._selected = false
    }

    clone() {
        const newProcessor = new Processor(this.name);
        newProcessor.port = this.port;
        newProcessor.host = this.host;
        newProcessor.updateRate = this.updateRate;
        newProcessor.windowSize = this.windowSize;
        newProcessor.status = this.status;
        newProcessor.numberOfWindows = this.numberOfWindows;
        newProcessor.inputUrls = this.inputUrls.slice(0);
        newProcessor.selected = this.selected;
        return newProcessor;
    }

    static find(name, processors) {
        const result = processors.filter((processor) => {
            return processor.name == name
        });
        if (result.length > 0) {
            return result[0]
        } else {
            return false
        }
    }

    get selected() {
        return this._selected;
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

    set selected(selected) {
        this._selected = selected;
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
        let { selected, name, host, port, updateRate, windowSize, numberOfWindows, inputUrls, status } = this;
        return { selected, name, host, port, updateRate, windowSize, numberOfWindows, inputUrls, status }
    }
}

export default Processor;