import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tag, Divider } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
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



function EditBuildTool() {
    const [iconLoading, setIconLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [fileName, setFileName] = useState("build-settings");
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
            document.title = "View Build Tool";
            setPageTitle("View Build Tool");
        } else {
            document.title = "Edit Build Tool";
            setPageTitle("Edit Build Tool");
        }
        loadDetails();
    }, [isViewMode]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/build-tool/${projectResourceId}/${settingId}`)
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


    function updateSetting() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'displayName': displayName,
            'provider': provider,
            'fileName': fileName,
            'fileData': btoa(fileData),
        };
        axios.put(`http://localhost:8097/v1/settings/build-tool/${projectResourceId}/${settingId}`, data)
            .then((response) => {
                setIconLoading(false);
                message.success('Build tool updated successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/build-tools`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let buildSettingsOptionsView;
    let submitButtonView;
    let lastUpdatedByView;
    let lastUpdatedOnView;
    if (isViewMode) {
        submitButtonView = null;
        lastUpdatedByView = (
            <Tag color="blue">{lastUpdatedBy}</Tag>
        );
        lastUpdatedOnView = (
            <Tag color="blue">{lastUpdatedOn}</Tag>
        );
        buildSettingsOptionsView = (
            <FormItem {...formItemLayout} label="Build Settings">
                <Button type="primary" size="small">View</Button>
                <Divider type="vertical" />
                <Button type="primary" size="small">Download</Button>
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
        buildSettingsOptionsView = (
            <FormItem {...formItemLayout} label="Build Settings">
                <Input.TextArea readOnly={isViewMode}
                    placeholder="Build Settings"
                    autosize={{ minRows: 10, maxRows: 15 }}
                    value={fileData}
                    onChange={(e) => { setFileData(e.target.value) }} />
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
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                            {lastUpdatedByView}
                            {lastUpdatedOnView}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input readOnly={isViewMode}
                                placeholder="Provider"
                                value={provider}
                                onChange={(e) => { setProvider(e.target.value) }} />
                        </FormItem>
                        {buildSettingsOptionsView}
                        {submitButtonView}
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default EditBuildTool;