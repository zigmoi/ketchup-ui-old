import React, { useContext, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import UserContext from '../UserContext';
import {useHistory} from 'react-router-dom';

function CreateProject(props) {
    console.log(props);
    const [iconLoading, setIconLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    let history = useHistory();
    const user = useContext(UserContext);

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

    document.title = "Create Project";

    function CreateProject() {
        setIconLoading(true);
        var data = {
            'projectResourceId': name,
            'description': description,
            'members': [],
        };
        axios.post('http://localhost:8097/v1/project/', data)
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

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Create New Project</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Name:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Name"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Description:">
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                placeholder=" Description"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value) }} />
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={CreateProject} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default CreateProject;