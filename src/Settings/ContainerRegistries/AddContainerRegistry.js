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
                    'provider': values.provider,
                    'registryId': values.registryId,
                    'registryUrl': values.registryUrl,
                    'cloudCredentialId': values.cloudCredentialId,
                };
                axios.post('http://localhost:8097/v1/settings/container-registry', data)
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
                        <FormItem {...formItemLayout} label="Provider:" hasFeedback>
                            {getFieldDecorator('provider', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select valid Provider!',
                                    }
                                ],
                            })(<Select>
                                <Option key="aws-ecr">AWS-ECR</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry ID:" hasFeedback>
                            {getFieldDecorator('registryId', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Registry ID!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Registry ID" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry URL:" hasFeedback>
                            {getFieldDecorator('registryUrl', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Registry URL!',
                                    },
                                    {
                                        max: 200,
                                        message: 'Only 200 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Registry URL" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Cloud Credential ID:" hasFeedback>
                            {getFieldDecorator('cloudCredentialId', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Cloud Credential ID!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Cloud Credential ID" />)}
                        </FormItem>
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