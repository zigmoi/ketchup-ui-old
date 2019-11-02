import React, { useState } from 'react';
import { Form, Icon, Input, Button, Tabs } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};


function CreateDeployment() {
    document.title = "Create Deployment";

    const [iconLoading, setIconLoading] = useState(false);
    const [appBasePath, setAppBasePath] = useState("");
    const [appServerPort, setAppServerPort] = useState("");
    const [buildToolSettingId, setBuildToolSettingId] = useState("");
    const [cloudProviderSettingId, setCloudProviderSettingId] = useState("");
    const [containerRegistrySettingId, setContainerRegistrySettingId] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [dockerImageRepoName, setDockerImageRepoName] = useState("");
    const [gitProviderSettingId, setGitProviderSettingId] = useState("");
    const [gitRepoName, setGitRepoName] = useState("");
    const [kubernetesClusterSettingId, setKubernetesClusterSettingId] = useState("");
    const [kubernetesNamespace, setKubernetesNamespace] = useState("");
    const [serviceName, setServiceName] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function createDeployment() {
        setIconLoading(true);
        var data = {
            "appBasePath": appBasePath,
            "appServerPort": appServerPort,
            "appTimezone": "",
            "buildToolSettingId": buildToolSettingId,
            "cloudProviderSettingId": cloudProviderSettingId,
            "containerRegistrySettingId": containerRegistrySettingId,
            "displayName": displayName,
            "dockerImageName": "",
            "dockerImageRepoName": dockerImageRepoName,
            "dockerImageTag": "",
            "externalResourceIpHostnameMappingSettingId": "",
            "gitProviderSettingId": gitProviderSettingId,
            "gitRepoBranchName": "",
            "gitRepoCommitId": "",
            "gitRepoName": gitRepoName,
            "gitRepoToBuildDirectory": "",
            "kubernetesClusterSettingId": kubernetesClusterSettingId,
            "kubernetesNamespace": kubernetesNamespace,
            "serviceName": serviceName
        };
        axios.post(`http://localhost:8097/v1/project/${projectResourceId}/deployments/basic-spring-boot`, data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Deployment created successfully.', 5);
                history.push(`/app/project/${projectResourceId}/deployments`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Create Deployment</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <Tabs defaultActiveKey="general">
                            <TabPane tab="General" key="general">
                                <FormItem {...formItemLayout} label="Display Name:">
                                    <Input autoFocus
                                        placeholder="Display Name"
                                        value={displayName}
                                        onChange={(e) => { setDisplayName(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="App Port:">
                                    <Input
                                        placeholder="App Port"
                                        value={appServerPort}
                                        onChange={(e) => { setAppServerPort(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Kubernetes Cluster:">
                                    <Input
                                        placeholder="Kubernetes Cluster"
                                        value={kubernetesClusterSettingId}
                                        onChange={(e) => { setKubernetesClusterSettingId(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Kubernetes Namespace:">
                                    <Input
                                        placeholder="Kubernetes Namespace"
                                        value={kubernetesNamespace}
                                        onChange={(e) => { setKubernetesNamespace(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Kubernetes Service Name:">
                                    <Input placeholder="Kubernetes Service Name"
                                        value={serviceName}
                                        onChange={(e) => { setServiceName(e.target.value) }} />
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Git Provider" key="git-provider">
                                <FormItem {...formItemLayout} label="Git Provider:">
                                    <Input
                                        placeholder="Git Provider"
                                        value={gitProviderSettingId}
                                        onChange={(e) => { setGitProviderSettingId(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Git Repository Name:">
                                    <Input
                                        placeholder="Git Repository Name"
                                        value={gitRepoName}
                                        onChange={(e) => { setGitRepoName(e.target.value) }} />
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Cloud Provider" key="cloud-provider">
                                <FormItem {...formItemLayout} label="Cloud Provider:">
                                    <Input
                                        placeholder="Cloud Provider"
                                        value={cloudProviderSettingId}
                                        onChange={(e) => { setCloudProviderSettingId(e.target.value) }} />
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Container Registry" key="container-registry">
                                <FormItem {...formItemLayout} label="Container Registry:">
                                    <Input
                                        placeholder="Container Registry"
                                        value={containerRegistrySettingId}
                                        onChange={(e) => { setContainerRegistrySettingId(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Docker Image Repository Name:">
                                    <Input
                                        placeholder="Docker Image Repository Name"
                                        value={dockerImageRepoName}
                                        onChange={(e) => { setDockerImageRepoName(e.target.value) }} />
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Additional" key="additional">
                                <FormItem {...formItemLayout} label="Build Tool:">
                                    <Input
                                        placeholder="Build Tool"
                                        value={buildToolSettingId}
                                        onChange={(e) => { setBuildToolSettingId(e.target.value) }} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Base Build Path (Docker Build):">
                                    <Input
                                        placeholder="Base Build Path (Docker Build)"
                                        value={appBasePath}
                                        onChange={(e) => { setAppBasePath(e.target.value) }} />
                                </FormItem>
                            </TabPane>
                        </Tabs>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={createDeployment} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default CreateDeployment;