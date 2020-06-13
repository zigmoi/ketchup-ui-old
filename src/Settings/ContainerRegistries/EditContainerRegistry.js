import { Button, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AdditionalInfo from '../../AdditionalInfo';

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


function EditContainerRegistry(props) {
    document.title = "Edit Container Registry";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [type, setType] = useState("");
    const [registryUrl, setRegistryUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let history = useHistory();
    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingId]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/container-registry/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setType(response.data.type);
                setRegistryUrl(response.data.registryUrl);
                setUsername(response.data.registryUsername);
                setPassword(response.data.registryPassword);
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
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
                    'type': values.type,
                    'registryUrl': values.registryUrl,
                    'registryUsername': values.username,
                    'registryPassword': values.password,
                };
                axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/container-registry/${projectResourceId}/${settingId}`, data)
                    .then((response) => {
                        setIconLoading(false);
                        message.success('Container registry updated successfully.', 5);
                        history.push(`/app/project/${projectResourceId}/settings/container-registries`);
                    })
                    .catch((error) => {
                        setIconLoading(false);
                    });
            }
        });
    }

    let extraInfo = (
        <AdditionalInfo lastUpdatedBy={lastUpdatedBy} lastUpdatedOn={lastUpdatedOn} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Container Registry</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={updateSetting} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input readOnly value={settingId} suffix={extraInfo} />
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
                        <FormItem {...formItemLayout} label="Type:" hasFeedback>
                            {getFieldDecorator('type', {
                                initialValue: type,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select valid Type!',
                                    }
                                ],
                            })(<Select>
                                <Option key="local">LOCAL</Option>
                                <Option key="docker-hub">DOCKER-HUB</Option>
                                <Option key="aws-ecr">AWS-ECR</Option>
                                <Option key="gcr">GCR</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Url:" hasFeedback>
                            {getFieldDecorator('registryUrl', {
                                initialValue: registryUrl,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Url!',
                                    },
                                    {
                                        max: 200,
                                        message: 'Only 200 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Url" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Username:" hasFeedback>
                            {getFieldDecorator('username', {
                                initialValue: username,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Username!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Username" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Token / Password:" hasFeedback>
                            {getFieldDecorator('password', {
                                initialValue: password,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Token / Password!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input.Password placeholder="Token / Password" />)}
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

const WrappedComponent = Form.create({ name: 'edit-conatiner-registry' })(EditContainerRegistry);
export default WrappedComponent;