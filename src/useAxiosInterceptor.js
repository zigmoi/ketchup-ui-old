import React, { useContext } from 'react';
import UserContext from './UserContext';
import axios from 'axios';
import { message } from 'antd';

function useAxiosInterceptor() {
    const userContext = useContext(UserContext);

    function setup() {
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
                if(currentUser && currentUser.accessToken){
                    accessToken = currentUser.accessToken;
                    config.headers.common['Authorization'] = 'Bearer ' + accessToken;
                }
            }
            return config;
        }, (error) => {
            console.log("Error in Request Interceptor: ",error);
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
                    //let errorMessage = error.response.data.apierror.message || error.response.data.error_description;
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
                        // localStorage.removeItem("AuthToken");
                        // localStorage.removeItem("LoggedInUser");
                        // this.props.logoutSuccess();
                        // this.props.history.replace("/login");
                    } else if (responseStatus === 403) {
                        message.error('Access denied, If you think you should have access to this resource, please contact support.', 5);
                    } else if (responseStatus === 404) {
                        message.error('Resource not found, ' + errorMessage, 5);
                    } else if (responseStatus === 400) {
                        let subErrors = "";
                        if (error.response.data.apierror && error.response.data.apierror.subErrors) {
                            subErrors = error.response.data.apierror.subErrors;
                            // this.setState({ subErrors: subErrors });
                            // this.setState({ showValidationErrorsView: true });
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
    return setup;
}

export default useAxiosInterceptor;
