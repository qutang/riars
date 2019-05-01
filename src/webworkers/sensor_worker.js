

const buildSensorWorker = function () {
    const SensorWorker = function (host, port, updateRate) {
        this.host = host;
        this.port = port;
        this.updateRate = updateRate;
        this.transformedData = undefined;
        this.ws = undefined;
        this.broadcoaster = undefined;


        this.getWebSocketUrl = function () {
            return 'ws://' + this.host + ':' + this.port;
        }

        this.postData = function () {

            if (this.transformedData != undefined && this.transformedData.datasets.length > 0) {
                console.log(this.transformedData);
                const message = {
                    action: 'data',
                    content: Object.assign({}, this.transformedData)
                };

                postMessage(message);
                this.clearData();
            }
        }

        this.clearData = function () {
            this.transformedData = undefined;
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
            let fields = new Set(Object.keys(newTransformed.datasets));

            if (data != undefined) {
                // existing fields
                data.datasets = data.datasets.map(existingSet => {
                    if (fields.has(existingSet.label)) {
                        existingSet.data.push(newTransformed.datasets[existingSet.label]);
                        fields.delete(existingSet.label);
                    }
                    return existingSet;
                });
                // new fields if any
                const newFields = Array.from(fields);
                newFields.forEach(field => {
                    data.datasets.push({
                        label: field,
                        data: [newTransformed.datasets[field]]
                    });
                });
            } else {
                data = {
                    name: newTransformed.name,
                    datasets: []
                };
                const fields = Object.keys(newTransformed.datasets);
                data.datasets = fields.map(field => {
                    return {
                        label: field,
                        data: [newTransformed.datasets[field]]
                    }
                });
            }
            this.transformedData = data;
        }

        this.transformData = function (data) {
            const transformed = {
                name: data['STREAM_NAME'],
                datasets: {}
            };
            const fields = Object.keys(data['VALUE']);
            fields.forEach(field => {
                transformed.datasets[field] =
                    { x: data['HEADER_TIME_STAMP'], y: data['VALUE'][field] }
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
    self.addEventListener('message', (e) => {
        if (e.data['action'] == 'start') {
            console.log('Start sensor worker');
            const host = e.data['host'];
            const port = e.data['port'];
            const updateRate = e.data['update_rate'];
            console.log('Received: ' + host + ", " + port + ", " + updateRate);
            worker = new SensorWorker(host, port, updateRate);
            console.log('Created sensor worker for ' + worker.getWebSocketUrl());
            worker.start();
        } else if (e.data['action'] == 'stop') {
            worker.stop();
            console.log('stop server: ' + worker.getWebSocketUrl());
        }
    });

    self.addEventListener('error', (e) => {
        const message = {
            action: 'error',
            content: e
        };
        postMessage(message);
        console.log('Error on sensor worker');
        console.log(e);
        worker.stop();
        close();
    });
}

export default buildSensorWorker;
