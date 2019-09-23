

const buildProcessorWorker = function () {
    const ProcessorWorker = function (host, port, updateRate) {
        this.host = host;
        this.port = port;
        this.updateRate = updateRate;
        this.transformedData = [];
        this.ws = undefined;
        this.broadcoaster = undefined;


        this.getWebSocketUrl = function () {
            if (this.host === "localhost" || this.host === "0.0.0.0")
                return 'ws://127.0.0.1:' + this.port;
        }

        this.postData = function () {

            if (this.transformedData != undefined && this.transformedData.length > 0) {
                console.log(this.transformedData);
                const message = {
                    action: 'data',
                    content: this.transformedData.slice(0)
                };

                postMessage(message);
                this.clearData();
            }
        }

        this.clearData = function () {
            this.transformedData = [];
        }

        this.onOpenWebSocket = function (e) {
            console.log('Connected to ' + this.getWebSocketUrl());
            this._broadcaster = setInterval(this.postData.bind(this), this.updateRate * 1000);
        }

        this.onWebSocketError = function (e) {
            console.error(e);
            this.stop();
        }

        this.onWebSocketMessage = function (e) {
            const data = JSON.parse(e.data);
            const transformed = this.transformData(data);
            this.addTransformedData(transformed);
        }

        this.addTransformedData = function (newTransformed) {
            let data = this.transformedData;

            if (data != undefined) {
                data.push(newTransformed);
            } else {
                data = [newTransformed];
            }
            this.transformedData = data;
        }

        this.transformData = function (data) {
            const fields = Object.keys(data);
            const transformed = {};
            fields.forEach(function (field, index) {
                if (field.includes('START_TIME') || field.includes('STOP_TIME') || field.includes('INDEX')) {
                    transformed[field] = data[field];
                    // TODO: broadcast and finally add vertical lines to raw data chart
                } else if (field.includes('FEATURE')) {
                    // TODO: do not need to know features for now
                } else if (field.includes('PREDICTION')) {
                    const taskName = field.split('_PREDICTION')[0];
                    const classNames = Object.keys(data[field][0]).filter(name => name.endsWith('PREDICTION'));
                    const predictionSet = classNames.map(className => {
                        const displayClassName = className.split('_PREDICTION')[0].split(taskName + '_')[1];
                        return { x: data[field][0]['STOP_TIME'], y: data[field][0][className], label: displayClassName }
                    });
                    transformed['prediction'] = predictionSet;
                } else {
                    throw new Error('Unrecognized filed: ' + field)
                }
            });
            return transformed;
        }

        this.start = function () {
            const wsUrl = this.getWebSocketUrl();
            this._ws = new WebSocket(wsUrl);
            this._ws.addEventListener('open', this.onOpenWebSocket.bind(this));
            this._ws.addEventListener('error', this.onWebSocketError.bind(this));
            this._ws.addEventListener('message', this.onWebSocketMessage.bind(this));
        }

        this.stop = function () {
            clearInterval(this._broadcaster);
            this._broadcaster = undefined;
            this._ws.close();
            this.postData();
            postMessage({
                action: 'stopped'
            });
        }
    };
    let worker = undefined;
    // web worker methods

    const handleWebworkerMessage = function (e) {
        if (e.data['action'] == 'start') {
            console.log('Start processor worker');
            const host = e.data['host'];
            const port = e.data['port'];
            const updateRate = e.data['update_rate'];
            console.log('Received: ' + host + ", " + port + ", " + updateRate);
            if (worker == undefined) {
                worker = new ProcessorWorker(host, port, updateRate);
                console.log('Created processor worker for ' + worker.getWebSocketUrl());
            }
            worker.start();
        } else if (e.data['action'] == 'stop') {
            worker.stop();
            console.log('stop server: ' + worker.getWebSocketUrl());
        }
    }

    const handleWebworkerError = function (e) {
        const message = {
            action: 'error',
            content: e
        };
        postMessage(message);
        console.log('Error on processor worker');
        console.log(e);
        worker.stop();
    }
    self.addEventListener('message', handleWebworkerMessage);
    self.addEventListener('error', handleWebworkerError);
}

export default buildProcessorWorker;
