import React, { Component } from 'react';
import { Button, message } from 'antd';

class StepAction extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={this.props.className}>
                {
                    this.props.currentStep < this.props.totalSteps - 1
                    && <Button type="primary" onClick={() => this.props.nextAction()}>Next</Button>
                }
                {
                    this.props.currentStep === this.props.totalSteps - 1
                    && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                }
                {
                    this.props.currentStep > 0
                    && (
                        <Button style={{ marginLeft: 8 }} onClick={() => this.props.prevAction()}>
                            Previous
            </Button>
                    )
                }
            </div>
        )
    }
}

export default StepAction