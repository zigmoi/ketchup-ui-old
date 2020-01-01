import React, { useState } from 'react';
import { Row, Col, Spin, Card } from 'antd';
import { useHistory, useParams } from 'react-router-dom';

function DeploymentTypes() {

    document.title = "Create Deployment";

    const [iconLoading, setIconLoading] = useState(false);
    let history = useHistory();
    let { projectResourceId } = useParams();

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold' }} >Select Deployment Type</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24} >
                    <br />
                    <Row type="flex" justify="center" align="middle">
                        <Col span={6} offset={1} >
                            <Card title="Standard Spring Boot" hoverable
                                onClick={() => history.push(`/app/project/${projectResourceId}/deployment/create`)}>
                                Deployment for spring boot applications.
                                Git based CI/CD pipelines included.
                            </Card>
                        </Col>
                        <Col span={6} offset={1} >
                            <Card title="Spring Boot Mysql Vitess" hoverable>
                                Deployment for spring boot applications with Mysql as DB.
                                DB managed by vitess.
                                Git based CI/CD pipelines.
                            </Card>
                        </Col>
                        <Col span={6} offset={1} >
                            <Card title="Spring Boot RDS" hoverable>
                                Deployment for spring boot applications with RDS as DB.
                                Git based CI/CD pipelines.
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row type="flex" justify="center" align="middle">
                        <Col span={6} offset={1} >
                            <Card title="Standard React" hoverable>
                                Deployment for react applications in k8s cluster.
                                Git based CI/CD pipelines included.
                                No CDN.
                            </Card>
                        </Col>
                        <Col span={6} offset={1} >
                            <Card title="React AWS Amplify" hoverable>
                                Deployment for react applications on AWS Amplify.
                                Git based CI/CD pipelines.
                                CDN included.
                            </Card>
                        </Col>
                        <Col span={6} offset={1} >
                            <Card title="React Netlify" hoverable>
                                Deployment for react applications on Netlify.
                                Git based CI/CD pipelines.
                                CDN included.
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default DeploymentTypes;