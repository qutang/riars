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
        this._webworker = undefined
    }

    update(anotherProcessor) {
        this.port = anotherProcessor.port || this.port;
        this.host = anotherProcessor.host || this.host;
        this.updateRate = anotherProcessor.updateRate || this.updateRate;
        this.windowSize = anotherProcessor.windowSize || this.windowSize;
        this.status = anotherProcessor.status || this.status;
        this.numberOfWindows = anotherProcessor.numberOfWindows || this.numberOfWindows;
        this.inputUrls = anotherProcessor.inputUrls == undefined ? this.inputUrls : anotherProcessor.inputUrls.slice(0);
        this.selected = anotherProcessor.selected == undefined ? this.selected : anotherProcessor.selected;
        this.webworker = this.webworker == undefined ? anotherProcessor.webworker : this.webworker;
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
        newProcessor.webworker = this.webworker;
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

    static merge(processorsA, processorsB) {
        const namesA = processorsA.map(p => p.name);
        const namesB = processorsB.map(p => p.name);
        const unionNames = new Set([...namesA, ...namesB]);
        const merged = unionNames.map(name => {
            const foundA = Processor.find(name, processorsA);
            const foundB = Processor.find(name, processorsB);
            const result = undefined;
            if (foundA && foundB) {
                foundA.update(foundB);
                result = foundA.clone();
            } else if (foundA && !foundB) {
                result = foundA.clone();
            } else if (!foundA && foundB) {
                result = foundB.clone();
            }
            return result;
        });
        return merged;
    }

    static mergeForRight(processorsA, processorsB) {
        return processorsB.map(p => {
            const foundA = Processor.find(p.name, processorsA);
            if (foundA) {
                foundA.update(p);
                return foundA.clone();
            }
            return p;
        });
    }

    get webworker() {
        return this._webworker
    }

    set webworker(value) {
        this._webworker = value
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
        let { name, host, port, updateRate, windowSize, numberOfWindows, status } = this;
        const inputUrls = this.inputUrls;
        return { name, host, port, update_rate: updateRate, window_size: windowSize, number_of_windows: numberOfWindows, device_urls: inputUrls, status: status }
    }

    toTable() {
        let { selected, name, host, port, updateRate, windowSize, numberOfWindows, inputUrls, status, webworker } = this;
        return { selected, name, host, port, updateRate, windowSize, numberOfWindows, inputUrls, status: status, webworker: String(webworker != undefined) }
    }

    static fromJSON(jsonObj) {
        const processor = new Processor(jsonObj.name);
        processor.host = jsonObj.host;
        processor.port = jsonObj.port;
        processor.status = jsonObj.status;
        processor.updateRate = jsonObj.update_rate;
        processor.windowSize = jsonObj.window_size;
        processor.numberOfWindows = jsonObj.number_of_windows;
        processor.inputUrls = jsonObj.device_urls;
        if (processor.status == 'running') {
            processor.selected = true
        } else {
            processor.selected = false
            processor.host = '0.0.0.0'
            processor.port = 9000
            processor.numberOfWindows = 0
            processor.windowSize = 12.8
            processor.updateRate = 12.8
        }
        return processor;
    }
}

export default Processor;