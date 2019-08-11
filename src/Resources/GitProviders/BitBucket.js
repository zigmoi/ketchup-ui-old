import React, { useContext, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';

function BitBucket() {
    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [repoListUrl, setRepoListUrl] = useState('https://api.bitbucket.org/1.0/user/repositories');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    function createGitProvider () {
        setIconLoading(true);
        var data = {
            'provider': 'bitbucket',
            'repoListUrl': repoListUrl,
            'displayName': displayName,
            'username': username,
            'password': password,
        };
        axios.post('http://localhost:8097/v1/create-git-provider', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Git provider added.', 5);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            {/* <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold' }} >Add BitBucket Details</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row> */}
            <Row type="flex" justify="center" align="middle">
                <Col span={20}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Repo List URL" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="Repo List URL"
                                value={repoListUrl}
                                disabled= {true}
                                onChange={(e) => { setRepoListUrl(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => { setDisplayName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Bitbucket Username" colon={false}>
                            <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                placeholder="Bitbucket Username"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Bitbucket Password" colon={false}>
                            <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 15 }} />}
                                type="password" placeholder="Bitbucket Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }} />
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon={'check-circle-o'}
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={createGitProvider} >Create</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default BitBucket;