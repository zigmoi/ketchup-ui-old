import React, { Component, useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin, Select } from 'antd';
import axios from 'axios';
import UserContext from '../UserContext';

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
            displayName: '',
            firstName: '',
            lastName: '',
            email: '',
            role: '',
        }
    }

    componentDidMount() {
        document.title = "Create User";
        console.log("user context: ", this.context);
    }

    changeRole = (selectedRole) => {
        this.setState({ role: selectedRole });
    }

    createUser = () => {
        this.setState({ "iconLoading": true });
        var data = {
            'userName': this.state.userName,
            'password': this.state.password,
            'enabled': true,
            'displayName': this.state.displayName,
            'firstName': this.state.firstName,
            'lastName': this.state.lastName,
            'email': this.state.email,
            'roles': [this.state.role],
        };
        axios.post('http://localhost:8097/v1/user/', data)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('User created successfully.', 5);
                this.props.history.push('/profile/manage-users');
            })
            .catch((error) => {
                this.setState({ iconLoading: false });
            });
    }

    render() {
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                    <Col span={24}>
                        <label style={{ fontWeight: 'bold' }} >Create New User</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={this.state.iconLoading} />
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}  >
                        <Form style={{ backgroundColor: 'white' }}>
                            <FormItem {...formItemLayout} label="User Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" User Name"
                                    value={this.state.userName}
                                    onChange={(e) => { this.setState({ userName: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Password:">
                                <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                    type="password" placeholder=" Password"
                                    value={this.state.password}
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Display Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Display Name"
                                    value={this.state.displayName}
                                    onChange={(e) => { this.setState({ displayName: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="First Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" First Name"
                                    value={this.state.firstName}
                                    onChange={(e) => { this.setState({ firstName: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Last Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Last Name"
                                    value={this.state.lastName}
                                    onChange={(e) => { this.setState({ lastName: e.target.value }) }} />
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
