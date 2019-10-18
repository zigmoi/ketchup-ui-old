import React, { useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

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

    
function AddBuildTool() {
    document.title = "Add Build Tool";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileData, setFileData] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function AddBuildTool() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'fileName': fileName,
            'fileData': fileData,
            'displayName': displayName,
            'provider': provider,
        };
        axios.post('http://localhost:8097/v1/settings/build-tool', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Build tool added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/build-tools`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Build Tool</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                    <FormItem {...formItemLayout} label="Display Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                autoFocus
                                placeholder=" Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Provider"
                                value={provider}
                                onChange={(e) => { setProvider(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="File Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" File Name"
                                value={fileName}
                                onChange={(e) => { setFileName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="File Data">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" File Data"
                                value={fileData}
                                onChange={(e) => { setFileData(e.target.value) }} />
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={AddBuildTool} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AddBuildTool;