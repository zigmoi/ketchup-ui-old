import { Button, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

function EditGitProvider(props) {
    document.title = "Edit Git Provider";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repoListUrl, setRepoListUrl] = useState("");

    let history = useHistory();
    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingId]);


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
                    'username': values.userName,
                    'password': values.password,
                    'repoListUrl': values.repoListUrl,
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
        });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Edit Git Provider</label>
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
                                <Option key="gitlab">GitLab</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="User Name:" hasFeedback>
                            {getFieldDecorator('userName', {
                                initialValue: userName,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid User Name!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="User Name" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password:" hasFeedback>
                            {getFieldDecorator('password', {
                                initialValue: password,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Password!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input.Password placeholder="Password" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Repository List URL:" hasFeedback>
                            {getFieldDecorator('repoListUrl', {
                                initialValue: repoListUrl,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Repository List URL!',
                                    },
                                    {
                                        max: 200,
                                        message: 'Only 200 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Repository List URL" />)}
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

const WrappedComponent = Form.create({ name: 'edit-git-provider' })(EditGitProvider);
export default WrappedComponent;