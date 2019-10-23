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
function CreateGitProvider() {
    document.title = "Add Git Provider";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repoListUrl, setRepoListUrl] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function CreateGitProvider() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'settingId': "s1",
            'displayName': displayName,
            'provider': provider,
            'username': userName,
            'password': password,
            'repoListUrl': repoListUrl,
        };
        axios.post('http://localhost:8097/v1/settings/git-provider', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Git Provider added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/git-providers`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Git Provider</label>
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
                        <FormItem {...formItemLayout} label="Provider:">
                            <Input placeholder="Provider"
                                value={provider}
                                onChange={(e) => { setProvider(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="User Name:">
                            <Input placeholder="User Name"
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password:">
                            <Input.Password type="password" placeholder="Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Repository List URL:">
                            <Input placeholder="Repository List URL"
                                value={repoListUrl}
                                onChange={(e) => { setRepoListUrl(e.target.value) }} />
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={CreateGitProvider} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default CreateGitProvider;