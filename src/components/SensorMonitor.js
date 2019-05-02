import React, { Component } from 'react';
import { Checkbox, Tooltip, Button, Empty, Badge, Slider, message } from 'antd';
import { Line } from 'react-chartjs-2';
import Sensor from '../models/Sensor';


class SensorMonitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showing: true
        };

        this._colors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
        this._datasetSkeleton = {
            fill: false,
            lineTension: 0.2,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false
        }
    }

    getOptions(duration) {
        const options = {
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
                        stepSize: duration * 1000.0 / 4,
                        displayFormats: {
                            millisecond: 'HH:mm:ss.SSS'
                        }
                    }
                }]
            }
        };
        return options;
    }

    initDataset() {
        return Object.assign({}, this._datasetSkeleton);
    }

    getColor(index) {
        const colorNames = Object.keys(this._colors);
        const selectedColor = this._colors[colorNames[index % colorNames.length]];
        return selectedColor;
    }

    getChartData(datasets) {
        const newDatasets = datasets.map((dataset, index) => {
            const color = this.getColor(index);
            const newDataset = {
                ...dataset, ...this.initDataset(), ...{
                    borderColor: color,
                    pointBorderColor: color,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: color,
                }
            }
            return newDataset;
        });
        return {
            datasets: newDatasets
        }
    }

    toggleMonitor(e) {
        this.setState({
            showing: e.target.checked
        })
    }

    connectMonitor(e) {
        if (this.props.sensor.status == 'running') {
            if (!this.props.sensor.isConnected) {
                this.props.connectSensor(this.props.sensor);
            } else {
                this.props.disconnectSensor(this.props.sensor);
            }
        } else {
            message.error('Please run sensors first before connecting');
        }
    }

    render() {
        const sensor = this.props.sensor;
        const predefinedPlacements = Sensor.PREDEFINED_PLACEMENTS;
        const chartData = this.getChartData(sensor.datasets);
        const options = this.getOptions(sensor.dataBufferSize);
        return (
            <div className='sensor-monitor'>
                <div className='sensor-monitor-control'>
                    <Tooltip title={sensor.address + ", " + sensor.url + ', ' + sensor.status}>
                        <Checkbox checked={this.state.showing} onChange={this.toggleMonitor.bind(this)}><Badge color={sensor.status == 'running' ? 'green' : 'red'} />{predefinedPlacements[sensor.name]}</Checkbox>
                    </Tooltip>
                    <Button loading={sensor.isConnecting} size="small" onClick={this.connectMonitor.bind(this)}>{
                        sensor.isConnected ? "Disconnect" : 'Connect'
                    }</Button>
                </div>
                <div className='sensor-monitor-display'>
                    {
                        !sensor.isConnected ? (this.state.showing && <Empty />) :
                            (this.state.showing && <Line data={chartData} options={options} height={500} />)
                    }
                </div>
            </div>
        )
    }
}

export default SensorMonitor;