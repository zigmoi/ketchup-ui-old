import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tag } from 'antd';
import { Row, Col, message, Spin, Tooltip, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useHistory, useParams, useLocation, Link } from 'react-router-dom';

const Option = Select.Option;
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



function EditCloudProvider() {
    const [iconLoading, setIconLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [accessId, setAccessId] = useState("");
    const [secretKey, setSecretKey] = useState("");
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
            document.title = "View Cloud Provider";
            setPageTitle("View Cloud Provider ");
        } else {
            document.title = "Edit Cloud Provider";
            setPageTitle("Edit Cloud Provider");
        }
        loadDetails();
    }, [isViewMode]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/cloud-provider/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setProvider(response.data.provider);
                setAccessId(response.data.accessId);
                setSecretKey(response.data.secretKey);
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
            'accessId': accessId,
            'secretKey': secretKey,
        };
        axios.put(`http://localhost:8097/v1/settings/cloud-provider/${projectResourceId}/${settingId}`, data)
            .then((response) => {
                setIconLoading(false);
                message.success('Cloud provider updated successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/cloud-providers`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let editLink;
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
        editLink = (
            <Link to={`/app/project/${projectResourceId}/settings/${settingId}/cloud-provider/edit?mode=EDIT`}>
                <Tooltip title="Edit">
                    <Icon type="edit" />
                </Tooltip>
            </Link>
        );
    } else {
        lastUpdatedByView = null;
        lastUpdatedOnView = null;
        editLink = null;
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
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >{pageTitle}{editLink}</label>
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
                            {isViewMode ?
                                <Input readOnly={isViewMode}
                                    placeholder="Provider"
                                    value={provider}
                                    onChange={(e) => { setProvider(e.target.value) }} />
                                :
                                <Select showSearch
                                    value={provider}
                                    onChange={(e) => { setProvider(e) }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    <Option key="aws">AWS</Option>
                                </Select>}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Access ID:">
                            <Input readOnly={isViewMode}
                                placeholder="Access ID"
                                value={accessId}
                                onChange={(e) => { setAccessId(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Secret Key:">
                            <Input.Password type="password"
                                placeholder="Secret Key"
                                readOnly={isViewMode}
                                value={secretKey}
                                onChange={(e) => { setSecretKey(e.target.value) }} />
                        </FormItem>
                        {submitButtonView}
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default EditCloudProvider;