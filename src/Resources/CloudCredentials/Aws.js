import React, { useContext, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';

function AWS() {
    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [accessId, setAccessId] = useState('');
    const [secretKey, setSecretKey] = useState('');

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

    function createCloudCredential() {
        setIconLoading(true);
        var data = {
            'provider': 'aws',
            'displayName': displayName,
            'accessId': accessId,
            'secretKey': secretKey,
        };
        axios.post('http://localhost:8097/v1/tenant-cloud-credential', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('AWS Cloud credential added.', 5);
            })
            .catch((error) => {
                console.log(error);
                message.error(error.message);
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle">
                <Col span={20}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Display Name" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="AWS Access Id" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="AWS Access Id"
                                value={accessId}
                                onChange={(e) => { setAccessId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="AWS Secret Key" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="AWS Secret Key"
                                value={secretKey}
                                onChange={(e) => { setSecretKey(e.target.value) }} />
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon={'check-circle-o'}
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={createCloudCredential} >Create</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AWS;