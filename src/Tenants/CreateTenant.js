import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

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

function CreateTenant(props) {
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    let history = useHistory();
    const [iconLoading, setIconLoading] = useState(false);

    document.title = "Create Tenant";

    function submitRequest(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'id': values.id,
                    'displayName': values.displayName,
                    'defaultUserPassword': values.defaultUserPassword,
                    'defaultUserEmail': values.defaultUserEmail,
                };
                axios.post('http://localhost:8097/v1/tenant', data)
                    .then((response) => {
                        console.log(response);
                        setIconLoading(false);
                        message.success('Tenant created successfully.', 5);
                        history.push('/app/manage-tenants');
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
                    <label style={{ fontWeight: 'bold' }} >Create New Tenant</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={20}  >
                    <Form onSubmit={submitRequest} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:" hasFeedback>
                            {getFieldDecorator('id', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Tenant ID!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="ID" autoFocus />)}
                        </FormItem>
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
                            })(<Input placeholder="Display Name" />)}
                        </FormItem>
                        <Form.Item label="Default User Email" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('defaultUserEmail', {
                                initialValue: "",
                                rules: [
                                    {
                                        type: 'email',
                                        required: true,
                                        message: 'Please provide valid Email!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Default User Email" />)}
                        </Form.Item>
                        <FormItem {...formItemLayout} label="Default User Password:" hasFeedback>
                            {getFieldDecorator('defaultUserPassword', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Password!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input.Password placeholder="Default User Password:" />)}
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

const WrappedComponent = Form.create({ name: 'create-tenant' })(CreateTenant);
export default WrappedComponent;
