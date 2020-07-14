import { Button, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const Option = Select.Option;
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


function AddContainerRegistry(props) {
    document.title = "Add Cloud Provider";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);
    const [registryType, setRegistryType] = useState("local");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function addContainerRegistry(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'projectId': projectResourceId,
                    'displayName': values.displayName,
                    'type': values.type,
                    'registryUrl': values.registryUrl,
                    'repository': values.repository ? values.repository : "",
                    'registryUsername': values.username ? values.username : "",
                    'registryPassword': values.password ? values.password : "",
                };

                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/container-registry`, data)
                    .then((response) => {
                        console.log(response);
                        setIconLoading(false);
                        message.success('Container registry added successfully.', 5);
                        history.push(`/app/project/${projectResourceId}/settings/container-registries`);
                    })
                    .catch((error) => {
                        setIconLoading(false);
                    });
            }
        });
    }

    function handleRegistryTypeChange(value) {
        setRegistryType(value);
    }

    let details;
    if (registryType === "local") {
        details = (
            <React.Fragment>
                <FormItem {...formItemLayout} label="Url:" hasFeedback>
                    {getFieldDecorator('registryUrl', {
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please provide valid Url!',
                            },
                            {
                                max: 200,
                                message: 'Only 200 characters are allowed!',
                            },
                        ],
                    })(<Input placeholder="Url" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Repository:" hasFeedback>
                    {getFieldDecorator('repository', {
                        initialValue: "",
                        rules: [
                            {
                                whitespace: false,
                                message: 'Please provide valid Repository!',
                            },
                            {
                                max: 100,
                                message: 'Only 100 characters are allowed!',
                            },
                        ],
                    })(<Input placeholder="Repository" />)}
                </FormItem>
            </React.Fragment>);
    } else if (registryType === "docker-hub") {
        details = (
            <React.Fragment>
                <FormItem {...formItemLayout} label="Url:" hasFeedback>
                    {getFieldDecorator('registryUrl', {
                        initialValue: "index.docker.io",
                    })(<Input readOnly placeholder="Url" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Username:" hasFeedback>
                    {getFieldDecorator('username', {
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please provide valid Username!',
                            },
                            {
                                max: 50,
                                message: 'Only 50 characters are allowed!',
                            },
                        ],
                    })(<Input placeholder="Username" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Token / Password:" hasFeedback>
                    {getFieldDecorator('password', {
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please provide valid Token / Password!',
                            },
                            {
                                max: 50,
                                message: 'Only 50 characters are allowed!',
                            },
                        ],
                    })(<Input.Password placeholder="Token / Password" />)}
                </FormItem>
            </React.Fragment>);
    } else if (registryType === "gcr") {
        details = (
            <React.Fragment>
                <FormItem {...formItemLayout} label="Url:" hasFeedback>
                    {getFieldDecorator('registryUrl', {
                        initialValue: "gcr.io",
                    })(<Input readOnly placeholder="Url" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Project Id:" hasFeedback>
                    {getFieldDecorator('repository', {
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please provide valid Project Id!',
                            },
                            {
                                max: 100,
                                message: 'Only 100 characters are allowed!',
                            },
                        ],
                    })(<Input placeholder="Project Id" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Username:" hasFeedback>
                    {getFieldDecorator('username', {
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please provide valid Username!',
                            },
                            {
                                max: 50,
                                message: 'Only 50 characters are allowed!',
                            },
                        ],
                    })(<Input placeholder="Username" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Token / Password:" hasFeedback>
                    {getFieldDecorator('password', {
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please provide valid Token / Password!',
                            },
                            {
                                max: 5000,
                                message: 'Only 5000 characters are allowed!',
                            },
                        ],
                    })(<Input.Password placeholder="Token / Password" />)}
                </FormItem>
            </React.Fragment>);
    } else {
        details = null;
        message.error("UnSupported Registry type!");
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Container Registry</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={addContainerRegistry} style={{ backgroundColor: 'white' }}>
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
                        <FormItem {...formItemLayout} label="Type:" hasFeedback>
                            {getFieldDecorator('type', {
                                initialValue: "local",
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select valid Type!',
                                    }
                                ],
                            })(<Select onChange={handleRegistryTypeChange}>
                                <Option key="local">LOCAL</Option>
                                <Option key="docker-hub">DOCKER-HUB</Option>
                                <Option key="gcr">GCR</Option>
                                {/* <Option key="aws-ecr">AWS-ECR</Option>
                                <Option key="azurecr">AZURE-CR</Option> */}
                            </Select>)}
                        </FormItem>
                        {details}
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

const WrappedComponent = Form.create({ name: 'add-conatiner-registry' })(AddContainerRegistry);
export default WrappedComponent;