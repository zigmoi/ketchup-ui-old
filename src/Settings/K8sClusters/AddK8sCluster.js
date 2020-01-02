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

function AddK8sCluster(props) {
    document.title = "Add Kubernetes Cluster";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    let history = useHistory();
    let { projectResourceId } = useParams();

    function addK8sCluster(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'projectId': projectResourceId,
                    'fileName': values.fileName,
                    'fileData': btoa(values.fileData),
                    'displayName': values.displayName,
                    'provider': values.provider,
                };
                axios.post('http://localhost:8097/v1/settings/kubernetes-cluster', data)
                    .then((response) => {
                        console.log(response);
                        setIconLoading(false);
                        message.success('Kubernetes cluster added successfully.', 5);
                        history.push(`/app/project/${projectResourceId}/settings/kubernetes-clusters`);
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
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Kubernetes Cluster</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={addK8sCluster} style={{ backgroundColor: 'white' }}>
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
                                <Option key="aws">AWS</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="KubeConfig Name:" hasFeedback>
                            {getFieldDecorator('fileName', {
                                initialValue: "KubeConfig.json",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid KubeConfig Name!',
                                    },
                                    {
                                        max: 100,
                                        message: 'Only 100 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="KubeConfig Name" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="KubeConfig Data:" hasFeedback>
                            {getFieldDecorator('fileData', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid KubeConfig Data!',
                                    },
                                    {
                                        max: 1000,
                                        message: 'Only 1000 characters are allowed!',
                                    },
                                ],
                            })(<Input.TextArea placeholder="KubeConfig Data" autosize={{ minRows: 10, maxRows: 15 }} />)}
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

const WrappedComponent = Form.create({ name: 'add-k8s-cluster' })(AddK8sCluster);
export default WrappedComponent;