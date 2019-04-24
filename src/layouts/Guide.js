import React, { Component } from "react";
import "./Guide.css";
import { Steps, message } from 'antd';
import "antd/dist/antd.css";
import StepAction from '../components/StepAction'
import StepContent from '../components/StepContent'

const Step = Steps.Step;

class Guide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    next() {
        this.props.steps[this.state.current].validateNext();
        const current = this.state.current + 1;
        this.setState({ current });

    }

    prev() {
        this.props.steps[this.state.current].validateBack();
        const current = this.state.current - 1;
        this.setState({ current });
    }

    render() {
        const { current } = this.state;
        return (
            <div>
                <StepContent
                    className='steps-container'
                    title={this.props.steps[current].title}
                    subTitle={this.props.steps[current].subTitle}
                    sensors={this.props.sensors}
                    processors={this.props.processors}
                    description={this.props.steps[current].description}>
                    {this.props.steps[current].content}
                </StepContent>
                <Steps current={current}>
                    {this.props.steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <StepAction className='steps-action'
                    nextAction={() => this.next()}
                    prevAction={() => this.prev()}
                    currentStep={current}
                    totalSteps={this.props.steps.length}>
                </StepAction>
            </div>
        );
    }
}

export default Guide