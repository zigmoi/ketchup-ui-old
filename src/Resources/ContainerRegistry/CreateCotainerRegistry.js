import React, { Component, useContext, useState } from 'react';
import { Tabs } from 'antd';
import AwsEcr from './AwsEcr'

function CreateCotainerRegistry() {
    document.title = "Create Cloud Credentials";
    const { TabPane } = Tabs;
    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Tabs defaultActiveKey="bitbucket">
                <TabPane tab="AWS ECR" key="aws-ecr">
                    <AwsEcr />
                </TabPane>
                <TabPane tab="Docker in Local Env" key="docker-registry-local">
                    Coming Soon ...
                </TabPane>
            </Tabs>
        </div>
    );
}

export default CreateCotainerRegistry;
