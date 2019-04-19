import React, { Component } from 'react';
import { Input, Tooltip, Icon, Button, Form } from 'antd';
import './CreateSubject.css'

class CreateSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentInput: ''
    }
  }

  handleChange(e) {
    this.setState({ currentInput: e.target.value })
  }

  handleCreate() {
    console.log(this);
    this.props.onCreate(this.state.currentInput)
  }

  render() {
    return (
      <Form id='step-create-subject' layout='inline'>
        <Form.Item>
          <Input
            placeholder="Enter a new subject ID"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={
              <Tooltip title={"Use pattern: " + this.props.pattern}>
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            onChange={(e) => this.handleChange(e)}
            onPressEnter={() => this.handleCreate()}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' onClick={() => this.handleCreate()}>Create</Button>
        </Form.Item>
      </Form>
    )
  }
}

export default CreateSubject;