import { Button, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
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
    const [provider, setProvider] = useState("");
    const [registryId, setRegistryId] = useState("");
    const [registryUrl, setRegistryUrl] = useState("");
    const [cloudCredentialId, setCloudCredentialId] = useState("");
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
                setProvider(response.data.provider);
                setRegistryId(response.data.registryId);
                setRegistryUrl(response.data.registryUrl);
                setCloudCredentialId(response.data.cloudCredentialId);
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(moment(response.data.lastUpdatedOn).format("LLL"));
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
                    'registryId': values.registryId,
                    'registryUrl': values.registryUrl,
                    'cloudCredentialId': values.cloudCredentialId,
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
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Edit Container Registry</label>
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
                                <Option key="aws-ecr">AWS-ECR</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry ID:" hasFeedback>
                            {getFieldDecorator('registryId', {
                                initialValue: registryId,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Registry ID!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Registry ID" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Registry URL:" hasFeedback>
                            {getFieldDecorator('registryUrl', {
                                initialValue: registryUrl,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Registry URL!',
                                    },
                                    {
                                        max: 200,
                                        message: 'Only 200 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Registry URL" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Cloud Credential ID:" hasFeedback>
                            {getFieldDecorator('cloudCredentialId', {
                                initialValue: cloudCredentialId,
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Cloud Credential ID!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Cloud Credential ID" />)}
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