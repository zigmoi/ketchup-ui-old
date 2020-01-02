import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';


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

function EditBuildTool(props) {
    document.title = "Edit Build Tool";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [fileName, setFileName] = useState("build-settings");
    const [fileData, setFileData] = useState("");

    let history = useHistory();
    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingId]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/settings/build-tool/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setProvider(response.data.provider);
                setFileName(response.data.fileName);
                setFileData(atob(response.data.fileData));
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function updateSetting(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'projectId': projectResourceId,
                    'displayName': values.displayName,
                    'provider': values.provider,
                    'fileName': fileName,
                    'fileData': btoa(values.fileData),
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
        });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Edit Build Tool</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={updateSetting} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input readOnly value={settingId} />
                        </FormItem>

                        <FormItem {...formItemLayout} label="Project ID:">
                            <Input readOnly value={projectResourceId} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:" hasFeedback>
                            {getFieldDecorator('displayName', {
                                initialValue: displayName,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Display Name!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Display Name" autoFocus />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Provider:" hasFeedback>
                            {getFieldDecorator('provider', {
                                initialValue: provider,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select valid Provider!',
                                    }
                                ],
                            })(<Select>
                                <Option key="maven">Maven</Option>
                                <Option key="gradle">Gradle</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Build Settings:" hasFeedback>
                            {getFieldDecorator('fileData', {
                                initialValue: fileData,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Build Settings!',
                                    },
                                    {
                                        max: 1000,
                                        message: 'Only 1000 characters are allowed!',
                                    },
                                ],
                            })(<Input.TextArea autosize={{ minRows: 10, maxRows: 15 }} />)}
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" loading={iconLoading} htmlType="submit" >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

const WrappedComponent = Form.create({ name: 'edit-build-tool' })(EditBuildTool);
export default WrappedComponent;