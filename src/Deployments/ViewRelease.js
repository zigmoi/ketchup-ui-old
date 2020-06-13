import { Col, Form, Input, Row, Spin, Tag, Button, Divider, Icon } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdditionalInfo from '../AdditionalInfo';

function ViewRelease() {

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

    const [iconLoading, setIconLoading] = useState(false);
    const [commitId, setCommitId] = useState("");
    const [status, setStatus] = useState("");
    const [helmReleaseId, setHelmReleaseId] = useState("");
    const [createdOn, setCreatedOn] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
    const [lastUpdatedBy, setLastUpdatedBy] = useState(null);

    const { projectResourceId, deploymentResourceId, releaseResourceId } = useParams();

    useEffect(() => {
        document.title = "Release Details";
        loadRelease();
    }, []);

    function loadRelease() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/release?releaseResourceId=${releaseResourceId}`)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                setCommitId(response.data.commitId);
                setStatus(response.data.status);
                setHelmReleaseId(response.data.helmReleaseId);
                setCreatedOn(response.data.createdOn);
                setCreatedBy(response.data.createdBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
                setLastUpdatedBy(response.data.lastUpdatedBy);

            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let extraInfo = (
        <AdditionalInfo
            createdOn={createdOn}
            createdBy={createdBy}
            lastUpdatedOn={lastUpdatedOn}
            lastUpdatedBy={lastUpdatedBy} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Release Details</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input value={releaseResourceId} readOnly suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Deployment ID:">
                            <Input value={deploymentResourceId} readOnly />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Commit ID:">
                            <Input value={commitId} readOnly />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Helm Release ID:">
                            <Input value={helmReleaseId} readOnly />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Release Status:">
                            <Tag color="#52c41a">{status}</Tag>
                            <Divider type="vertical" />
                            <Button type="primary" size="small" shape="circle">
                                <Link to={`/app/project/${projectResourceId}/deployment/${deploymentResourceId}/release/${releaseResourceId}/pipeline`}>
                                    <Icon type="profile" />
                                </Link>
                            </Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewRelease;