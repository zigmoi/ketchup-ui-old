import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Tag, Tooltip } from 'antd';
import { Row, Col, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useParams, Link } from 'react-router-dom';

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

function ViewContainerRegistry() {
    document.title = "View Container Registry";

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [registryId, setRegistryId] = useState("");
    const [registryUrl, setRegistryUrl] = useState("");
    const [cloudCredentialId, setCloudCredentialId] = useState("");
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingId]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/container-registry/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setProvider(response.data.provider);
                setRegistryId(response.data.registryId);
                setRegistryUrl(response.data.registryUrl);
                setCloudCredentialId(response.data.cloudCredentialId);
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(moment(response.data.lastUpdatedOn).format("LLL"));
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let editLink;
    editLink = (
        <Link to={`/app/project/${projectResourceId}/settings/${settingId}/container-registry/edit`}>
            <Tooltip title="Edit">
                <Icon type="edit" />
            </Tooltip>
        </Link>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >View Container Registry{editLink}</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input readOnly value={settingId} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Project ID:">
                            <Input readOnly value={projectResourceId} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input readOnly value={displayName} />
                            <Tag color="blue">{lastUpdatedBy}</Tag>
                            <Tag color="blue">{lastUpdatedOn}</Tag>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input readOnly value={provider} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry ID:">
                            <Input readOnly value={registryId} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry URL:">
                            <Input readOnly value={registryUrl} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Cloud Credential ID:">
                            <Input readOnly value={cloudCredentialId} />
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewContainerRegistry;