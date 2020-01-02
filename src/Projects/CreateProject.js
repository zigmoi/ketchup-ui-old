import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

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

function CreateProject(props) {
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);
    let history = useHistory();

    document.title = "Create Project";

    function submitRequest(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                var data = {
                    'projectResourceId': values.name,
                    'description': values.description,
                    'members': [],
                };
                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/project/`, data)
                    .then((response) => {
                        console.log(response);
                        setIconLoading(false);
                        message.success('Project created successfully.', 5);
                        history.push("/app/projects");
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
                    <label style={{ fontWeight: 'bold' }} >Create New Project</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={submitRequest} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Name:" hasFeedback>
                            {getFieldDecorator('name', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please provide valid Project Name!',
                                    },
                                    {
                                        max: 50,
                                        message: 'Only 50 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="User Name" autoFocus />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Description:" hasFeedback>
                            {getFieldDecorator('description', {
                                initialValue: "",
                                rules: [
                                    {
                                        max: 100,
                                        message: 'Only 100 characters are allowed!',
                                    },
                                ],
                            })(<Input placeholder="Description" />)}
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

const WrappedComponent = Form.create({ name: 'create-project' })(CreateProject);
export default WrappedComponent;