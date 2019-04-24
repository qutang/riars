import React from 'react';
import { Empty, PageHeader, Typography } from 'antd';
import './StepContent.css'
import SystemMonitor from './SystemMonitor';

const { Paragraph } = Typography;

const StepContent = (props) => {
    return (
        <div className={props.className}>
            <PageHeader className='step-header' title={props.title}
                subTitle={props.subTitle}>
                <SystemMonitor sensors={props.sensors} processors={props.processors}>
                    {
                        props.description != undefined && <Paragraph>
                            {props.description}
                        </Paragraph>
                    }
                </SystemMonitor>
            </PageHeader>
            <div className='steps-content'>
                {
                    props.children == undefined ? <Empty /> : props.children
                }
            </div>

        </div>
    )
}

export default StepContent;