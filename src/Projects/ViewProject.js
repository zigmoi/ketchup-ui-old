import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router-dom';

function ViewProject() {
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

    const [iconLoading, setIconLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [creationDate, setCreationDate] = useState(null);

    const { projectResourceId } = useParams();

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
                setCreationDate(moment(response.data.creationDate).format("LLL"));
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
                        <FormItem {...formItemLayout} label="Name:">
                            <Input value={name} readOnly />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Description:">
                            <Input value={description} readOnly />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Created On:">
                            <Input value={creationDate} readOnly />
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewProject;