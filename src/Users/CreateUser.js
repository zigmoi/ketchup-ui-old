import React, { useState, useContext } from 'react';
import { Form, Icon, Input, Button, Select } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserContext from '../UserContext';

function CreateUser() {
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
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState([]);

    const userContext = useContext(UserContext);
    const tenantId = "@".concat(userContext.currentUser ? userContext.currentUser.tenantId : "");
    let history = useHistory();

    function createUser() {
        setIconLoading(true);
        var data = {
            'userName': userName.concat(tenantId),
            'password': password,
            'enabled': true,
            'displayName': displayName,
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'roles': roles,
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
    function deleteSelectedRole(selectedRole) {
        const filteredRoles = roles.filter(role => role !== selectedRole);
        setRoles(filteredRoles);
        console.log(filteredRoles);
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Create New User</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="User Name:">
                            <Input autoFocus
                                placeholder="User Name"
                                addonAfter={tenantId}
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password:">
                            <Input.Password type="password" placeholder="Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="First Name:">
                            <Input placeholder="First Name"
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Last Name:">
                            <Input placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Email:">
                            <Input placeholder="Email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Roles:">
                            <Select mode="multiple"
                                onSelect={(e) => { setRoles([...roles, e]) }}
                                onDeselect={deleteSelectedRole}>
                                <Option value="ROLE_USER">USER</Option>
                                <Option value="ROLE_TENANT_ADMIN">TENANT ADMIN</Option>
                                <Option value="ROLE_USER_ADMIN">USER ADMIN</Option>
                                <Option value="ROLE_CONFIG_ADMIN">CONFIGURATION ADMIN</Option>
                                <Option value="ROLE_SUPER_ADMIN">SUPER ADMIN</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={createUser} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default CreateUser;