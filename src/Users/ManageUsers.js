import React, { Component } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag, PageHeader } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            columns: [],
            selectedRecord: null,
        }
    }

    componentDidMount() {
        document.title = "Manage Users";
        this.setColumns();
        this.loadAll();
    }

    setColumns = () => {
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
            title: 'Is Active',
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
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={this.toggleStatus}>
                        <Button type="danger">{record.enabled ? 'Disable' : 'Enable'}</Button>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={this.delete}>
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </span>
            )
        }];

        this.setState({ "columns": columns });
    }

    setSelectedRow = (record) => {
        console.log(record);
        this.setState({ selectedRecord: record });
    }

    reloadTabularData = () => {
        this.loadAll();
    }


    loadAll = () => {
        this.setState({ "iconLoading": true });
        axios.get('http://localhost:8097/v1/users')
            .then((response) => {
                this.setState({ "iconLoading": false });
                this.setState({ "dataSource": response.data });
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }

    delete = () => {
        this.setState({ "iconLoading": true });
        let userName = this.state.selectedRecord.userName;
        axios.delete('http://localhost:8097/v1/user/' + userName)
            .then((response) => {
                this.setState({ "iconLoading": false });
                this.loadAll();
                message.success('User deleted successfully.');
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }

    toggleStatus = () => {
        this.setState({ "iconLoading": true });
        let userName = this.state.selectedRecord.userName;
        let userStatus = !this.state.selectedRecord.enabled;
        let url = 'http://localhost:8097/v1/user/' + userName + '/enable/' + userStatus
        axios.put(url)
            .then((response) => {
                this.setState({ "iconLoading": false });
                this.loadAll();
                message.success('Operation completed successfully.');
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }

    render() {
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                    <Col span={24}>
                        <label style={{ fontWeight: 'bold' }} >Manage Users</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={this.state.iconLoading} />
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={22}>
                        <Table dataSource={this.state.dataSource}
                            pagination={{ defaultPageSize: 8 }}
                            columns={this.state.columns}
                            onRowClick={this.setSelectedRow}
                            size="middle" rowKey={record => record.id} />
                    </Col>
                </Row>
            </div>
        );
    }
}


export default ManageUsers;