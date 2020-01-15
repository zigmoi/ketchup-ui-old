import { Col, Form, Icon, Input, Row, Spin, Tag, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdditionalInfo from '../AdditionalInfo';

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


function ViewUser() {
    document.title = "View User";

    const [iconLoading, setIconLoading] = useState(false);

    const [displayName, setDisplayName] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [roles, setRoles] = useState([]);
    const [createdOn, setCreatedOn] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
    const [lastUpdatedBy, setLastUpdatedBy] = useState(null);

    let { userName } = useParams();

    useEffect(() => {
        loadDetails();
    }, [userName]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}`)
            .then((response) => {
                setIconLoading(false);
                setDisplayName(response.data.displayName);
                setEnabled(response.data.enabled);
                setEmail(response.data.email);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setRoles(response.data.roles);
                setCreatedOn(moment(response.data.createdOn).format("LLL"));
                setCreatedBy(response.data.createdBy);
                setLastUpdatedOn(moment(response.data.lastUpdatedOn).format("LLL"));
                setLastUpdatedBy(response.data.lastUpdatedBy);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    let editLink;
    editLink = (
        <Link to={`/app/user/${userName}/edit`}>
            <Tooltip title="Edit">
                <Icon type="edit" />
            </Tooltip>
        </Link>
    );

    let extraInfo = (
        <AdditionalInfo
            createdOn={createdOn}
            createdBy={createdBy}
            lastUpdatedOn={lastUpdatedOn}
            lastUpdatedBy={lastUpdatedBy} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >View User{editLink}</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="User Name:">
                            <Input readOnly value={userName} suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Display Name:">
                            <Input readOnly value={displayName} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Email:">
                            <Input readOnly value={email} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="First Name:">
                            <Input readOnly value={firstName} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Last Name:">
                            <Input readOnly value={lastName} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Roles:">
                            <Row type="flex" justify="start" align="middle">
                                <Col>
                                    {roles.length > 0 ?
                                        roles.map((role) => {
                                            return <Tag color="#fa541c">{role}</Tag>
                                        })
                                        :
                                        <Tag color="#08979c">No roles assigned.</Tag>
                                    }
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Status:">
                            <Row type="flex" justify="start" align="middle">
                                <Col>
                                    {enabled ? <Tag color="#52c41a">Active</Tag> : <Tag color="red">Disabled</Tag>}
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewUser;