import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tag } from 'antd';
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



function EditGitProvider() {
    const [iconLoading, setIconLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repoListUrl, setRepoListUrl] = useState("");
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
            document.title = "View Git Provider";
            setPageTitle("View Git Provider");
        } else {
            document.title = "Edit Git Provider";
            setPageTitle("Edit Git Provider");
        }
        loadDetails();
    }, [isViewMode]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/git-provider/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setProvider(response.data.provider);
                setUserName(response.data.username);
                setPassword(response.data.password);
                setRepoListUrl(response.data.repoListUrl);
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
            'username': userName,
            'password': password,
            'repoListUrl': repoListUrl,
        };
        axios.put(`http://localhost:8097/v1/settings/git-provider/${projectResourceId}/${settingId}`, data)
            .then((response) => {
                setIconLoading(false);
                message.success('Git provider updated successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/git-providers`);
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
            <Tag color="blue">{lastUpdatedBy}</Tag>
        );
        lastUpdatedOnView = (
            <Tag color="blue">{lastUpdatedOn}</Tag>
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
                        <FormItem {...formItemLayout} label="User Name:">
                            <Input readOnly={isViewMode}
                                placeholder="User Name"
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password:">
                            <Input.Password readOnly={isViewMode}
                                type="password" placeholder="Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Repository List URL:">
                            <Input readOnly={isViewMode}
                                placeholder="Repository List URL"
                                value={repoListUrl}
                                onChange={(e) => { setRepoListUrl(e.target.value) }} />
                        </FormItem>
                        {submitButtonView}
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default EditGitProvider;