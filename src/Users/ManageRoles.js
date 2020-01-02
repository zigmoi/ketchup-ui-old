import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Select } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ManageRoles() {
    const Option = Select.Option;

    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [role, setRole] = useState("");
    const { userName } = useParams();

    useEffect(() => {
        document.title = "Manage Roles";
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
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => removeRole(record)}>
                        <Button type="danger" size="small">Remove</Button>
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}/roles`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
                if (response.data.length == 0) {
                    message.info("No roles found!");
                }
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function removeRole(selectedRecord) {
        setIconLoading(true);
        let roleName = selectedRecord;
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}/role/${roleName}/remove`)
            .then((response) => {
                setIconLoading(false);
                setRole("");
                reloadTabularData();
                message.success('Role removed successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function addRole() {
        if (!role) {
            message.error("Please select a valid role!");
            return;
        }

        setIconLoading(true);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}/role/${role}/add`)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Role added successfully.');
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
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Roles</label>
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
                            <Select style={{ fontSize: 12, width: 200 }}
                                allowClear
                                size="small"
                                value={role}
                                onChange={(e) => { setRole(e) }}>
                                <Option value="ROLE_USER">USER</Option>
                                <Option value="ROLE_TENANT_ADMIN">TENANT ADMIN</Option>
                                <Option value="ROLE_USER_ADMIN">USER ADMIN</Option>
                                <Option value="ROLE_CONFIG_ADMIN">CONFIGURATION ADMIN</Option>
                                <Option value="ROLE_SUPER_ADMIN">SUPER ADMIN</Option>
                            </Select>
                        </Col>
                        <Divider type="vertical" />
                        <Col>
                            <Button type="primary"
                                size="small"
                                htmlType="button"
                                onClick={() => addRole()}>Add Role</Button>
                        </Col>
                    </Row>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageRoles;