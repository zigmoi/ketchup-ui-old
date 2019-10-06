import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

function ManageUsers() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Users");
        document.title = "Manage Users";
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
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        }, {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName',
        }, {
            title: 'Status',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (text, record) => (
                record.enabled ? <Tag color="blue">Active</Tag> : <Tag color="red">Disabled</Tag>
            )
        }, {
            title: 'Creation Date',
            dataIndex: 'creationDate',
            key: 'creationDate',
            render: (text, record) => (
                moment(record.creationDate).format("LLL")
            )
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" size="small"><Link to={`/app/user/${record.userName}/roles`}>Roles</Link></Button>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => toggleStatus(record)}>
                        <Button type="danger" size="small">{record.enabled ? 'Disable' : 'Enable'}</Button>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteUser(record)}>
                        <Button type="danger" size="small">Delete</Button>
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
        axios.get('http://localhost:8097/v1/users')
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function deleteUser(selectedRecord) {
        setIconLoading(true);
        let userName = selectedRecord.userName;
        axios.delete('http://localhost:8097/v1/user/' + userName)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('User deleted successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function toggleStatus(selectedRecord) {
        setIconLoading(true);
        let userName = selectedRecord.userName;
        let userStatus = !selectedRecord.enabled;
        let url = 'http://localhost:8097/v1/user/' + userName + '/enable/' + userStatus
        axios.put(url)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Operation completed successfully.');
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
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Users</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
                <Col span={11} offset={-1}>
                    <Row type="flex" justify="end" align="middle">
                        <Button type="primary"  >
                            <Link to={"/app/create-user"}>Create User</Link>
                        </Button>
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.userName} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageUsers;