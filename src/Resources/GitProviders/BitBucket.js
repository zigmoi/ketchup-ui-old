import React, { Component, useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';

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

class BitBucket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            displayName: '',
            repoListUrl: 'https://api.bitbucket.org/1.0/user/repositories',
            username: '',
            password: ''
        }
    }

    componentDidMount() {}

    createGitProvider = () => {
        this.setState({ "iconLoading": true });
        var data = {
            'provider': 'bitbucket',
            'repoListUrl': this.state.repoListUrl,
            'displayName': this.state.displayName,
            'username': this.state.username,
            'password': this.state.password,
        };
        axios.post('http://localhost:8097/v1/create-git-provider', data)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('Git provider added.', 5);
                this.props.history.push('/profile/add-git-provider');
            })
            .catch((error) => {
                this.setState({ iconLoading: false });
            });
    }

    render = () => {
        return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                    <Col span={24}>
                        <label style={{ fontWeight: 'bold' }} >Add BitBucket Details</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={this.state.iconLoading} />
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={20}  >
                        <Form style={{ backgroundColor: 'white' }}>
                            <FormItem {...formItemLayout} label=" Repo List URL ">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Repo List URL "
                                    value={this.state.repoListUrl}
                                    disabled="true"
                                    onChange={(e) => { this.setState({ repoListUrl: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Display Name ">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Display Name "
                                    value={this.state.displayName}
                                    onChange={(e) => { this.setState({ displayName: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Bitbucket Username ">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Bitbucket Username"
                                    value={this.state.username}
                                    onChange={(e) => { this.setState({ username: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Bitbucket Password ">
                                <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                    type="password" placeholder=" Bitbucket Password "
                                    value={this.state.password}
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value })
                                    }} />
                            </FormItem>

                            <FormItem>
                                <Row type="flex" justify="center" align="middle">
                                    <Col>
                                        <Button type="primary" icon={'check-circle-o'}
                                            loading={this.state.iconLoading}
                                            htmlType="submit"
                                            onClick={this.createGitProvider} >Create</Button>
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

export default BitBucket;