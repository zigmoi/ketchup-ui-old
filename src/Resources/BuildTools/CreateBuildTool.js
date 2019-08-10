import React, { Component, useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import { Tabs } from 'antd';
import axios from 'axios';
import Maven from './Maven'

class CreateBuildTool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            id: '',
            displayName: '',
            defaultUserEmail: '',
            defaultUserPassword: '',
        }
    }

    componentDidMount() {
        document.title = "Create Build Tools";
    }

    render() {
        const { TabPane } = Tabs;
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Tabs defaultActiveKey="maven">
                    <TabPane tab="Maven" key="maven">
                      <Maven />
                    </TabPane>
                    <TabPane tab="Gradle" key="gradle">
                      Coming Soon ...
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default CreateBuildTool;
