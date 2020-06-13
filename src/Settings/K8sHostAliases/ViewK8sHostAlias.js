import { Col, Form, Icon, Input, Row, Spin, Table, Tooltip } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdditionalInfo from '../../AdditionalInfo';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};


function ViewK8sHostAlias() {
    document.title = "Kubernetes Host Alias";

    const [iconLoading, setIconLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [lastUpdatedBy, setLastUpdatedBy] = useState("");
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");

    let { projectResourceId, settingId } = useParams();

    useEffect(() => {
        setColumns();
        loadDetails();
    }, [projectResourceId, settingId]);

    function initColumns() {
        const columns = [{
            title: 'Hostname',
            dataIndex: 'hostname',
            key: 'hostname',
        }, {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        }];

        setColumns(columns);
    }


    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/k8s-host-alias/${projectResourceId}/${settingId}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                // setDataSource(response.data.hostnameIpMapping);
                setLastUpdatedBy(response.data.lastUpdatedBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let editLink = (
        <Link to={`/app/project/${projectResourceId}/settings/${settingId}/k8s-host-alias/edit`}>
            <Tooltip title="Edit">
                <Icon type="edit" />
            </Tooltip>
        </Link>
    );

    let extraInfo = (
        <AdditionalInfo lastUpdatedBy={lastUpdatedBy} lastUpdatedOn={lastUpdatedOn} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Kubernetes Host Alias{editLink}</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="ID:">
                            <Input readOnly value={settingId} suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input readOnly value={displayName} />
                        </FormItem>
                        <Table dataSource={dataSource}
                            pagination={{ defaultPageSize: 4 }}
                            columns={columns}
                            size="middle" rowKey={record => record.id} />
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewK8sHostAlias;