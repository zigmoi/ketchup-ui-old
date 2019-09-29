import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Form, Input, Icon } from 'antd';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function ManageProjectMembers() {
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
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [memberName, setMemberName] = useState("");
    const { projectResourceId } = useParams();

    useEffect(() => {
        document.title = "Manage Project Members";
        initColumns();
        loadAll();
    }, []);

    function initColumns() {
        const columns = [{
            title: '#',
            key: '#',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        }, {
            title: 'Name',
            dataIndex: '',
            key: 'id',
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary">Permissions</Button>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => removeProjectMember(record)}>
                        <Button type="danger">Remove</Button>
                    </Popconfirm>
                </span>
            )
        }];

        setColumns(columns);
    }

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/project/${projectResourceId}/members`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
                if (response.data.length == 0) {
                    message.info("No members found!");
                }
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function removeProjectMember(selectedRecord) {
        setIconLoading(true);
        let memberName = selectedRecord;
        axios.post(`http://localhost:8097/v1/project/${projectResourceId}/member/${memberName}/remove`)
            .then((response) => {
                setIconLoading(false);
                setMemberName("");
                reloadTabularData();
                message.success('Member removed successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function addMember() {
        setIconLoading(true);
        axios.post(`http://localhost:8097/v1/project/${projectResourceId}/member/${memberName}/add`)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Member added successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Project Members</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
            </Row>
            <br />
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Row type="flex" justify="start" align="middle">
                        <Col>
                            <Input style={{ fontSize: 12 }}
                                placeholder=" username"
                                size="small"
                                value={memberName}
                                onChange={(e) => { setMemberName(e.target.value) }} />
                        </Col>
                        <Divider type="vertical" />
                        <Col>
                            <Button type="primary"
                                size="small"
                                htmlType="button"
                                onClick={() => addMember()}>Add Member</Button>
                        </Col>
                    </Row>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.id} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageProjectMembers;