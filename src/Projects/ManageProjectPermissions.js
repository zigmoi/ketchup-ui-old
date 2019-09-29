import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Form, Input, Icon, Tag } from 'antd';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function ManageProjectPermissions() {
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
    const [userName, setUserName] = useState("");
    const [projectResourceIdentifier, setProjectResourceIdentifier] = useState("");
    const [selectedPermissions, setselectedPermissions] = useState([]);
    const { projectResourceId } = useParams();

    useEffect(() => {
        document.title = "Manage Project Permissions";
        setProjectResourceIdentifier(projectResourceId);
        initColumns();
    }, []);

    function initColumns() {
        const columns = [{
            title: '#',
            key: '#',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        }, {
            title: 'Permission',
            dataIndex: 'permission.permissionId',
            key: 'id',
        }, {
            title: 'Description',
            dataIndex: 'permission.permissionDescription',
            key: 'description',
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                record.status ? <Tag color="blue">ALLOWED</Tag> : <Tag color="red">NOT ALLOWED</Tag>
            )
        }];
        setColumns(columns);
    }

    function loadPermissions() {
        setIconLoading(true);
        axios.get(`http://localhost:8097/v1/project/${projectResourceId}/user/${userName}/permissions`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function assignSelectedPermissions() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }
        if (projectResourceIdentifier === "") {
            message.error("Please provide a valid project ID!");
            return;
        }
        if ((selectedPermissions.indexOf("create-project") > -1 || selectedPermissions.indexOf("assign-create-project") > -1) 
                && projectResourceIdentifier != "*") {
            message.error("create-project and assign-create-project permissions can be assigned for ALL projects and not for specific project!");
            return;
        }

        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: projectResourceIdentifier,
            permissions: selectedPermissions
        };
        axios.put(`http://localhost:8097/v1/project/assign/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission assigned successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function revokeSelectedPermissions() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }
        if (projectResourceIdentifier === "") {
            message.error("Please provide a valid project ID!");
            return;
        }
        if ((selectedPermissions.indexOf("create-project") > -1 || selectedPermissions.indexOf("assign-create-project") > -1) 
                && projectResourceIdentifier != "*") {
            message.error("create-project and assign-create-project permissions can be revoked for ALL projects and not for specific project!");
            return;
        }
        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: projectResourceIdentifier,
            permissions: selectedPermissions
        };
        axios.put(`http://localhost:8097/v1/project/revoke/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission revoked successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function assignSelectedPermissionsOnAllProjects() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }

        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: "*",
            permissions: selectedPermissions
        };
        axios.put(`http://localhost:8097/v1/project/assign/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission assigned successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function revokeSelectedPermissionsOnAllProjects() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }

        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: "*",
            permissions: selectedPermissions
        };
        axios.put(`http://localhost:8097/v1/project/revoke/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission revoked successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function setMultiSelectedRows(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setselectedPermissions(selectedRowKeys);
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Project Permissions</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Form style={{ backgroundColor: 'white' }}>
                        <Row type="flex" justify="start" align="middle">
                            <Col>
                                    <Input style={{ fontSize: 12 }}
                                        placeholder=" projectId"
                                        size="small"
                                        value={projectResourceIdentifier}
                                        onChange={(e) => { setProjectResourceIdentifier(e.target.value) }} />
                            </Col>
                            <Divider type="vertical" />
                            <Col>
                                    <Input style={{ fontSize: 12 }}
                                        placeholder=" username"
                                        size="small"
                                        value={userName}
                                        onChange={(e) => { setUserName(e.target.value) }} />
                            </Col>
                            <Divider type="vertical" />
                            <Col>
                                    <Button type="primary"
                                        size="small" 
                                        htmlType="button" 
                                        onClick={() => loadPermissions()}>Load Permissions</Button>
                            </Col>
                        </Row>
                        <br />
                        <Row type="flex" justify="start" align="middle">
                            
                                <Button size="small" type="primary" htmlType="button" onClick={() => assignSelectedPermissions()}>Assign Permissions</Button>
                                <Divider type="vertical" />
                                <Button size="small" type="primary" htmlType="button" onClick={() => revokeSelectedPermissions()}>Revoke Permissions</Button>
                                <Divider type="vertical" />
                                <Button size="small" type="danger" htmlType="button" onClick={() => assignSelectedPermissionsOnAllProjects()}>Assign Permissions on ALL Projects</Button>
                                <Divider type="vertical" />
                                <Button size="small" type="danger" htmlType="button" onClick={() => revokeSelectedPermissionsOnAllProjects()}>Revoke Permissions on ALL Projects</Button>
                             
                        </Row>
                    </Form>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 10 }}
                        columns={columns}
                        rowSelection={{ onChange: setMultiSelectedRows }}
                        size="small" rowKey={record => record.permission.permissionId} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageProjectPermissions;