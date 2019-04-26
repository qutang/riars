import React, { Component } from 'react';
import { Select, Icon, Divider, Modal, Input, Tooltip, InputNumber, message } from 'antd';
import './SubjectList.css';

class SubjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
        this.newSubjSetting = {
            id: undefined,
            age: 18,
            gender: 'Male'
        }
    }

    showCreateBox() {
        console.log('click')
        this.setState({
            visible: true
        })
    }

    hideCreateBox() {
        this.setState({
            visible: false
        })
    }

    createSubject() {
        if (this.newSubjSetting.id == undefined) {
            message.error('Must provide subject id');
            return;
        }
        this.props.createSubject(this.newSubjSetting);
        this.hideCreateBox();
    }

    render() {
        const Option = Select.Option;
        const subjects = this.props.subjects;
        const selectedSubj = subjects.filter(s => s.selected);
        console.log(selectedSubj)
        return (
            <div className='subject-list'>
                <div onMouseDown={(e) => {
                    e.preventDefault();
                    return false;
                }}>
                    <Select showSearch placeholder='select or create a subject' value={selectedSubj.length > 0 ? selectedSubj[0].id : undefined} onChange={this.props.selectSubject} dropdownRender={(menu) => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ padding: '8px', cursor: 'pointer' }} onClick={this.showCreateBox.bind(this)}>
                                <Icon type="plus" /> Add item
                        </div>
                        </div>
                    )} >
                        {
                            subjects.map((subject) => {
                                return <Option key={subject.id} value={subject.id}>{subject.id}</Option>
                            })
                        }
                    </Select>
                </div>
                <Modal
                    className='create-subject-modal'
                    onCancel={this.hideCreateBox.bind(this)}
                    onOk={this.createSubject.bind(this)}
                    okText='Create'
                    title="Create a new subject"
                    visible={this.state.visible}
                >
                    <Input className='create-subject-item'
                        defaultValue={this.state.defaultSelection}
                        placeholder="Enter a new subject ID"
                        onChange={(e) => {
                            this.newSubjSetting.id = e.target.value;
                        }}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={
                            <Tooltip title={"Use pattern: " + this.props.pattern}>
                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                    <InputNumber className='create-subject-item'
                        onChange={(value) => {
                            this.newSubjSetting.age = value;
                        }}
                        placeholder="Enter age"
                        min={18}
                        max={100}
                        step={1}
                        defaultValue={18}
                    />

                    <Select className='create-subject-item' defaultValue="Male" onChange={(value) => {
                        this.newSubjSetting.gender = value;
                    }}>
                        <Option value="Male">
                            Male
                        </Option>
                        <Option value="Female">
                            Female
                        </Option>
                        <Option value="Other">
                            Other
                        </Option>
                    </Select>
                </Modal>
            </div>
        )
    }
}

export default SubjectList;