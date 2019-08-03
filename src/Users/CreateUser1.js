import React, { useContext, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin, Select } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

function CreateUser1() {
    const [iconLoading, setIconLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");


    const user = useContext(UserContext);
    console.log("in CR1");

    const Option = Select.Option;
    const FormItem = Form.Item;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    document.title = "Create User";

    function changeRole(selectedRole) {
        setRole(selectedRole);
    }

    function createUser() {
        setIconLoading(true);
        var data = {
            'userName': userName,
            'password': password,
            'enabled': true,
            'displayName': displayName,
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'roles': [role],
        };
        axios.post('http://localhost:8097/v1/user/', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('User created successfully.', 5);
               // this.props.history.push('/app/manage-users');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (

        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div>
                CreateUser1:  {user.currentUser ? user.currentUser.firstName : ""}
            </div>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold' }} >Create New User</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="User Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" User Name"
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password:">
                            <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                type="password" placeholder=" Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="First Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" First Name"
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Last Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Last Name"
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Email:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Role:">
                            <Select value={role}
                                onChange={changeRole}>
                                <Option value="ROLE_ADMIN">ROLE_ADMIN</Option>
                                <Option value="ROLE_USER">ROLE_USER</Option>
                            </Select>
                        </FormItem>



                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon={'check-circle-o'}
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

export default CreateUser1;