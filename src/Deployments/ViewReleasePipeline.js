import { Col, Form, Icon, Input, Row, Spin, Tooltip, Tag, Button, Divider, message, Tabs } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import moment from 'moment';
import { LazyLog, ScrollFollow } from 'react-lazylog';



function ViewReleasePipeline() {
    const { projectResourceId, deploymentResourceId, releaseResourceId } = useParams();
    const userContext = useContext(UserContext);

    const { TabPane } = Tabs;
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
    const logViewerHeight = 350;

    const [iconLoading, setIconLoading] = useState(false);
    const [statusJson, setStatusJson] = useState("");

    const [currentStep, setCurrentStep] = useState("");
    const [fetchImageConfigStatus, setFetchImageConfigStatus] = useState("unknown");
    const [fetchSourceCodeStatus, setFetchSourceCodeStatus] = useState("unknown");
    const [buildPushImageStatus, setBuildPushImageStatus] = useState("unknown");
    const [fetchK8sConfigStatus, setFetchK8sConfigStatus] = useState("unknown");
    const [fetchHelmChartStatus, setFetchHelmChartStatus] = useState("unknown");
    const [deployInClusterStatus, setDeployInClusterStatus] = useState("unknown");

    const [fetchImageConfigLogsUrl, setFetchImageConfigLogsUrl] = useState("");
    const [fetchSourceCodeLogsUrl, setFetchSourceCodeLogsUrl] = useState("");
    const [buildPushImageLogsUrl, setBuildPushImageLogsUrl] = useState("");
    const [fetchK8sConfigLogsUrl, setFetchK8sConfigLogsUrl] = useState("");
    const [fetchHelmChartLogsUrl, setFetchHelmChartLogsUrl] = useState("");
    const [deployInClusterLogsUrl, setDeployInClusterLogsUrl] = useState("");

    let statusSource;
    useEffect(() => {
        document.title = "Build Pipeline Details";
    }, []);


    useEffect(() => {
        let access_token = userContext.currentUser ? userContext.currentUser.accessToken : "";
        if(access_token===""){
            return;
        }
        statusSource = new EventSource(`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/status/stream/sse?releaseId=${releaseResourceId}&access_token=${access_token}`);
        statusSource.addEventListener('data', function (e) {
            streamPipelineStatus(e);
        }, false);

        statusSource.addEventListener('close', function (e) {
            console.log("closing.");
            this.close();
            console.log("closed.");
        }, false);

        statusSource.addEventListener('error', function (e) {
            console.log("error, closed.");
        }, false);

        return () => {
            console.log("clearing status stream.")
            statusSource.close();
        }
    }, [releaseResourceId, userContext.currentUser]);


    function streamPipelineLogs(taskName, stepName, currentStepKey) {
        let access_token = userContext.currentUser ? userContext.currentUser.accessToken : "";
        const logsApiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/logs/stream/direct?releaseId=${releaseResourceId}&podName=${taskName}&containerName=${stepName}&access_token=${access_token}`;
        if (currentStepKey === "1") {
            setFetchSourceCodeLogsUrl(logsApiUrl);
        } else if (currentStepKey === "2") {
            setFetchImageConfigLogsUrl(logsApiUrl);
        } else if (currentStepKey === "3") {
            setBuildPushImageLogsUrl(logsApiUrl);
        } else if (currentStepKey === "4") {
            setFetchK8sConfigLogsUrl(logsApiUrl);
        } else if (currentStepKey === "5") {
            setFetchHelmChartLogsUrl(logsApiUrl);
        } else if (currentStepKey === "6") {
            setDeployInClusterLogsUrl(logsApiUrl);
        } else {
            message.error('Invalid Step.');
        }

        // let logSource = new EventSource(`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/logs/stream/sse?releaseId=${releaseResourceId}&podName=${taskName}&containerName=${stepName}&access_token=${access_token}`);
        // logSource.currentStepKey = currentStepKey;
        // logSource.addEventListener('data', function (e) {
        //     console.log(e);
        //     let currentStepKey = e.target.currentStepKey;
        //     console.log("test:" + currentStepKey);
        //     if (currentStepKey === "1") {
        //         setFetchSourceCodeLogsUrl(prevState => prevState + e.data);
        //     } else if (currentStepKey === "2") {
        //         setFetchImageConfigLogsUrl(prevState => prevState + e.data);
        //     } else if (currentStepKey === "3") {
        //         let logJson = JSON.parse(e.data);
        //         let formattedLog = logJson.level + " " + logJson.ts + ": " + logJson.msg + "\n";
        //         setBuildPushImageLogsUrl(prevState => prevState + formattedLog);
        //     } else if (currentStepKey === "4") {
        //         setFetchK8sConfigLogsUrl(prevState => prevState + e.data);
        //     } else if (currentStepKey === "5") {
        //         setFetchHelmChartLogsUrl(prevState => prevState + e.data);
        //     } else if (currentStepKey === "6") {
        //         setDeployInClusterLogsUrl(prevState => prevState + e.data);
        //     } else {
        //         message.error('Invalid Step.');
        //     }
        // }, false);

        // logSource.addEventListener('close', function (e) {
        //     console.log("closing.");
        //     this.close();
        //     console.log("closed.");
        // }, false);

        // logSource.addEventListener('error', function (e) {
        //     console.log("error, closed.");
        // }, false);
    }

    function streamPipelineStatus(event) {
        console.log(event);
        setStatusJson(JSON.parse(event.data));
        let parsedStatusJson = JSON.parse(event.data);
        console.log(parsedStatusJson);
        let buildImageTask = parsedStatusJson.tasks.filter(task => task.baseName === "build-image")[0];
        if (buildImageTask) {
            let step1Status = buildImageTask.steps.filter(step => step.order === 1)[0].reason;
            setFetchSourceCodeStatus(step1Status);
            let step2Status = buildImageTask.steps.filter(step => step.order === 2)[0].reason;
            setFetchImageConfigStatus(step2Status);
            let step3Status = buildImageTask.steps.filter(step => step.order === 3)[0].reason;
            setBuildPushImageStatus(step3Status);
        }

        let deployChartTask = parsedStatusJson.tasks.filter(task => task.baseName === "deploy-chart-in-cluster")[0];
        if (deployChartTask) {
            let step4Status = deployChartTask.steps.filter(step => step.order === 1)[0].reason;
            setFetchK8sConfigStatus(step4Status);
            let step5Status = deployChartTask.steps.filter(step => step.order === 2)[0].reason;
            setFetchHelmChartStatus(step5Status);
            let step6Status = deployChartTask.steps.filter(step => step.order === 3)[0].reason;
            setDeployInClusterStatus(step6Status);
        }


        if (parsedStatusJson.reason && (parsedStatusJson.reason === 'Succeeded' || parsedStatusJson.reason === 'Failed')) {
            console.log('closing status source.');
            statusSource.close();
        }
    }

    function onChangeStep(current) {
        console.log('on step change:', current);
        if (current !== "") {
            setCurrentStep(current);
        }
    }

    function getLogs(currentTabKey) {
        console.log('on step inner tab change:', currentTabKey);
        if (currentTabKey !== "logs") {
            return;
        }
        console.log(statusJson);
        if (currentStep === "1") {
            let buildImageTask = statusJson.tasks.filter(task => task.baseName === "build-image")[0];
            let podName = buildImageTask.podName;
            let containerName = buildImageTask.steps.filter(step => step.order === 1)[0].containerName;
            if (fetchSourceCodeLogsUrl === "") {
                streamPipelineLogs(podName, containerName, "1");
            }
        } else if (currentStep === "2") {
            let buildImageTask = statusJson.tasks.filter(task => task.baseName === "build-image")[0];
            let podName = buildImageTask.podName;
            let containerName = buildImageTask.steps.filter(step => step.order === 2)[0].containerName;
            if (fetchImageConfigLogsUrl === "") {
                streamPipelineLogs(podName, containerName, "2");
            }
        } else if (currentStep === "3") {
            let buildImageTask = statusJson.tasks.filter(task => task.baseName === "build-image")[0];
            let podName = buildImageTask.podName;
            let containerName = buildImageTask.steps.filter(step => step.order === 3)[0].containerName;
            if (buildPushImageLogsUrl === "") {
                streamPipelineLogs(podName, containerName, "3");
            }
        } else if (currentStep === "4") {
            let deployChartTask = statusJson.tasks.filter(task => task.baseName === "deploy-chart-in-cluster")[0];
            let podName = deployChartTask.podName;
            let containerName = deployChartTask.steps.filter(step => step.order === 1)[0].containerName;
            if (fetchK8sConfigLogsUrl === "") {
                streamPipelineLogs(podName, containerName, "4");
            }
        } else if (currentStep === "5") {
            let deployChartTask = statusJson.tasks.filter(task => task.baseName === "deploy-chart-in-cluster")[0];
            let podName = deployChartTask.podName;
            let containerName = deployChartTask.steps.filter(step => step.order === 2)[0].containerName;
            if (fetchHelmChartLogsUrl === "") {
                streamPipelineLogs(podName, containerName, "5");
            }
        } else if (currentStep === "6") {
            let deployChartTask = statusJson.tasks.filter(task => task.baseName === "deploy-chart-in-cluster")[0];
            let podName = deployChartTask.podName;
            let containerName = deployChartTask.steps.filter(step => step.order === 3)[0].containerName;
            if (deployInClusterLogsUrl === "") {
                streamPipelineLogs(podName, containerName, "6");
            }
        } else {
            message.error('Invalid Step.');
        }
    };

    let pipelineStatusView;
    if (statusJson && statusJson.status && statusJson.status === "True") {
        pipelineStatusView = (<Tag color="#52c41a">Success</Tag>);
    } else if (statusJson && statusJson.status && statusJson.status === "Unknown" && statusJson.reason && statusJson.reason === "Running") {
        pipelineStatusView = (<Spin spinning> In Progress</Spin>);
    } else if (statusJson && statusJson.status && statusJson.status === "False") {
        pipelineStatusView = (<Tag color="red">Failed</Tag>);
    } else {
        pipelineStatusView = (<Tag color="#595959">UnKnown</Tag>);
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Build Pipeline Details</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Release ID:">
                            <Input value={releaseResourceId} readOnly />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Status:">
                            <Col>
                                <Row>
                                    <Col span={4} align="left" style={{ fontWeight: "bold" }}>
                                        {pipelineStatusView}
                                    </Col>
                                    <Col span={2}>
                                        <label>Start: </label>
                                    </Col>
                                    <Col span={8} align="left" style={{ fontWeight: "bold" }}>
                                        {statusJson && statusJson.startTime ? moment(statusJson.startTime).format("LL LTS") : "-"}
                                    </Col>
                                    <Col span={2}>
                                        <label>End: </label>
                                    </Col>
                                    <Col span={8} align="left" style={{ fontWeight: "bold" }}>
                                        {statusJson && statusJson.completionTime ? moment(statusJson.completionTime).format("LL LTS") : "-"}
                                    </Col>
                                </Row>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Reason:">
                            {statusJson && statusJson.reason && statusJson.message ? <Input value={statusJson.reason + ", " + statusJson.message} readOnly /> : ""}
                        </FormItem>
                        <Tabs tabPosition="left" activeKey={currentStep} onChange={onChangeStep}>
                            <TabPane tab="1. Fetch Source Code" key="1">
                                <Tabs onChange={getLogs}>
                                    <TabPane tab="Status" key="status">
                                        <FormItem {...formItemLayout} label="Task Name:">
                                            <Input value="Build" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Step Name:">
                                            <Input value="Fetch Source Code" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Start Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Completion Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Status:">
                                            <Tag color="#52c41a">{fetchSourceCodeStatus}</Tag>
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Reason:">
                                            <Input value="" readOnly />
                                        </FormItem>
                                    </TabPane>
                                    <TabPane tab="Logs" key="logs">
                                        <Col span={23}>
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        url={fetchSourceCodeLogsUrl}
                                                        height={logViewerHeight}
                                                        // width={logViewerWidth}
                                                        stream
                                                        follow={follow}
                                                        onScroll={onScroll}
                                                        enableSearch />
                                                )}
                                            />
                                        </Col>
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                            <TabPane tab="2. Fetch Image Config" key="2">
                                <Tabs onChange={getLogs}>
                                    <TabPane tab="Status" key="status">
                                        <FormItem {...formItemLayout} label="Task Name:">
                                            <Input value="Build" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Step Name:">
                                            <Input value="Fetch Image Config" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Start Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Completion Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Status:">
                                            <Tag color="#52c41a">{fetchImageConfigStatus}</Tag>
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Reason:">
                                            <Input value="" readOnly />
                                        </FormItem>
                                    </TabPane>
                                    <TabPane tab="Logs" key="logs">
                                        <Col span={23}>
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        url={fetchImageConfigLogsUrl}
                                                        height={logViewerHeight}
                                                        // width={logViewerWidth}
                                                        stream
                                                        follow={follow}
                                                        onScroll={onScroll}
                                                        enableSearch />
                                                )}
                                            />
                                        </Col>
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                            <TabPane tab="3. Build & Push Image" key="3">
                                <Tabs onChange={getLogs}>
                                    <TabPane tab="Status" key="status">
                                        <FormItem {...formItemLayout} label="Task Name:">
                                            <Input value="Build" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Step Name:">
                                            <Input value="Build & Push Image" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Start Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Completion Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Status:">
                                            <Tag color="#52c41a">{buildPushImageStatus}</Tag>
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Reason:">
                                            <Input value="" readOnly />
                                        </FormItem>
                                    </TabPane>
                                    <TabPane tab="Logs" key="logs">
                                        <Col span={23}>
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        url={buildPushImageLogsUrl}
                                                        height={logViewerHeight}
                                                        // width={logViewerWidth}
                                                        stream
                                                        follow={follow}
                                                        onScroll={onScroll}
                                                        enableSearch />
                                                )}
                                            />
                                        </Col>
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                            <TabPane tab="4. Fetch K8s Config" key="4">
                                <Tabs onChange={getLogs}>
                                    <TabPane tab="Status" key="status">
                                        <FormItem {...formItemLayout} label="Task Name:">
                                            <Input value="Deploy" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Step Name:">
                                            <Input value="Fetch K8s Config" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Start Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Completion Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Status:">
                                            <Tag color="#52c41a">{fetchK8sConfigStatus}</Tag>
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Reason:">
                                            <Input value="" readOnly />
                                        </FormItem>
                                    </TabPane>
                                    <TabPane tab="Logs" key="logs">
                                        <Col span={23}>
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        url={fetchK8sConfigLogsUrl}
                                                        height={logViewerHeight}
                                                        // width={logViewerWidth}
                                                        stream
                                                        follow={follow}
                                                        onScroll={onScroll}
                                                        enableSearch />
                                                )}
                                            />
                                        </Col>
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                            <TabPane tab="5. Fetch Helm Chart" key="5">
                                <Tabs onChange={getLogs}>
                                    <TabPane tab="Status" key="status">
                                        <FormItem {...formItemLayout} label="Task Name:">
                                            <Input value="Deploy" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Step Name:">
                                            <Input value="Fetch Helm Chart" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Start Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Completion Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Status:">
                                            <Tag color="#52c41a">{fetchHelmChartStatus}</Tag>
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Reason:">
                                            <Input value="" readOnly />
                                        </FormItem>
                                    </TabPane>
                                    <TabPane tab="Logs" key="logs">
                                        <Col span={23}>
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        url={fetchHelmChartLogsUrl}
                                                        height={logViewerHeight}
                                                        // width={logViewerWidth}
                                                        stream
                                                        follow={follow}
                                                        onScroll={onScroll}
                                                        enableSearch />
                                                )}
                                            />
                                        </Col>
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                            <TabPane tab="6. Deploy in Cluster" key="6">
                                <Tabs onChange={getLogs}>
                                    <TabPane tab="Status" key="status">
                                        <FormItem {...formItemLayout} label="Task Name:">
                                            <Input value="Deploy" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Step Name:">
                                            <Input value="Deploy in Cluster" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Start Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Completion Time:">
                                            <Input value="-" readOnly />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Status:">
                                            <Tag color="#52c41a">{deployInClusterStatus}</Tag>
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="Reason:">
                                            <Input value="" readOnly />
                                        </FormItem>
                                    </TabPane>
                                    <TabPane tab="Logs" key="logs">
                                        <Col span={23}>
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        url={deployInClusterLogsUrl}
                                                        height={logViewerHeight}
                                                        // width={logViewerWidth}
                                                        stream
                                                        follow={follow}
                                                        onScroll={onScroll}
                                                        enableSearch />
                                                )}
                                            />
                                        </Col>
                                    </TabPane>
                                </Tabs>
                                <br />
                            </TabPane>
                        </Tabs>
                    </Form>
                </Col>
            </Row>
        </div >
    );
}

export default ViewReleasePipeline;