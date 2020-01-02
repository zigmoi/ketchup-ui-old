import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Menu } from 'antd';
import { Link, useParams, Switch } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Nomatch from '../Nomatch';

import ManageCloudProviders from './CloudProviders/ManageCloudProviders';
import AddCloudProvider from '../Settings/CloudProviders/AddCloudProvider';
import EditCloudProvider from '../Settings/CloudProviders/EditCloudProvider';
import ViewCloudProvider from '../Settings/CloudProviders/ViewCloudProvider';

import ManageContainerRegistries from './ContainerRegistries/ManageContainerRegistries';
import AddContainerRegistry from '../Settings/ContainerRegistries/AddContainerRegistry';
import EditContainerRegistry from '../Settings/ContainerRegistries/EditContainerRegistry';
import ViewContainerRegistry from '../Settings/ContainerRegistries/ViewContainerRegistry';


import ManageGitProviders from './GitProviders/ManageGitProviders';
import AddGitProvider from '../Settings/GitProviders/AddGitProvider';
import EditGitProvider from '../Settings/GitProviders/EditGitProvider';
import ViewGitProvider from '../Settings/GitProviders/ViewGitProvider';

import ManageBuildTools from './BuildTools/ManageBuildTools';
import AddBuildTool from '../Settings/BuildTools/AddBuildTool';
import EditBuildTool from '../Settings/BuildTools/EditBuildTool';
import ViewBuildTool from './BuildTools/ViewBuildTool';

import ManageK8sClusters from './K8sClusters/ManageK8sClusters';
import AddK8sCluster from '../Settings/K8sClusters/AddK8sCluster';
import EditK8sCluster from '../Settings/K8sClusters/EditK8sCluster';
import ViewK8sCluster from '../Settings/K8sClusters/ViewK8sCluster';

import ManageHostnames from './Hostnames/ManageHostnames';
import AddHostname from '../Settings/Hostnames/AddHostname';




function ManageSettings() {
    const [iconLoading, setIconLoading] = useState(false);
    const [selectedKey, setSelectedKey] = useState([]);

    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        setSelectedKey([settingId]);
    }, [settingId]);


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
                <Col span={5}>
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
                    <Switch>
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/build-tools" component={ManageBuildTools} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/build-tool/add" component={AddBuildTool} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/build-tool/edit" component={EditBuildTool} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/build-tool/view" component={ViewBuildTool} />

                        <ProtectedRoute path="/app/project/:projectResourceId/settings/cloud-providers" component={ManageCloudProviders} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/cloud-provider/add" component={AddCloudProvider} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/cloud-provider/edit" component={EditCloudProvider} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/cloud-provider/view" component={ViewCloudProvider} />

                        <ProtectedRoute path="/app/project/:projectResourceId/settings/git-providers" component={ManageGitProviders} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/git-provider/add" component={AddGitProvider} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/git-provider/edit" component={EditGitProvider} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/git-provider/view" component={ViewGitProvider} />

                        <ProtectedRoute path="/app/project/:projectResourceId/settings/container-registries" component={ManageContainerRegistries} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/container-registry/add" component={AddContainerRegistry} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/container-registry/edit" component={EditContainerRegistry} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/container-registry/view" component={ViewContainerRegistry} />

                        <ProtectedRoute path="/app/project/:projectResourceId/settings/kubernetes-clusters" component={ManageK8sClusters} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/kubernetes-cluster/add" component={AddK8sCluster} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/kubernetes-cluster/edit" component={EditK8sCluster} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId/kubernetes-cluster/view" component={ViewK8sCluster} />

                        <ProtectedRoute path="/app/project/:projectResourceId/settings/hostnames" component={ManageHostnames} />
                        <ProtectedRoute path="/app/project/:projectResourceId/settings/hostname/add" component={AddHostname} />

                        <ProtectedRoute component={Nomatch} />
                    </Switch>
                </Col>
            </Row>
        </div>
    );
}

export default ManageSettings;