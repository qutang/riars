import { Drawer, Button } from 'antd';
import React, { Component } from 'react';

class DebugDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    showDrawer() {
        this.setState({
            visible: true,
        });
    };

    onClose() {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <Button className='debug-drawer' type="primary" onClick={() => this.showDrawer()}>
                    Open debug panel
                </Button>
                <Drawer
                    title="Debug information"
                    placement="top"
                    closable={true}
                    onClose={() => this.onClose()}
                    visible={this.state.visible}
                >
                    <p>Some contents...</p>
                </Drawer>
            </div>
        );
    }
}

export default DebugDrawer;