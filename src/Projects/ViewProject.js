import React, { useContext, useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tabs } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import UserContext from '../UserContext';
import ManageProjectMembers from './ManageProjectMembers';
import { useParams } from 'react-router-dom';

function ViewProject() {
    const TabPane = Tabs.TabPane;
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

    const [iconLoading, setIconLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { projectResourceId } = useParams();
    const user = useContext(UserContext);

    useEffect(() => {
        document.title = "Project Details";
        loadProject();
    }, []);

    function loadProject() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/project/${projectResourceId}`)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                setName(response.data.id.resourceId);
                setDescription(response.data.description);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Project Details</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <Tabs defaultActiveKey={"general"}>
                            <TabPane tab="General" key="general">
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
                            </TabPane>
                            <TabPane tab="Members" key="members">
                                <ManageProjectMembers />
                            </TabPane>
                            <TabPane tab="Deployments" key="deployments">

                            </TabPane>
                        </Tabs>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewProject;