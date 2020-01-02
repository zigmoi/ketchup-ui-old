import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link, useParams, useHistory } from 'react-router-dom';
import DeploymentContext from '../DeploymentContext';

function ManageDeployments() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const { projectResourceId } = useParams();

    let history = useHistory();
    const deploymentContext = useContext(DeploymentContext);

    useEffect(() => {
        console.log("in effect Manage Deployments");
        document.title = "Manage Deployments";
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
            title: 'Service Name',
            dataIndex: 'serviceName',
            key: 'serviceName',
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" size="small"><Link to={`/app/project/${projectResourceId}/deployment/${record.id}/members`}>Members</Link></Button>
                    <Divider type="vertical" />
                    <Button type="primary" size="small"><Link to={`/app/project/${projectResourceId}/deployment/${record.id}/permissions`}>Permissions</Link></Button>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteDeployment(record)}>
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/deployments/basic-spring-boot/list`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function deleteDeployment(selectedRecord) {
        setIconLoading(true);
        console.log(selectedRecord);
        let deploymentResourceId = selectedRecord.id;
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/deployments/${deploymentResourceId}`)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Deployment deleted successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function viewDetails() {
        deploymentContext.setCurrentDeployment({ "deploymentId": "d1" });
        history.push(`/app/project/${projectResourceId}/deployment/select-type`);
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Deployments</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
                <Col span={11} offset={-1}>
                    <Row type="flex" justify="end" align="middle">
                        <Button type="primary"  >
                            <Link to={`/app/project/${projectResourceId}/deployment/select-type`}>Create Deployment</Link>
                        </Button>
                        {/* <Button type="primary" onClick={viewDetails} >
                            Test
                        </Button> */}
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

export default ManageDeployments;