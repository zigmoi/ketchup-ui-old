import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link, useParams, useHistory } from 'react-router-dom';

function ManageReleases() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const { projectResourceId, deploymentResourceId } = useParams();

    let history = useHistory();

    useEffect(() => {
        console.log("in effect Manage Releases");
        document.title = "Manage Releases";
        initColumns();
        loadAll();
    }, []);

    function initColumns() {
        const columns = [{
            title: 'ID',
            dataIndex: 'id.releaseResourceId',
            key: 'id.releaseResourceId',
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                record.status==='SUCCESS' ? <Tag color="#52c41a">Success</Tag>: (record.status ==='FAILED' ? <Tag color="red">Failed</Tag> : <Tag color="blue">In Progress</Tag>)
            )
        }, {
            title: 'Created On',
            dataIndex: 'createdOn',
            key: 'createdOn',
            render: (text, record) => (
                moment(record.createdOn).fromNow()
            )
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                     <Button type="primary" size="small">
                        <Link to={`/app/project/${projectResourceId}/deployment/${deploymentResourceId}/release/${record.id.releaseResourceId}/view`}>
                            View
                        </Link>
                    </Button>
                    <Divider type="vertical" />
                    <Button type="primary" size="small">
                        <Link to={`/app/project/${projectResourceId}/deployment/${deploymentResourceId}/release/${record.id.releaseResourceId}/pipeline`}>
                            Build
                        </Link>
                    </Button>
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/releases?deploymentId=${deploymentResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function viewDetails() {
        history.push(`/app/project/${projectResourceId}/deployment/select-type`);
    }

    function createDeployment() {
        setIconLoading(true);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/release?deploymentId=${deploymentResourceId}`)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                message.success('deployment started!');
                reloadTabularData();
            })
            .catch((error) => {
                setIconLoading(false);
                message.error('deployment failed!')
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Releases</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
                <Col span={11} offset={-1}>
                    <Row type="flex" justify="end" align="middle">
                        <Button type="primary" size="small" onClick={createDeployment}> Deploy</Button>
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.id.releaseResourceId} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageReleases;