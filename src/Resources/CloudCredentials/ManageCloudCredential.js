import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';

function ManageCloudCredential() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        document.title = "Manage Cloud Credentials";
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
            title: 'Provider',
            dataIndex: 'provider',
            key: 'provider',
        }, {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName',
        }, {
            title: 'Access Id',
            dataIndex: 'accessId',
            key: 'accessId',
        }, {
            title: 'Secret Key',
            dataIndex: 'secretKey',
            key: 'secretKey',
        }, {
            title: 'Creation Date',
            dataIndex: 'createdOn',
            key: 'createdOn',
            render: (text, record) => (
                moment(record.createdOn).format("LLL")
            )
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteCloudCredential(record)}>
                        <Button type="danger">Delete</Button>
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
        axios.get('http://localhost:8097/v1/tenant-cloud-credentials')
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function deleteCloudCredential(selectedRecord) {
        setIconLoading(true);
        let id = selectedRecord.id;
        axios.delete('http://localhost:8097/v1/tenant-cloud-credential/' + id)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Cloud credentials deleted.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{paddingTop: '10px'}}>
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

export default ManageCloudCredential;