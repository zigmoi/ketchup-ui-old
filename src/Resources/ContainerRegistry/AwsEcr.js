import React, { useContext, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';

function AwsEcr() {
    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [cloudCredentialId, setCloudCredentialId] = useState('');
    const [registryId, setRegistryId] = useState('');
    const [registryUrl, setRegistryUrl] = useState('');

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

    function createCotainerRegistry() {
        setIconLoading(true);
        var data = {
            'provider': 'aws-ecr',
            'displayName': displayName,
            'cloudCredentialId': cloudCredentialId,
            'registryId': registryId,
            'registryUrl': registryUrl,
        };
        axios.post('http://localhost:8097/v1/tenant-cloud-registry', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('AWS registry added.', 5);
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
                        <FormItem {...formItemLayout} label="AWS Cloud Credential" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="AWS Cloud Credential"
                                value={cloudCredentialId}
                                onChange={(e) => { setCloudCredentialId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="ECR Registry Id" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="ECR Registry Id"
                                value={registryId}
                                onChange={(e) => { setRegistryId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="ECR Registry URL" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="ECR Registry URL"
                                value={registryUrl}
                                onChange={(e) => { setRegistryUrl(e.target.value) }} />
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon={'check-circle-o'}
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={createCotainerRegistry} >Create</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AwsEcr;