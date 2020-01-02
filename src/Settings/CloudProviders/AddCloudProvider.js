import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
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

function AddCloudProvider(props) {
    document.title = "Add Cloud Provider";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    let history = useHistory();
    let { projectResourceId } = useParams();

    function addCloudProvider(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'projectId': projectResourceId,
                    'displayName': values.displayName,
                    'provider': values.provider,
                    'accessId': values.accessId,
                    'secretKey': values.secretKey,
                };
                axios.post('http://localhost:8097/v1/settings/cloud-provider', data)
                    .then((response) => {
                        console.log(response);
                        setIconLoading(false);
                        message.success('Cloud provider added successfully.', 5);
                        history.push(`/app/project/${projectResourceId}/settings/cloud-providers`);
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
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Cloud Provider</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={addCloudProvider} style={{ backgroundColor: 'white' }}>
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
                        <FormItem {...formItemLayout} label="Access ID:" hasFeedback>
                            {getFieldDecorator('accessId', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Access ID!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Access ID" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Secret Key:" hasFeedback>
                            {getFieldDecorator('secretKey', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Secret Key!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input.Password placeholder="Secret Key" />)}
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

const WrappedComponent = Form.create({ name: 'add-cloud-provider' })(AddCloudProvider);
export default WrappedComponent;