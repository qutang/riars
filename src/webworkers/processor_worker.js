
class ProcessorWorker {
    constructor(host, port, updateRate) {
        this._host = host;
        this._port = port;
        this._updateRate = updateRate;
        this._transformedData = [];
        this._ws = undefined;
        this._broadcoaster = undefined;
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }

    get transformedData() {
        return this._transformedData;
    }

    set transformedData(data) {
        this._transformedData = data;
    }

    getWebSocketUrl() {
        return 'ws://' + this.host + ':' + this.port;
    }

    postData() {
        if (this.transformedData != undefined && this.transformedData.length > 0) {
            const message = {
                action: 'data',
                content: this.transformedData
            };

            postMessage(message);
            this.clearData();
        }
    }

    clearData() {
        this.transformedData = [];
    }

    onOpenWebSocket(e) {
        console.log('Connected to ' + wsUrl);
        this._broadcaster = setInterval(this.postData.bind(this), this.updateRate * 1000);
    }

    onWebSocketError(e) {
        console.log(e);
        this.stop();
        close();
    }

    onWebSocketMessage(e) {
        const data = JSON.parse(e.data);
        const transformed = this.transformData(data);
        this.transformData.push(transformed);
    }

    transformData(data) {
        return data;
    }

    start() {
        const wsUrl = this.getWebSocketUrl();
        this._ws = new WebSocket(wsUrl);
        this._ws.addEventListener('open', this.onOpenWebSocket.bind(this));
        this._ws.addEventListener('error', this.onWebSocketError.bind(this));
        this._ws.addEventListener('message', this.onWebSocketMessage.bind(this));
    }

    stop() {
        clearInterval(this._broadcaster);
        this._broadcaster = undefined;
        this._ws.close();
        this.postData();
    }
}

let processorWorker = undefined;

// web worker methods
onmessage = function (e) {
    if (e.data['action'] == 'start') {
        console.log('Start processor worker');
        const host = e.data['host'];
        const port = e.data['port'];
        const updateRate = e.data['update_rate'];
        console.log('Received: ' + host + ", " + port + ", " + updateRate);
        processorWorker = new processorWorker(host, port, updateRate);
        console.log('Created processor worker for ' + processorWorker.getWebSocketUrl());
        processorWorker.run();
    } else if (e.data['action'] == 'stop') {
        processorWorker.stop();
        console.log('stop server: ' + processorWorker.getWebSocketUrl());
    }
}

onerror = function (e) {
    const message = {
        action: 'error',
        content: e
    };
    postMessage(message);
    console.log('Error on processor worker');
    console.log(e);
    processorWorker.stop();
    close();
}