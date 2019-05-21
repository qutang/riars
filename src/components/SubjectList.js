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
            gender: 'Male',
            weight: 60,
            height: 1.80,
            blood_pressure: "Unavailable",
            heart_rate: 0,
            dress: 'Business Casual',
            shoes: 'Sneakers',
            dominant_hand: 'Right', 
            dominant_foot: 'Right'
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
                    <Input className='create-subject-item-control'
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
                    <div className='create-subject-item'>
                        <span>Age</span>
                        <InputNumber className='create-subject-item-control'
                            onChange={(value) => {
                                this.newSubjSetting.age = value;
                            }}
                            placeholder="Enter age"
                            min={18}
                            max={100}
                            step={1}
                            defaultValue={18}
                        />
                    </div>

                    <div className='create-subject-item'>
                        <span>Gender</span>
                        <Select className='create-subject-item-control' defaultValue="Male" onChange={(value) => {
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
                    </div>

                    <div className='create-subject-item'>
                        <span>Weight (kg)</span>
                        <InputNumber className='create-subject-item-control'
                            onChange={(value) => {
                                this.newSubjSetting.weight = value;
                            }}
                            placeholder="Enter weight (kg)"
                            min={0}
                            max={150}
                            step={1}
                            defaultValue={60}
                        />
                    </div>

                    <div className="create-subject-item">
                        <span>Height (meter)</span>
                        <InputNumber className='create-subject-item-control'
                            onChange={(value) => {
                                this.newSubjSetting.height = value;
                            }}
                            placeholder="Enter height (meter)"
                            min={0.00}
                            max={2.50}
                            step={0.01}
                            defaultValue={1.80}
                        />
                    </div>

                    <div className="create-subject-item">
                        <span>Rest blood pressure</span>
                        <Input className='create-subject-item-control'
                            onChange={(value) => {
                                this.newSubjSetting.blood_pressure = value;
                            }}
                            placeholder="Enter Blood pressure"
                        />
                    </div>

                    <div className="create-subject-item">
                        <span>Rest heart rate</span>
                        <InputNumber className='create-subject-item-control'
                            onChange={(value) => {
                                this.newSubjSetting.heart_rate = value;
                            }}
                            placeholder="Enter Heart rate"
                            min={20.0}
                            max={250.0}
                            step={1}
                            defaultValue={70}
                        />
                    </div>

                    <div className="create-subject-item">
                        <span>Dress</span>
                        <Select className='create-subject-item-control' defaultValue="Business casual" onChange={(value) => {
                            this.newSubjSetting.dress = value;
                        }}>
                            <Option value="Business cansual">
                                Business cansual
                            </Option>
                            <Option value="Sportswear">
                                Sportswear
                            </Option>
                            <Option value="Formal">
                                Formal
                            </Option>
                            <Option value="Winter clothing">
                                Winter clothing
                            </Option>
                            <Option value="Others">
                                Others
                            </Option>
                        </Select>
                    </div>

                    <div className="create-subject-item">
                        <span>Shoes</span>
                        <Select className='create-subject-item-control' defaultValue="Sneakers" onChange={(value) => {
                            this.newSubjSetting.shoes = value;
                        }}>
                            <Option value="Sneakers">
                                Sneakers
                            </Option>
                            <Option value="Boots">
                                Boots
                            </Option>
                            <Option value="Casual Leather">
                                Casual Leather
                            </Option>
                            <Option value="Formal">
                                Formal
                            </Option>
                            <Option value="High heels">
                                High heels
                            </Option>
                            <Option value="Others">
                                Others
                            </Option>
                        </Select>
                    </div>

                    <div className="create-subject-item">
                        <span>Dominant hand</span>
                        <Select className='create-subject-item-control' defaultValue="Right" onChange={(value) => {
                            this.newSubjSetting.dominant_hand = value;
                        }}>
                            <Option value="Right">
                                Right
                            </Option>
                            <Option value="Left">
                                Left
                            </Option>
                            <Option value="Unknown">
                                Unknown
                            </Option>
                        </Select>
                    </div>

                    <div className="create-subject-item">
                        <span>Dominant foot</span>
                        <Select className='create-subject-item-control' defaultValue="Right" onChange={(value) => {
                            this.newSubjSetting.dominant_foot = value;
                        }}>
                            <Option value="Right">
                                Right
                            </Option>
                            <Option value="Left">
                                Left
                            </Option>
                            <Option value="Unknown">
                                Unknown
                            </Option>
                        </Select>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default SubjectList;