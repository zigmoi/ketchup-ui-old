import React from 'react';
import axios from 'axios';
import { message, Modal, Col, Row } from 'antd';

function axiosInterceptor(userContext, history, location) {
    console.log("setting interceptor.");
    if (axios.defaults.timeout !== 0) {
        console.log("Interceptor already setup. returning.");
        return;
    }
    // Add a request interceptor
    axios.defaults.timeout = 30000;
    axios.interceptors.request.use((config) => {
        // Do something before request is sent
        let accessToken;
        if (userContext && userContext.currentUser && userContext.currentUser.accessToken) {
            accessToken = userContext.currentUser.accessToken;
            config.headers.common['Authorization'] = 'Bearer ' + accessToken;
        } else {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.accessToken) {
                accessToken = currentUser.accessToken;
                config.headers.common['Authorization'] = 'Bearer ' + accessToken;
            }
        }
        return config;
    }, (error) => {
        console.log("Error in Request Interceptor: ", error);
        return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
        console.log("response:" + response);
        return response;
    }, (error) => {
        try {
            if (error.response) {
                console.log("Error response:", error.response);
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let responseStatus = error.response.status;
                let errorMessage = "";
                if (error.response.data.apierror && error.response.data.apierror.message) {
                    errorMessage = error.response.data.apierror.message;
                } else if (error.response.data.error_description) {
                    errorMessage = error.response.data.error_description;
                } else {
                    errorMessage = "";
                }
                if (responseStatus === 401) {
                    message.error('Authentication required, Please login to continue.', 5);
                    //UserProvider has not wrapped this so userContext.clearCurrentUser is not available here.
                    //withRouter around interceptors parent component and passing history props is making is render multiple times.
                    //Thus using localStorage and window.location directly.
                    //localStorage.removeItem("currentUser");
                    //  window.location.href = "/login";
                    setTimeout(function () { 
                        //Allows promise to resolve before history.push executes 
                        //and hence avoids set state executing after component unmounts. 
                        userContext.clearCurrentUser();
                        history.push("/login", { from: location.pathname });
                    }, 500);
                } else if (responseStatus === 403) {
                    message.error('Access denied, If you think you should have access to this resource, please contact support.', 5);
                } else if (responseStatus === 404) {
                    message.error('Resource not found, ' + errorMessage, 5);
                } else if (responseStatus === 400) {
                    let subErrors = "";
                    if (error.response.data.apierror && error.response.data.apierror.subErrors) {
                        subErrors = error.response.data.apierror.subErrors;
                        let errorView = (
                            <ul>
                                {subErrors.map((value, index) => {
                                    return <li key={index}>{value.field} : {value.message}</li>
                                })}
                            </ul>);
                        Modal.error({
                            width: 850,
                            title: 'Validation Errors:',
                            content: (
                                <Row type="flex" justify="center" align="middle">
                                    <Col span={24}>
                                        {errorView}
                                    </Col>
                                </Row>
                            ),
                            onOk() { },
                        });
                    } else {
                        message.error('Invalid request, ' + errorMessage, 5);
                    }
                } else if (responseStatus === 500) {
                    message.error('Something went wrong, please try again later! If the problem persists, please contact support.', 5);
                } else {
                    message.error('Something went wrong, please try again later! If the problem persists, kindly contact support.', 5);
                }
            } else if (error.request) {
                //when no response from server, like Timeout, Server down, CORS issue, Network issue.
                // The request was made but no response was received.
                //console.log(error.request);
                message.error('Application server is not accessible, please try again!', 5);
            } else {
                // Something happened in setting up the request that triggered an Error
                //console.log('Error', error.message);
                message.error('Request processing failed, Invalid request.', 5);
            }
            return Promise.reject(error);
        } catch (error) {
            console.log(error);
            message.error('Something went wrong! If the problem persists, kindly contact support.', 5);
            return Promise.reject(error);
        };
    });

}

export default axiosInterceptor;
