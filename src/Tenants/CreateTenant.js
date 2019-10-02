import React, { useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

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

function CreateTenant() {
    let history = useHistory();
    const [iconLoading, setIconLoading] = useState(false);
    const [id, setId] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [defaultUserEmail, setDefaultUserEmail] = useState("");
    const [defaultUserPassword, setDefaultUserPassword] = useState("");

    document.title = "Create Tenant";

    function createTenant() {
        setIconLoading(true);
        var data = {
            'id': id,
            'displayName': displayName,
            'defaultUserPassword': defaultUserPassword,
            'defaultUserEmail': defaultUserEmail,
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
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" ID"
                                value={id}
                                onChange={(e) => { setId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Default User Email:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Default User Email"
                                value={defaultUserEmail}
                                onChange={(e) => { setDefaultUserEmail(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Default User Password:">
                            <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                type="password" placeholder=" Default User Password"
                                value={defaultUserPassword}
                                onChange={(e) => { setDefaultUserPassword(e.target.value) }} />
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon={'check-circle-o'}
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={createTenant} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}


export default CreateTenant;
