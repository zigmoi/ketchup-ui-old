import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams, useLocation } from 'react-router-dom';

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



function EditK8sCluster() {
    const [iconLoading, setIconLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileData, setFileData] = useState("");
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let history = useHistory();
    let { projectResourceId, settingId } = useParams();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const mode = query.get("mode");
    const isViewMode = mode === 'VIEW';
    useEffect(() => {
        if (isViewMode) {
            document.title = "View Kubernetes Cluster";
            setPageTitle("View Kubernetes Cluster");
        } else {
            document.title = "Edit Kubernetes Cluster";
            setPageTitle("Edit Kubernetes Cluster");
        }
        loadDetails();
    }, [isViewMode]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/kubernetes-cluster/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setProvider(response.data.provider);
                setFileName(response.data.fileName);
                setFileData(response.data.fileData);
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function updateSetting() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'displayName': displayName,
            'provider': provider,
            'fileName': fileName,
            'fileData': fileData,
        };
        axios.put(`http://localhost:8097/v1/settings/kubernetes-cluster/${projectResourceId}/${settingId}`, data)
            .then((response) => {
                setIconLoading(false);
                message.success('Kubernetes cluster updated successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/kubernetes-clusters`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let submitButtonView;
    let lastUpdatedByView;
    let lastUpdatedOnView;
    if (isViewMode) {
        submitButtonView = null;
        lastUpdatedByView = (
            <FormItem {...formItemLayout} label="Last Updated By :">
                <Input readOnly value={lastUpdatedBy} />
            </FormItem>

        );
        lastUpdatedOnView = (
            <FormItem {...formItemLayout} label="Last Updated On:">
                <Input readOnly value={lastUpdatedOn} />
            </FormItem>
        );
    } else {
        lastUpdatedByView = null;
        lastUpdatedOnView = null;
        submitButtonView = (
            <FormItem>
                <Row type="flex" justify="center" align="middle">
                    <Col>
                        <Button type="primary"
                            loading={iconLoading}
                            htmlType="submit"
                            onClick={updateSetting} >Submit</Button>
                    </Col>
                </Row>
            </FormItem>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >{pageTitle}</label>
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
                            <Input autoFocus
                                readOnly={isViewMode}
                                placeholder=" Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input readOnly={isViewMode}
                                placeholder=" Provider"
                                value={provider}
                                onChange={(e) => { setProvider(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="File Name:">
                            <Input readOnly={isViewMode}
                                placeholder=" File Name"
                                value={fileName}
                                onChange={(e) => { setFileName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="File Data">
                            <Input readOnly={isViewMode}
                                placeholder=" File Data"
                                value={fileData}
                                onChange={(e) => { setFileData(e.target.value) }} />
                        </FormItem>
                        {lastUpdatedOnView}
                        {lastUpdatedByView}
                        {submitButtonView}
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default EditK8sCluster;