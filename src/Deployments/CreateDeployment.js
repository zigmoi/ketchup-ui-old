import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Select } from 'antd';
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


function CreateDeployment(props) {
    document.title = "Create Deployment";

    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);
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



    function createDeployment(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    "appBasePath": values.appBasePath,
                    "appServerPort": values.appServerPort,
                    "appTimezone": "",
                    "buildToolSettingId": values.buildToolSettingId,
                    "cloudProviderSettingId": values.cloudProviderSettingId,
                    "containerRegistrySettingId": values.containerRegistrySettingId,
                    "displayName": values.displayName,
                    "dockerImageName": "",
                    "dockerImageRepoName": values.dockerImageRepoName,
                    "dockerImageTag": "",
                    "externalResourceIpHostnameMappingSettingId": "",
                    "gitProviderSettingId": values.gitProviderSettingId,
                    "gitRepoBranchName": "",
                    "gitRepoCommitId": "",
                    "gitRepoName": values.gitRepoName,
                    "gitRepoToBuildDirectory": "",
                    "kubernetesClusterSettingId": values.kubernetesClusterSettingId,
                    "kubernetesNamespace": values.kubernetesNamespace,
                    "serviceName": values.serviceName
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
                    <label style={{ fontWeight: 'bold' }} >Create Deployment</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={createDeployment} style={{ backgroundColor: 'white' }}>
                        <Tabs defaultActiveKey="general">
                            <TabPane tab="General" key="general">
                                <FormItem {...formItemLayout} label="Display Name:" hasFeedback>
                                    {getFieldDecorator('displayName', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Display Name!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Display Name" autoFocus />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="App Port:" hasFeedback>
                                    {getFieldDecorator('appServerPort', {
                                        initialValue: "80",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid application port number!',
                                            },
                                            {
                                                max: 5,
                                                message: 'Only 5 digits are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="App Port" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Kubernetes Cluster:" hasFeedback>
                                    {getFieldDecorator('kubernetesClusterSettingId', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Kubernetes Cluster!',
                                            }
                                        ],
                                    })(<Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {k8sClusters.map(cluster =>
                                            <Option key={cluster.settingId}>{`${cluster.displayName} (${cluster.settingId})`}</Option>)
                                        }
                                    </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Kubernetes Namespace:" hasFeedback>
                                    {getFieldDecorator('kubernetesNamespace', {
                                        initialValue: "default-kp",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Kubernetes Namespace!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Kubernetes Namespace" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Kubernetes Service Name:" hasFeedback>
                                    {getFieldDecorator('serviceName', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Kubernetes Service Name!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Kubernetes Service Name" />)}
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Git Provider" key="git-provider">
                                <FormItem {...formItemLayout} label="Git Provider:" hasFeedback>
                                    {getFieldDecorator('gitProviderSettingId', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Git Provider!',
                                            }
                                        ],
                                    })(<Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {gitProviders.map(provider =>
                                            <Option key={provider.settingId}>{`${provider.displayName} (${provider.settingId})`}</Option>)
                                        }
                                    </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Git Repository Name:" hasFeedback>
                                    {getFieldDecorator('gitRepoName', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Git Repository Name!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Git Repository Name" />)}
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Cloud Provider" key="cloud-provider">
                                <FormItem {...formItemLayout} label="Cloud Provider:" hasFeedback>
                                    {getFieldDecorator('cloudProviderSettingId', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Cloud Provider!',
                                            }
                                        ],
                                    })(<Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {cloudProviders.map(provider =>
                                            <Option key={provider.settingId}>{`${provider.displayName} (${provider.settingId})`}</Option>)
                                        }
                                    </Select>)}
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Container Registry" key="container-registry">
                                <FormItem {...formItemLayout} label="Container Registry:" hasFeedback>
                                    {getFieldDecorator('containerRegistrySettingId', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Container Registry!',
                                            }
                                        ],
                                    })(<Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {containerRegistries.map(registry =>
                                            <Option key={registry.settingId}>{`${registry.displayName} (${registry.settingId})`}</Option>)
                                        }
                                    </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Docker Image Repository Name:" hasFeedback>
                                    {getFieldDecorator('dockerImageRepoName', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Docker Image Repository Name!',
                                            },
                                            {
                                                max: 100,
                                                message: 'Only 100 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Docker Image Repository Name" />)}
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Additional" key="additional">
                                <FormItem {...formItemLayout} label="Build Tool:" hasFeedback>
                                    {getFieldDecorator('buildToolSettingId', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Build Tool!',
                                            }
                                        ],
                                    })(<Select showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {buildTools.map(buildTool =>
                                            <Option key={buildTool.settingId}>{`${buildTool.displayName} (${buildTool.settingId})`}</Option>)
                                        }
                                    </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Base Build Path (Docker Build):" hasFeedback>
                                    {getFieldDecorator('appBasePath', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                max: 200,
                                                message: 'Only 200 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Base Build Path (Docker Build)" />)}
                                </FormItem>
                            </TabPane>
                        </Tabs>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" loading={iconLoading} htmlType="submit" >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

const WrappedComponent = Form.create({ name: 'create-deployment' })(CreateDeployment);
export default WrappedComponent;