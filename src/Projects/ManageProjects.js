import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import ProjectContext from '../ProjectContext';
import DeploymentContext from '../DeploymentContext';

function ManageProjects() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    let history = useHistory();
    const projectContext = useContext(ProjectContext);
    const deploymentContext = useContext(DeploymentContext);
    
    useEffect(() => {
        console.log("in effect Manage Projects");
        document.title = "Manage Projects";
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
            dataIndex: 'id.resourceId',
            key: 'id',
        }, {
            title: 'Creation Date',
            dataIndex: 'creationDate',
            key: 'creationDate',
            render: (text, record) => (
                moment(record.creationDate).format("MMM D, YYYY")
            )
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" size="small" onClick={() => viewDetails(record)}>View</Button>
                    <Divider type="vertical" />
                    <Button type="primary" size="small" onClick={() => viewDeployments(record)}>Deployments</Button>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteProject(record)}>
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
        axios.get('http://localhost:8097/v1/projects')
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function deleteProject(selectedRecord) {
        setIconLoading(true);
        console.log(selectedRecord);
        let projectName = selectedRecord.id.resourceId;
        axios.delete('http://localhost:8097/v1/project/' + projectName)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Project deleted successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function viewDetails(selectedRecord) {
        console.log("View project details selectedRecord", selectedRecord);
        let projectName = selectedRecord.id.resourceId;
        projectContext.setCurrentProject({ "projectId": projectName });
        deploymentContext.clearCurrentDeployment();
        history.push(`/app/project/${projectName}/view`);
    }

    function viewDeployments(selectedRecord) {
        console.log("View project deployments selectedRecord", selectedRecord);
        let projectName = selectedRecord.id.resourceId;
        projectContext.setCurrentProject({ "projectId": projectName });
        deploymentContext.clearCurrentDeployment();
        history.push(`/app/project/${projectName}/deployments`);
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Projects</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
                <Col span={11} offset={-1}>
                    <Row type="flex" justify="end" align="middle">
                        <Button type="primary">
                            <Link to={"/app/project/create"}>Create Project</Link>
                        </Button>
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.id.resourceId} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageProjects;