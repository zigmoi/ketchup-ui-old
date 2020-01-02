import { Button, Col, Divider, Form, Icon, Input, Row, Spin, Tag, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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


function ViewK8sCluster() {
    document.title = "View Kubernetes Cluster";

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [fileName, setFileName] = useState("kubeconfig");
    const [fileData, setFileData] = useState("");
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingId]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/kubernetes-cluster/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setProvider(response.data.provider);
                setFileName(response.data.fileName);
                setFileData(atob(response.data.fileData));
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(moment(response.data.lastUpdatedOn).format("LLL"));
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let editLink = (
        <Link to={`/app/project/${projectResourceId}/settings/${settingId}/kubernetes-cluster/edit`}>
            <Tooltip title="Edit">
                <Icon type="edit" />
            </Tooltip>
        </Link>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >View Kubernetes Cluster{editLink}</label>
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
                        <FormItem {...formItemLayout} label="Kube Config">
                            <Icon type="file-text" style={{fontSize: 20}} />
                            <Divider type="vertical" />
                            <Button type="primary" size="small">View</Button>
                            <Divider type="vertical" />
                            <Button type="primary" size="small">Download</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewK8sCluster;