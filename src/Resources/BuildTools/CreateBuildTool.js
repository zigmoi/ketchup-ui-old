import React, { Component, useContext, useState } from 'react';
import { Tabs } from 'antd';
import Maven from './Maven'

function CreateBuildTool() {
    document.title = "Create Build Tools";
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

export default CreateBuildTool;
