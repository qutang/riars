import React, { Component } from 'react';
import { Input, Tooltip, Icon, Button, Form } from 'antd';
import SubjectList from '../../components/SubjectList';
import './CreateSubject.css'

class CreateSubject extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='step-create-subject'>
        <SubjectList subjects={this.props.subjects} selectSubject={this.props.selectSubject} createSubject={this.props.createSubject} />
      </div>
    )
  }
}

export default CreateSubject;