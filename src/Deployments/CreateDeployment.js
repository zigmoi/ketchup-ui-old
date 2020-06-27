import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Select, InputNumber, Switch } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};


function CreateDeployment(props) {
    document.title = "Create Deployment";

    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);
    const [k8sClusters, setK8sClusters] = useState([]);
    const [containerRegistries, setContainerRegistries] = useState([]);
    const [buildTools, setBuildTools] = useState([]);
    const [continuousDeployment, setContinuousDeployment] = useState(false);
    const [deploymentPipelineType, setDeploymentPipelineType] = useState("standard-dev-1.0");

    let history = useHistory();
    let { projectResourceId } = useParams();

    useEffect(() => {
        loadAllK8sClusters();
        loadAllContainerRegistries();
        loadAllBuildTools();
    }, [projectResourceId]);



    function createDeployment(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    "displayName": values.displayName,
                    "description": values.description,
                    "serviceName": values.serviceName,
                    "appServerPort": values.appServerPort,
                    "replicas": values.replicas,
                    "deploymentStrategy": values.deploymentStrategy,
                    "gitRepoUrl": values.gitRepoUrl,
                    "gitRepoUsername": values.gitRepoUsername,
                    "gitRepoPassword": values.gitRepoPassword,
                    "gitRepoBranchName": values.gitRepoBranchName,
                    "continuousDeployment": values.continuousDeployment,
                    "gitRepoPollingInterval": values.gitRepoPollingInterval,
                    "platform": values.platform,
                    "containerRegistrySettingId": values.containerRegistrySettingId,
                    "containerRegistryPath": values.containerRegistryPath,
                    "buildTool": values.buildTool,
                    "baseBuildPath": values.baseBuildPath,
                    "buildToolSettingId": values.buildToolSettingId,
                    "deploymentPipelineType": values.deploymentPipelineType,
                    "devKubernetesClusterSettingId": values.devKubernetesClusterSettingId,
                    "devKubernetesNamespace": values.devKubernetesNamespace,
                    "prodKubernetesClusterSettingId": values.prodKubernetesClusterSettingId,
                    "prodKubernetesNamespace": values.prodKubernetesNamespace
                };
                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/deployments/basic-spring-boot`, data)
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/list-all-kubernetes-cluster/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setK8sClusters(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function loadAllContainerRegistries() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/list-all-container-registry/${projectResourceId}`)
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/list-all-build-tool/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setBuildTools(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function handleContinuousDeploymentChange(checked) {
        setContinuousDeployment(checked);
    }

    function handleDeploymentPipelineChange(value) {
        setDeploymentPipelineType(value);
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
                <Col span={24}>
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
                                <FormItem {...formItemLayout} label="Description:" hasFeedback>
                                    {getFieldDecorator('description', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                max: 100,
                                                message: 'Only 100 characters are allowed!',
                                            },
                                        ],
                                    })(<Input.TextArea placeholder="Description" autosize={{ minRows: 3, maxRows: 5 }} />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Service Name:" hasFeedback>
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
                                <FormItem {...formItemLayout} label="Application Port:" hasFeedback>
                                    {getFieldDecorator('appServerPort', {
                                        initialValue: "80",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please provide valid application port number!',
                                            },
                                        ],
                                    })(<InputNumber style={{ width: '100%' }} min={1} max={100} placeholder="Application Port" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Replicas:" hasFeedback>
                                    {getFieldDecorator('replicas', {
                                        initialValue: "1",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please provide valid number of replicas!',
                                            },
                                        ],
                                    })(<InputNumber style={{ width: '100%' }} min={1} max={100} placeholder="Replicas" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Deployment Strategy:" hasFeedback>
                                    {getFieldDecorator('deploymentStrategy', {
                                        initialValue: "recreate",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Deployment Strategy!',
                                            }
                                        ],
                                    })(<Select>
                                        <Option key="recreate">Recreate</Option>
                                        <Option key="ramped">Ramped</Option>
                                        <Option key="blue/green">Blue/Green</Option>
                                        <Option key="canary">Canary</Option>
                                    </Select>)}
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Application Code" key="application-code">
                                <FormItem {...formItemLayout} label="Git Repository Url:" hasFeedback>
                                    {getFieldDecorator('gitRepoUrl', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Git Repository Url!',
                                            },
                                            {
                                                max: 200,
                                                message: 'Only 200 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Git Repository Url" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Git Repository User Name:" hasFeedback>
                                    {getFieldDecorator('gitRepoUsername', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Git Repository User Name!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Git Repository User Name" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Git Repository Token / Password:" hasFeedback>
                                    {getFieldDecorator('gitRepoPassword', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Git Repository Token / Password!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input.Password placeholder="Git Repository Token / Password" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Git Repository Branch Name:" hasFeedback>
                                    {getFieldDecorator('gitRepoBranchName', {
                                        initialValue: "master",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Git Repository Branch Name!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Git Repository Branch Name" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Continuous  Deployment:">
                                    {getFieldDecorator('continuousDeployment', { valuePropName: 'checked' })
                                        (<Switch defaultChecked onChange={handleContinuousDeploymentChange} />)}
                                </FormItem>

                                {continuousDeployment ?
                                    <FormItem {...formItemLayout} label="Poll Interval (In Seconds):" hasFeedback>
                                        {getFieldDecorator('gitRepoPollingInterval', {
                                            initialValue: "10",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please provide valid Git Repository Polling Interval!',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={10} max={100000} placeholder="Poll Interval (In Seconds)" />)}
                                    </FormItem> : null}

                            </TabPane>
                            <TabPane tab="Build & Artifacts" key="build-artifacts">
                                <FormItem {...formItemLayout} label="Platform:" hasFeedback>
                                    {getFieldDecorator('platform', {
                                        initialValue: "java-8",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Platform!',
                                            }
                                        ],
                                    })(<Select>
                                        <Option key="java-8">Java 8</Option>
                                        <Option key="java-11">Java 11</Option>
                                    </Select>)}
                                </FormItem>
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
                                <FormItem {...formItemLayout} label="Container Registry Path:" hasFeedback>
                                    {getFieldDecorator('containerRegistryPath', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Container Registry Path!',
                                            },
                                            {
                                                max: 100,
                                                message: 'Only 100 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Container Registry Path" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Build Tool:" hasFeedback>
                                    {getFieldDecorator('buildTool', {
                                        initialValue: "maven-3.3",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Build Tool!',
                                            }
                                        ],
                                    })(<Select>
                                        <Option key="maven-3.3">Maven 3.3</Option>
                                        <Option key="gradle-5.5">Gradle 5.5</Option>
                                    </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Base Build Path (Image Build):" hasFeedback>
                                    {getFieldDecorator('baseBuildPath', {
                                        initialValue: "/",
                                        rules: [
                                            {
                                                max: 200,
                                                message: 'Only 200 characters are allowed in Base Build Path!',
                                            },
                                        ],
                                    })(<Input placeholder="Base Build Path (Image Build)" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Build Tool Settings:" hasFeedback>
                                    {getFieldDecorator('buildToolSettingId', {
                                        initialValue: "",
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
                            </TabPane>
                            <TabPane tab="Target Environments" key="target-environments">
                                <FormItem {...formItemLayout} label="Pipeline:" hasFeedback>
                                    {getFieldDecorator('deploymentPipelineType', {
                                        initialValue: "standard-dev-1.0",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Pipeline!',
                                            }
                                        ],
                                    })(<Select onChange={handleDeploymentPipelineChange}>
                                        <Option key="standard-dev-1.0">Standard Dev Pipeline 1.0</Option>
                                        <Option key="standard-prod-1.0">Standard Prod Pipeline 1.0</Option>
                                    </Select>)}
                                </FormItem>
                                <label style={{ fontWeight: "bold" }}>Dev Environment:</label>
                                <FormItem {...formItemLayout} label="Cluster:" hasFeedback>
                                    {getFieldDecorator('devKubernetesClusterSettingId', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select valid Dev Kubernetes Cluster!',
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
                                <FormItem {...formItemLayout} label="Namespace:" hasFeedback>
                                    {getFieldDecorator('devKubernetesNamespace', {
                                        initialValue: "default-kp",
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please provide valid Dev Kubernetes Namespace!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Only 50 characters are allowed!',
                                            },
                                        ],
                                    })(<Input placeholder="Kubernetes Namespace" />)}
                                </FormItem>

                                {deploymentPipelineType === "standard-prod-1.0" ?
                                    <React.Fragment>
                                        <label style={{ fontWeight: "bold" }}>Prod Environment:</label>
                                        <FormItem {...formItemLayout} label="Cluster:" hasFeedback>
                                            {getFieldDecorator('prodKubernetesClusterSettingId', {
                                                initialValue: "",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Please select valid Prod Kubernetes Cluster!',
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
                                        <FormItem {...formItemLayout} label="Namespace:" hasFeedback>
                                            {getFieldDecorator('prodKubernetesNamespace', {
                                                initialValue: "default-kp",
                                                rules: [
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: 'Please provide valid Prod Kubernetes Namespace!',
                                                    },
                                                    {
                                                        max: 50,
                                                        message: 'Only 50 characters are allowed!',
                                                    },
                                                ],
                                            })(<Input placeholder="Kubernetes Namespace" />)}
                                        </FormItem>
                                    </React.Fragment> : null}
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