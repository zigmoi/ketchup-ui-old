import React, { Component, useContext, useState } from 'react';
import { Tabs } from 'antd';
import BitBucket from './BitBucket'

function CreateGitProvider() {
    document.title = "Create Git Providers";
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

export default CreateGitProvider;
