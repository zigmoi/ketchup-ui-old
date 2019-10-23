import React, { useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

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


function AddContainerRegistry() {
    document.title = "Add Cloud Provider";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [registryId, setRegistryId] = useState("");
    const [registryUrl, setRegistryUrl] = useState("");
    const [cloudCredentialId, setCloudCredentialId] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function AddContainerRegistry() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'settingId': "s1",
            'displayName': displayName,
            'provider': provider,
            'registryId': registryId,
            'registryUrl': registryUrl,
            'cloudCredentialId': cloudCredentialId,
        };
        axios.post('http://localhost:8097/v1/settings/container-registry', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Container registry added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/container-registries`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Container Registry</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input autoFocus
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input placeholder="Provider"
                                value={provider}
                                onChange={(e) => { setProvider(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry ID:">
                            <Input placeholder="Registry ID"
                                value={registryId}
                                onChange={(e) => { setRegistryId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry URL:">
                            <Input placeholder="Registry URL"
                                value={registryUrl}
                                onChange={(e) => { setRegistryUrl(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Cloud Credential ID:">
                            <Input placeholder="Cloud Credential ID"
                                value={cloudCredentialId}
                                onChange={(e) => { setCloudCredentialId(e.target.value) }} />
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={AddContainerRegistry} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AddContainerRegistry;