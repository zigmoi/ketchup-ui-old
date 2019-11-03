import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Icon } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import ProjectContext from '../ProjectContext';
import DeploymentContext from '../DeploymentContext';

function ListProjects() {
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    let history = useHistory();
    const projectContext = useContext(ProjectContext);
    const deploymentContext = useContext(DeploymentContext);

    useEffect(() => {
        console.log("in effect List Projects");
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
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" size="small" onClick={() => viewDetails(record)}>Open</Button>
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

    function viewDetails(selectedRecord) {
        console.log("View project details selectedRecord", selectedRecord);
        let projectName = selectedRecord.id.resourceId;
        projectContext.setCurrentProject({ "projectId": projectName });
        deploymentContext.clearCurrentDeployment();
        history.push(`/app/project/${projectName}/view`);
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', minWidth: '300px' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={24}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 14 }} > Projects</label>
                        <span>&nbsp;&nbsp;</span>
                        {iconLoading? 
                            <Spin spinning={iconLoading} />
                            :
                            <Icon type="redo" onClick={reloadTabularData} />
                        }
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record.id.resourceId} />
                </Col>
            </Row>
        </div>

    );
}

export default ListProjects;