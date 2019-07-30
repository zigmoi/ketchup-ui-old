import React, { Component } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag, PageHeader } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

class ManageTenants extends Component {
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
        document.title = "Manage Tenants";
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName',
        }, {
            title: 'Is Active',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (text,record) => (
                record.enabled? <Tag color="blue">Active</Tag> : <Tag color="red">Disabled</Tag>
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
        axios.get('http://localhost:8097/tenants')
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                this.setState({ "dataSource": response.data });
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }

    delete = () => {
        this.setState({ "iconLoading": true });

        let tenantId = this.state.selectedRecord.id;
        axios.delete('http://localhost:8097/tenant' + tenantId)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                this.loadAll();
                message.success('Tenant deleted successfully.');
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }

    render() {
        return (
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                
                <Row type="flex" justify="start" align="middle">
                    <Col>
                    <PageHeader onBack={() => window.history.back()} title="Manage Tenants" subTitle="" />
                       
                        
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={22}>
                        <Spin spinning={this.state.iconLoading} />
                        <br />
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


export default ManageTenants;
