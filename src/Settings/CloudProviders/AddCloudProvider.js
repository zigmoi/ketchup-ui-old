import React, { useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

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



function AddCloudProvider() {
    document.title = "Add Cloud Provider";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [accessId, setAccessId] = useState("");
    const [secretKey, setSecretKey] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function AddCloudProvider() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'displayName': displayName,
            'provider': provider,
            'accessId': accessId,
            'secretKey': secretKey,
        };
        axios.post('http://localhost:8097/v1/settings/cloud-provider', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Cloud provider added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/cloud-providers`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Cloud Provider</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                    <FormItem {...formItemLayout} label="Display Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                autoFocus
                                placeholder=" Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Provider"
                                value={provider}
                                onChange={(e) => { setProvider(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Access ID:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Access ID"
                                value={accessId}
                                onChange={(e) => { setAccessId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Secret Key:">
                            <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                type="password" placeholder=" Secret Key"
                                value={secretKey}
                                onChange={(e) => { setSecretKey(e.target.value) }} />
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={AddCloudProvider} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AddCloudProvider;