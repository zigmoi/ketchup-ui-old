import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Menu, Result } from 'antd';
import { Link, useParams } from 'react-router-dom';
import ManageCloudProviders from './CloudProviders/ManageCloudProviders';
import ManageContainerRegistries from './ContainerRegistries/ManageContainerRegistries';
import ManageGitProviders from './GitProviders/ManageGitProviders';
import ManageBuildTools from './BuildTools/ManageBuildTools';
import ManageK8sClusters from './K8sClusters/ManageK8sClusters';
import ManageHostnames from './Hostnames/ManageHostnames';

function ManageSettings() {
    const [iconLoading, setIconLoading] = useState(false);
    const [selectedKey, setSelectedKey] = useState([]);

    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        setSelectedKey([settingId]);
    }, [settingId]);

    let settingsView = null;
    if (settingId === "build-tools") {
        settingsView = (<ManageBuildTools />);
    } else if (settingId === "cloud-providers") {
        settingsView = (<ManageCloudProviders />);
    } else if (settingId === "container-registries") {
        settingsView = (<ManageContainerRegistries />);
    } else if (settingId === "git-providers") {
        settingsView = (<ManageGitProviders />);
    } else if (settingId === "kubernetes-clusters") {
        settingsView = (<ManageK8sClusters />);
    } else if (settingId === "hostnames") {
        settingsView = (<ManageHostnames />);
    } else {
        settingsView = (<Result title="Setting Not Found!" />);
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Settings: {projectResourceId}</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="top">
                <Col span={4}>
                    <Menu
                        defaultSelectedKeys={['cloud-providers']}
                        selectedKeys={selectedKey}
                        mode="inline"
                        style={{ textAlign: "left" }}
                    >
                        <Menu.Item key="cloud-providers">
                            <Link to={`/app/project/${projectResourceId}/settings/cloud-providers`}>
                                <span>Cloud Providers</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="kubernetes-clusters">
                            <Link to={`/app/project/${projectResourceId}/settings/kubernetes-clusters`}>
                                <span>Kubernetes Clusters</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="container-registries">
                            <Link to={`/app/project/${projectResourceId}/settings/container-registries`}>
                                <span>Container Registries</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="git-providers">
                            <Link to={`/app/project/${projectResourceId}/settings/git-providers`}>
                                <span>Git Providers</span>
                            </Link>
                        </Menu.Item> 
                        <Menu.Item key="build-tools">
                            <Link to={`/app/project/${projectResourceId}/settings/build-tools`}>
                                <span>Build Tools</span>
                            </Link>
                        </Menu.Item>   
                        <Menu.Item key="hostnames">
                            <Link to={`/app/project/${projectResourceId}/settings/hostnames`}>
                                <span>Hostnames</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                <Col span={17} offset={1}>
                    {settingsView}
                </Col>
            </Row>
        </div>
    );
}

export default ManageSettings;