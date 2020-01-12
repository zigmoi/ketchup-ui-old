import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

function ManageTenants() {
    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        document.title = "Manage Tenants";
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName',
        }, {
            title: 'Status',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (text, record) => (
                record.enabled ? <Tag color="#52c41a">Active</Tag> : <Tag color="red">Disabled</Tag>
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
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => toggleStatus(record)}>
                        <Button type="danger">{record.enabled ? 'Disable' : 'Enable'}</Button>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteTenant(record)}>
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </span>
            )
        }];

        setColumns(columns);
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/tenants`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function toggleStatus(selectedRecord) {
        setIconLoading(true);
        let tenantId = selectedRecord.id;
        let tenantStatus = !selectedRecord.enabled;
        let url = `${process.env.REACT_APP_API_BASE_URL}/v1/tenant/${tenantId}/enable/${tenantStatus}`;
        axios.put(url)
            .then((response) => {
                setIconLoading(false);
                loadAll();
                message.success('Operation completed successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function deleteTenant(selectedRecord) {
        setIconLoading(true);
        let tenantId = selectedRecord.id;
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/tenant/${tenantId}`)
            .then((response) => {
                setIconLoading(false);
                loadAll();
                message.success('Tenant deleted successfully.');
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
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Tenants</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
                <Col span={11} offset={-1}>
                    <Row type="flex" justify="end" align="middle">
                        <Button type="primary"  >
                            <Link to={"/app/create-tenant"}>Create Tenant</Link>
                        </Button>
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.id} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageTenants;
