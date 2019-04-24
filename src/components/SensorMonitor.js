import React, { Component } from 'react';
import { Checkbox, Tooltip, Button, Empty, Badge } from 'antd';
import { Line } from 'react-chartjs';
import Sensor from '../models/Sensor';


class SensorMonitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showing: true,
            chartData: { datasets: [] },
            connected: false
        };
        this.chartDuration = 12.8;
        this.options = {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            downsample: {
                enabled: true,
                threshold: 500, // change this
                auto: false, // don't re-downsample the data every move
                onInit: true, // but do resample it when we init the chart (this is default)
                preferOriginalData: true, // use our original data when downscaling so we can downscale less, if we need to.
                restoreOriginalData: false, // if auto is false and this is true, original data will be restored on pan/zoom - that isn't what we want.
            },
            zoom: {
                // Boolean to enable zooming
                enabled: false,
                // Enable drag-to-zoom behavior
                drag: true,
                // Zooming directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow zooming in the y direction
                mode: 'x',
                rangeMin: {
                    // Format of min zoom range depends on scale type
                    x: null,
                    y: null
                },
                rangeMax: {
                    // Format of max zoom range depends on scale type
                    x: null,
                    y: null
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'millisecond',
                        stepSize: this.chartDuration * 1000.0 / 4,
                        displayFormats: {
                            millisecond: 'HH:mm:ss.SSS'
                        }
                    }
                }]
            }
        };
        this.colors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
    }

    initChartData(data) {
        const names = Object.keys(data);
        const colors = this.colors;
        const color_names = Object.keys(colors);

        var datasets = names.map(function (name, index) {
            var color = colors[color_names[index % color_names.length]];
            var dataset = {
                label: name,
                fill: false,
                lineTension: 0.2,
                borderColor: color,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: color,
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data[name],
                spanGaps: false
            }
            return dataset
        });
        this.setState({
            chartData: {
                datasets: datasets
            }
        })
    }

    addChartData(data) {
        const duration = this.chartDuration; // seconds
        const datasets = this.state.chartData.datasets;
        const updatedDatasets = datasets.map((dataset) => {
            if (data[dataset.label] !== undefined) {
                const n_new = data[dataset.label].length;
                const end_ts = 0;
                if (n_new > 0) {
                    end_ts = data[dataset.label][n_new - 1]['x'].valueOf() / 1000.0;
                }
                const start_ts = end_ts
                if (dataset.data.length != 0) {
                    start_ts = dataset.data[0]['x'].valueOf() / 1000.0;
                }
                if (end_ts - start_ts > duration) { // if there are more than 10s data
                    const keep_ts_start = end_ts - duration
                    dataset.data = dataset.data.filter(function (s) { return s['x'].valueOf() / 1000.0 >= keep_ts_start })
                    console.log('dataset length (after filter) ' + dataset.label + ': ' + dataset.data.length);
                }
                dataset.data = dataset.data.concat(data[dataset.label]);
                console.log('dataset length ' + dataset.label + ': ' + dataset.data.length);
            }
            return dataset;
        });
        this.setState({
            chartData: {
                datasets: datasets
            }
        });
    }

    toggleMonitor(e) {
        this.setState({
            showing: e.target.checked
        })
    }

    connectMonitor(e) {
        this.setState({
            connected: !this.state.connected
        })
    }

    render() {
        const sensor = this.props.sensor;
        const predefinedPlacements = Sensor.PREDEFINED_PLACEMENTS;
        return (
            <div className='sensor-monitor'>
                <div className='sensor-monitor-control'>
                    <Tooltip title={sensor.address + ", " + sensor.url + ', ' + sensor.status}>
                        <Checkbox checked={this.state.showing} onChange={this.toggleMonitor.bind(this)}><Badge color={sensor.status == 'running' ? 'green' : 'red'} />{predefinedPlacements[sensor.name]}</Checkbox>
                    </Tooltip>
                    <Button size="small" onClick={this.connectMonitor.bind(this)}>{
                        this.state.connected ? "Disconnect" : 'Connect'
                    }</Button>
                </div>
                <div className='sensor-monitor-display'>
                    {
                        !this.state.connected ? (this.state.showing && <Empty />) :
                            (this.state.showing && <Line data={this.state.chartData} options={this.options} />)
                    }
                </div>
            </div>
        )
    }
}

export default SensorMonitor;