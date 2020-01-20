import { Button, Col, Form, Input, message, Row, Select, Spin, Switch } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AdditionalInfo from '../AdditionalInfo';

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

function EditUser(props) {
    document.title = "Edit User";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [roles, setRoles] = useState([]);
    const [createdOn, setCreatedOn] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
    const [lastUpdatedBy, setLastUpdatedBy] = useState(null);


    let history = useHistory();
    let { userName } = useParams();

    useEffect(() => {
        loadDetails();
    }, [userName]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setEnabled(response.data.enabled);
                setEmail(response.data.email);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setRoles(response.data.roles);
                setCreatedOn(response.data.createdOn);
                setCreatedBy(response.data.createdBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
                setLastUpdatedBy(response.data.lastUpdatedBy);

            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function updateSetting(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'userName': userName,
                    'enabled': values.enabled,
                    'displayName': values.displayName,
                    'firstName': values.firstName,
                    'lastName': values.lastName,
                    'email': values.email,
                    'roles': values.roles,
                    'password': '', //will be ignored while updating.
                };
                axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/user`, data)
                    .then((response) => {
                        setIconLoading(false);
                        message.success('User updated successfully.', 5);
                        history.push(`/app/manage-users`);
                    })
                    .catch((error) => {
                        setIconLoading(false);
                    });
            }
        });
    }

    let extraInfo = (
        <AdditionalInfo
            createdOn={createdOn}
            createdBy={createdBy}
            lastUpdatedOn={lastUpdatedOn}
            lastUpdatedBy={lastUpdatedBy} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Edit User</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={updateSetting} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="User Name:">
                            <Input readOnly value={userName} suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:" hasFeedback>
                            {getFieldDecorator('displayName', {
                                initialValue: displayName,
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
                        <FormItem {...formItemLayout} label="Email:" hasFeedback>
                            {getFieldDecorator('email', {
                                initialValue: email,
                                rules: [
                                    {
                                        whitespace: true,
                                        message: 'Please provide valid Email!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Email" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="First Name:" hasFeedback>
                            {getFieldDecorator('firstName', {
                                initialValue: firstName,
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
                                initialValue: lastName,
                                rules: [
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Last Name" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Roles:" hasFeedback>
                            {getFieldDecorator('roles', {
                                initialValue: roles,
                                rules: [
                                    {
                                        type: "array",
                                        required: true,
                                        message: 'Please select a Role!',
                                    },
                                ]
                            })(<Select mode="multiple">
                                <Option value="ROLE_USER">USER</Option>
                                <Option value="ROLE_USER_READER">USER READER</Option>
                                <Option value="ROLE_USER_ADMIN">USER ADMIN</Option>
                                <Option value="ROLE_TENANT_ADMIN">TENANT ADMIN</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Status:" >
                            <Row type="flex" justify="start" align="middle">
                                <Col>
                                    {getFieldDecorator('enabled', {
                                        initialValue: enabled,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please provide valid Status!',
                                            },
                                        ]
                                    })(<Switch checkedChildren="Active" unCheckedChildren="Disabled" />)}
                                </Col>
                            </Row>
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

const WrappedComponent = Form.create({ name: 'edit-user' })(EditUser);
export default WrappedComponent;