import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Tag } from 'antd';
import { Skeleton, Switch, Card, Icon, Avatar} from 'antd';
import axios from 'axios';
import moment from 'moment';

function ManageKubernetesCluster() {
    const [loading, setLoading] = useState(true);

    const { Meta } = Card;

    function onChange (checked) {
        setLoading(!checked);
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Switch checked={!loading} onChange={onChange} />
            
            <Row type="flex" justify="start" align="top" style={{padding: '10px'}}>
                <Col span={6}> 
                    <Card size="small"
                        loading={loading}
                        actions={[
                            <Icon type="file-excel" key="view" />,
                            <Icon type="edit" key="edit" />,
                            <Icon type="delete" key="delete" />
                        ]}
                    >
                    <Meta title={<Tag color="blue">maven</Tag>}
                        description="This is the description" />
                        {/* <div>
                            <Icon type="file-excel" key="view" />
                            <Divider type="vertical" />
                            <Icon type="edit" key="edit" />
                            <Divider type="vertical" />
                            <Icon type="delete" key="delete" />
                        </div> */}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default ManageKubernetesCluster;