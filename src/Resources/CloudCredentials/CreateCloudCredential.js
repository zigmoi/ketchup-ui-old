import React, { Component, useContext, useState } from 'react';
import { Tabs } from 'antd';
import AWS from './AWS'

function CreateCloudCredential() {
    document.title = "Create Cloud Credentials";
    const { TabPane } = Tabs;
    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Tabs defaultActiveKey="bitbucket">
                <TabPane tab="AWS" key="cc-aws">
                    <AWS />
                </TabPane>
                <TabPane tab="GCP" key="cc-gcp">
                    Coming Soon ...
                </TabPane>
                <TabPane tab="AZURE" key="cc-azure">
                    Coming Soon ...
                </TabPane>
            </Tabs>
        </div>
    );
}

export default CreateCloudCredential;
