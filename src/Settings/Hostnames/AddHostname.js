import React, { useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

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
function AddHostname() {
    document.title = "Add Hostname";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [externalServiceIp, setExternalServiceIp] = useState("");
    const [externalServiceDns, setExternalServiceDns] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function AddHostname() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'displayName': displayName,
            'hostnameIpMapping': {
                [externalServiceDns]: externalServiceIp
            }
        };
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/hostname-ip-mapping`, data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Hostname added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/hostnames`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Hostname</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                    <FormItem {...formItemLayout} label="Display Name:">
                            <Input autoFocus
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="External Service DNS:">
                            <Input autoFocus
                                placeholder="External Service DNS"
                                value={externalServiceDns}
                                onChange={(e) => { setExternalServiceDns(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="External Service IP:">
                            <Input autoFocus
                                placeholder="External Service IP"
                                value={externalServiceIp}
                                onChange={(e) => { setExternalServiceIp(e.target.value) }} />
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={AddHostname} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AddHostname;