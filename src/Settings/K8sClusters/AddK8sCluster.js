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
function AddK8sCluster() {
    document.title = "Add Kubernetes Cluster";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [provider, setProvider] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileData, setFileData] = useState("");

    let history = useHistory();
    let { projectResourceId } = useParams();

    function AddK8sCluster() {
        setIconLoading(true);
        var data = {
            'projectId': projectResourceId,
            'fileName': fileName,
            'fileData': btoa(fileData),
            'displayName': displayName,
            'provider': provider,
        };
        axios.post('http://localhost:8097/v1/settings/kubernetes-cluster', data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Kubernetes cluster added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/kubernetes-clusters`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Kubernetes Cluster</label>
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
                        <FormItem {...formItemLayout} label="File Name:">
                            <Input placeholder="File Name"
                                value={fileName}
                                onChange={(e) => { setFileName(e.target.value) }} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="File Data">
                            <Input.TextArea placeholder="File Data"
                                autosize={{minRows: 10, maxRows: 15}}
                                value={fileData}
                                onChange={(e) => { setFileData(e.target.value) }} />
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={AddK8sCluster} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AddK8sCluster;