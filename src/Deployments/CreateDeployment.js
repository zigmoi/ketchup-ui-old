import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tabs, Select } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const Option = Select.Option;
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
    const [k8sClusters, setK8sClusters] = useState([]);
    const [gitProviders, setGitProviders] = useState([]);
    const [cloudProviders, setCloudProviders] = useState([]);
    const [containerRegistries, setContainerRegistries] = useState([]);
    const [buildTools, setBuildTools] = useState([]);

    let history = useHistory();
    let { projectResourceId } = useParams();

    useEffect(() => {
        loadAllK8sClusters();
        loadAllGitProviders();
        loadAllCloudProviders();
        loadAllContainerRegistries();
        loadAllBuildTools();
    }, [projectResourceId]);



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

    function loadAllK8sClusters() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/list-all-kubernetes-cluster/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setK8sClusters(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function loadAllGitProviders() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/list-all-git-provider/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setGitProviders(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function loadAllCloudProviders() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/list-all-cloud-provider/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setCloudProviders(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function loadAllContainerRegistries() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/list-all-container-registry/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setContainerRegistries(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function loadAllBuildTools() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/list-all-build-tool/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setBuildTools(response.data);
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
                                    <Select showSearch
                                        value={kubernetesClusterSettingId}
                                        onChange={(e) => { setKubernetesClusterSettingId(e) }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {k8sClusters.map(cluster =>
                                            <Option key={cluster.settingId}>{`${cluster.displayName} (${cluster.settingId})`}</Option>)
                                        }
                                    </Select>
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
                                    <Select showSearch
                                        value={gitProviderSettingId}
                                        onChange={(e) => { setGitProviderSettingId(e) }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {gitProviders.map(provider =>
                                            <Option key={provider.settingId}>{`${provider.displayName} (${provider.settingId})`}</Option>)
                                        }
                                    </Select>
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
                                    <Select showSearch
                                        value={cloudProviderSettingId}
                                        onChange={(e) => { setCloudProviderSettingId(e) }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {cloudProviders.map(provider =>
                                            <Option key={provider.settingId}>{`${provider.displayName} (${provider.settingId})`}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Container Registry" key="container-registry">
                                <FormItem {...formItemLayout} label="Container Registry:">
                                    <Select showSearch
                                        value={containerRegistrySettingId}
                                        onChange={(e) => { setContainerRegistrySettingId(e) }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {containerRegistries.map(registry =>
                                            <Option key={registry.settingId}>{`${registry.displayName} (${registry.settingId})`}</Option>)
                                        }
                                    </Select>
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
                                    <Select showSearch
                                        value={buildToolSettingId}
                                        onChange={(e) => { setBuildToolSettingId(e) }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {buildTools.map(buildTool =>
                                            <Option key={buildTool.settingId}>{`${buildTool.displayName} (${buildTool.settingId})`}</Option>)
                                        }
                                    </Select>
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