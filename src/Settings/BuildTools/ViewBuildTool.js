import { Button, Col, Divider, Form, Icon, Input, Row, Spin, Tooltip } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdditionalInfo from '../../AdditionalInfo';

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

function ViewBuildTool() {
    document.title = "Build Tool";

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [type, setType] = useState("");
    const [fileData, setFileData] = useState("");
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        loadDetails();
    }, []);

    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/build-tool/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setType(response.data.type);
                setFileData(atob(response.data.fileData));
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let editLink = (
        <Link to={`/app/project/${projectResourceId}/settings/${settingId}/build-tool/edit`}>
            <Tooltip title="Edit">
                <Icon type="edit" />
            </Tooltip>
        </Link>
    );

    let extraInfo = (
        <AdditionalInfo lastUpdatedBy={lastUpdatedBy} lastUpdatedOn={lastUpdatedOn} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Build Tool {editLink}</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input readOnly value={settingId} suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input readOnly value={displayName} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Type:">
                            <Input readOnly value={type} />
                        </FormItem>
                        <FormItem label="Build Settings">
                            <Input.TextArea readOnly value={fileData} autosize={{ minRows: 10, maxRows: 15 }} />
                        </FormItem>
                        <Button type="primary" size="small">Download</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewBuildTool;