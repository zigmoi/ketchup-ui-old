import React, { useState } from 'react';
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


function AddBuildTool(props) {
    document.title = "Add Build Tool";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);

    let history = useHistory();
    let { projectResourceId } = useParams();

    function addBuildTool(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'projectId': projectResourceId,
                    'fileName': values.fileName,
                    'fileData': btoa(values.fileData),
                    'displayName': values.displayName,
                    'provider': values.provider,
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
                    <Form onSubmit={addBuildTool} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Display Name:" hasFeedback>
                            {getFieldDecorator('displayName', {
                                initialValue: "",
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
                                initialValue: "",
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
                        <FormItem {...formItemLayout} label="File Name:" hasFeedback>
                            {getFieldDecorator('fileName', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid File Name!',
                                    },
                                    {
                                        max: 100,
                                        message: 'Only 100 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="File Name" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="File Data:" hasFeedback>
                            {getFieldDecorator('fileData', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid File Data!',
                                    },
                                    {
                                        max: 100,
                                        message: 'Only 100 characters are allowed!',
                                    },
                                ],
                            })(<Input.TextArea placeholder="File Data" autosize={{ minRows: 10, maxRows: 15 }} />)}
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" loading={iconLoading} htmlType="submit">Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

const WrappedComponent = Form.create({ name: 'add-build-tool' })(AddBuildTool);
export default WrappedComponent;