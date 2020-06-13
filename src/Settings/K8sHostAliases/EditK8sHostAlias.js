import { Button, Col, Divider, Form, Input, message, Row, Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AdditionalInfo from '../../AdditionalInfo';

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

function EditK8sHostAlias(props) {
    document.title = "Edit Kubernetes Host Alias";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [externalServiceIp, setExternalServiceIp] = useState("");
    const [externalServiceDns, setExternalServiceDns] = useState("");
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let history = useHistory();
    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        initColumns();
        loadDetails();
    }, [projectResourceId, settingId]);

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


    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/k8s-host-alias/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                // setDataSource(response.data.hostnameIpMapping);
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function addRecord() {
        let r = {
            "id": externalServiceDns + ":" + externalServiceIp,
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


    function updateSetting(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);

                var data = {
                    'projectId': projectResourceId,
                    'displayName': values.displayName,
                    'hostnameIpMapping': dataSource

                };
                axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/k8s-host-alias/${projectResourceId}/${settingId}`, data)
                    .then((response) => {
                        setIconLoading(false);
                        message.success('Host alias updated successfully.', 5);
                        history.push(`/app/project/${projectResourceId}/settings/k8s-host-aliases`);
                    })
                    .catch((error) => {
                        setIconLoading(false);
                    });
            }
        });
    }

    let extraInfo = (
        <AdditionalInfo lastUpdatedBy={lastUpdatedBy} lastUpdatedOn={lastUpdatedOn} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Kubernetes Host Alias</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={updateSetting} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input readOnly value={settingId} suffix={extraInfo} />
                        </FormItem>
                        {/* <FormItem {...formItemLayout} label="Project ID:">
                            <Input readOnly value={projectResourceId} />
                        </FormItem> */}
                        <FormItem {...formItemLayout} label="Display Name:" hasFeedback>
                            {getFieldDecorator('displayName', {
                                initialValue: displayName,
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
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" loading={iconLoading} htmlType="submit" >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

const WrappedComponent = Form.create({ name: 'edit-hostname' })(EditK8sHostAlias);
export default WrappedComponent;