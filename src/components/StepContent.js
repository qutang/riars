import React from 'react';
import { Empty, PageHeader, Typography } from 'antd';
import './StepContent.css'

const { Paragraph } = Typography;

const StepContent = (props) => {
    return (
        <div className={props.className}>
            <PageHeader title={props.title}
                subTitle={props.subTitle}>
                {
                    props.description != undefined && <Paragraph>
                        {props.description}
                    </Paragraph>
                }
            </PageHeader>
            <div className='steps-content'>
                {
                    props.children == undefined ? <Empty /> : props.children
                }
            </div>

        </div>
    )
}

export default StepContent