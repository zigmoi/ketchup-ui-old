import React, { Component, useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import { Tabs } from 'antd';
import axios from 'axios';
import BitBucket from './BitBucket'

class CreateGitProvider extends Component {
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
        document.title = "Create Git Providers";
    }

    render() {
        const { TabPane } = Tabs;
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Tabs defaultActiveKey="bitbucket">
                    <TabPane tab="Bitbucket" key="bitbucket">
                      <BitBucket />
                    </TabPane>
                    <TabPane tab="GitHub" key="github">
                      Coming Soon ...
                    </TabPane>
                    <TabPane tab="GitLab" key="gitlab">
                      Coming Soon ...
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default CreateGitProvider;
