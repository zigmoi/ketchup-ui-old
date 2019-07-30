import React, { Component, useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin, Select } from 'antd';
import axios from 'axios';
import UserContext from './UserContext';

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

class CreateUser extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            userName: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: '',
            email: '',
            role: '',
        }
    }

    componentDidMount() {
        document.title = "Create User";
        console.log(this.context);
    }

    changeRole = (selectedRole) => {
        this.setState({ role: selectedRole });
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return true;
        } else {
            message.error('Please provide email address to continue!', 5);
            return false;
        }
    }

    createUser = () => {

        this.setState({ "iconLoading": true });

        var data = {
            'username': this.state.userName,
            'password': this.state.password,
            'enabled': true,
            'firstname': this.state.firstname,
            'lastname': this.state.lastname,
            'email': this.state.email,
            'role': this.state.role,
        };
        axios.post(  'http://localhost:8097/user1/', data)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('User created successfully.', 5);
            })
            .catch((error) => {
                //code comes here if status code greater than 2xx
                this.setState({ iconLoading: false });
            });
    }

    render() {
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Row type="flex" justify="center" align="middle">
                    <Col span={20}  >

                        <Form style={{ backgroundColor: 'white' }}>

                            <label style={{ fontSize: 15, fontWeight: 'bold' }}>Create New User</label>
                            <br />
                            <Spin spinning={this.state.iconLoading} />
                            <br />

                            <FormItem {...formItemLayout} label="Username:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Username"
                                    value={this.state.userName}
                                    onChange={(e) => { this.setState({ userName: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Password:">
                                <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                    type="password" placeholder=" Password"
                                    value={this.state.password}
                                    onBlur={this.validatePassword}
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Confirm Password:">
                                <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                    type="password" placeholder=" Confirm Password"
                                    value={this.state.confirmPassword}
                                    onBlur={this.validatePassword}
                                    onChange={(e) => {
                                        this.setState({ confirmPassword: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="First Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" First Name"
                                    value={this.state.firstname}
                                    onChange={(e) => { this.setState({ firstname: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Last Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Last Name"
                                    value={this.state.lastname}
                                    onChange={(e) => { this.setState({ lastname: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Email:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Email"
                                    value={this.state.email}
                                    onChange={(e) => { this.setState({ email: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Role:">
                                <Select value={this.state.role}
                                    onChange={this.changeRole}>
                                    <Option value="ROLE_ADMIN">ROLE_ADMIN</Option>
                                    <Option value="ROLE_USER">ROLE_USER</Option>
                                    <Option value="ROLE_MODERATOR">ROLE_MODERATOR</Option>
                                </Select>
                            </FormItem>



                            <FormItem>
                                <Row type="flex" justify="center" align="middle">
                                    <Col>
                                        <Button type="primary" icon={'check-circle-o'}
                                            loading={this.state.iconLoading}
                                            htmlType="submit"
                                            onClick={this.createUser} >Submit</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}



export default CreateUser;
