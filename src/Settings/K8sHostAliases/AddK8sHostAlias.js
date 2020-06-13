import { Button, Col, Divider, Form, Input, message, Row, Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
function AddK8sHostAlias() {
    document.title = "Add Kubernetes Host Alias";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [externalServiceIp, setExternalServiceIp] = useState("");
    const [externalServiceDns, setExternalServiceDns] = useState("");
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        initColumns();
    }, [dataSource]);

    let history = useHistory();
    let { projectResourceId } = useParams();

    function initColumns() {
        const columns = [{
            title: 'Hostname',
            dataIndex: 'hostname',
            key: 'hostname',
        }, {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="danger" size="small" onClick={() => removeRecord(record)} >Remove</Button>
                </span>
            )
        }];

        setColumns(columns);
    }

    function addRecord() {
        let r = { "id": externalServiceDns + ":" + externalServiceIp, 
                  "hostname": externalServiceDns, 
                  "ip": externalServiceIp 
                };

        let isDuplicate = false;
        dataSource.forEach(element => {
            if (element.id === r.id) {
                isDuplicate = true;
            }
        });
        console.log(isDuplicate);
        if (isDuplicate) {
            return;
        }
        setDataSource([...dataSource, r]);
    }

    function removeRecord(selectedRecord) {
        const filteredRecords = dataSource.filter(record => record.id !== selectedRecord.id);
        setDataSource(filteredRecords);
    }



    function addHostAlias() {
        setIconLoading(true);

        var data = {
            'projectId': projectResourceId,
            'displayName': displayName,
            'hostnameIpMapping': dataSource
        };
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/k8s-host-alias`, data)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('Host alias added successfully.', 5);
                history.push(`/app/project/${projectResourceId}/settings/k8s-host-aliases`);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }



    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Add Kubernetes Host Alias</label>
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
                        <Row type="flex" justify="center" align="middle">
                            <Col span={24}>
                                <Row type="flex" justify="start" align="middle">
                                    <Col span={15}>
                                        <Input placeholder="Hostname"
                                            value={externalServiceDns}
                                            onChange={(e) => { setExternalServiceDns(e.target.value) }} />
                                    </Col>
                                    <Divider type="vertical" />
                                    <Col span={6}>
                                        <Input placeholder="IP"
                                            value={externalServiceIp}
                                            onChange={(e) => { setExternalServiceIp(e.target.value) }} />
                                    </Col>
                                    <Col span={2}>
                                        <Button type="primary"
                                            size="small"
                                            htmlType="button"
                                            onClick={() => addRecord()}>Add</Button>
                                    </Col>
                                </Row>
                                <Table dataSource={dataSource}
                                    pagination={{ defaultPageSize: 4 }}
                                    columns={columns}
                                    size="middle" rowKey={record => record.id} />
                            </Col>
                        </Row>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary"
                                        loading={iconLoading}
                                        htmlType="submit"
                                        onClick={addHostAlias} >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AddK8sHostAlias;