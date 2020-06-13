import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';

function ManageK8sHostAliases() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    let { projectResourceId } = useParams();

    useEffect(() => {
        document.title = "Manage Kubernetes Host Aliases";
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
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName',
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                <Button type="primary" size="small">
                    <Link to={`/app/project/${projectResourceId}/settings/${record.settingId}/k8s-host-alias/view`}>
                        View
                    </Link>
                </Button>
                <Divider type="vertical" />
                <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); }}>
                    <Link to={`/app/project/${projectResourceId}/settings/${record.settingId}/k8s-host-alias/edit`}>
                        Edit
                    </Link>
                </Button>
                <Divider type="vertical" />
                <Popconfirm title="Confirm operation?" 
                    okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteSetting(record)}>
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/list-all-k8s-host-alias/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function deleteSetting(selectedRecord) {
        setIconLoading(true);
        let settingId = selectedRecord.settingId;
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/k8s-host-alias/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Host alias removed successfully.');
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
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} >Kubernetes Host Aliases</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
                <Col span={11} offset={-1}>
                    <Row type="flex" justify="end" align="middle">
                        <Button type="primary"  >
                            <Link to={`/app/project/${projectResourceId}/settings/k8s-host-alias/add`}>Add</Link>
                        </Button>
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.settingId} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageK8sHostAliases;