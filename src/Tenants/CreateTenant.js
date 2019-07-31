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

class CreateTenant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            id: '',
            displayName: '',
            defaultUserEmail: '',
            defaultUserPassword: '',
        }
    }

    componentDidMount() {
        document.title = "Create Tenant";
    }

    createTenant = () => {
        this.setState({ "iconLoading": true });
        var data = {
            'id': this.state.id,
            'displayName': this.state.displayName,
            'defaultUserPassword': this.state.defaultUserPassword,
            'defaultUserEmail': this.state.defaultUserEmail,
        };
        axios.post('http://localhost:8097/v1/tenant', data)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('Tenant created successfully.', 5);
                this.props.history.push('/profile/manage-tenants');
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
                        <label style={{ fontWeight: 'bold' }} >Create New Tenant</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={this.state.iconLoading} />
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={20}  >
                        <Form style={{ backgroundColor: 'white' }}>
                            <FormItem {...formItemLayout} label="ID:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" ID"
                                    value={this.state.id}
                                    onChange={(e) => { this.setState({ id: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Display Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Display Name"
                                    value={this.state.displayName}
                                    onChange={(e) => { this.setState({ displayName: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Default User Email:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Default User Email"
                                    value={this.state.defaultUserEmail}
                                    onChange={(e) => { this.setState({ defaultUserEmail: e.target.value }) }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Default User Password:">
                                <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                    type="password" placeholder=" Default User Password"
                                    value={this.state.defaultUserPassword}
                                    onChange={(e) => {
                                        this.setState({ defaultUserPassword: e.target.value })
                                    }} />
                            </FormItem>

                            <FormItem>
                                <Row type="flex" justify="center" align="middle">
                                    <Col>
                                        <Button type="primary" icon={'check-circle-o'}
                                            loading={this.state.iconLoading}
                                            htmlType="submit"
                                            onClick={this.createTenant} >Submit</Button>
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



export default CreateTenant;
