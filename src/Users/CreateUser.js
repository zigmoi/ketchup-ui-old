import React, { useState, useContext } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserContext from '../UserContext';

function CreateUser(props) {
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

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

    document.title = "Create User";
    const [iconLoading, setIconLoading] = useState(false);

    const userContext = useContext(UserContext);
    const tenantId = "@".concat(userContext.currentUser ? userContext.currentUser.tenantId : "");
    let history = useHistory();

    function submitRequest(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'userName': values.userName.concat(tenantId),
                    'password': values.password,
                    'enabled': true,
                    'displayName': values.displayName,
                    'firstName': values.firstName,
                    'lastName': values.lastName,
                    'email': values.email,
                    'roles': values.roles,
                };
                axios.post('http://localhost:8097/v1/user/', data)
                    .then((response) => {
                        console.log(response);
                        setIconLoading(false);
                        message.success('User created successfully.', 5);
                        history.push("/app/manage-users");
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
                    <label style={{ fontWeight: 'bold' }} >Create New User</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={submitRequest} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="User Name:" hasFeedback>
                            {getFieldDecorator('userName', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid User Name!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="User Name" autoFocus addonAfter={tenantId} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password:"
                            hasFeedback extra="Should be a mix of capital letters, small letters, numbers and a special character.">
                            {getFieldDecorator('password', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Password!',
                                    },
                                    {
                                        min: 8,
                                        max: 50,
                                        message: 'Size should be between 8-50 characters!',
                                    },
                                ],
                            })(<Input.Password placeholder="Password" />)}
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
                        <FormItem {...formItemLayout} label="Roles:" hasFeedback>
                            {getFieldDecorator('roles', {
                                initialValue: ['ROLE_USER'],
                                rules: [
                                    {
                                        type: "array",
                                        required: true,
                                        message: 'Please select a Role!',
                                    },
                                ]
                            })(<Select mode="multiple">
                                <Option value="ROLE_USER">USER</Option>
                                <Option value="ROLE_TENANT_ADMIN">TENANT ADMIN</Option>
                                <Option value="ROLE_USER_ADMIN">USER ADMIN</Option>
                                <Option value="ROLE_CONFIG_ADMIN">CONFIGURATION ADMIN</Option>
                                <Option value="ROLE_SUPER_ADMIN">SUPER ADMIN</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="First Name:" hasFeedback>
                            {getFieldDecorator('firstName', {
                                initialValue: "",
                                rules: [
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="First Name" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Last Name:" hasFeedback>
                            {getFieldDecorator('lastName', {
                                initialValue: "",
                                rules: [
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Last Name" />)}
                        </FormItem>
                        <Form.Item label="Email" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('email', {
                                initialValue: "",
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'Please provide valid Email!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Email" />)}
                        </Form.Item>
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

const WrappedComponent = Form.create({ name: 'create-user' })(CreateUser);
export default WrappedComponent;