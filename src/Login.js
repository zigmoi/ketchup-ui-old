import { Button, Col, Form, Input, Layout, message, Modal, Row, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import loginGeneralImage from './Images/login-general-img.svg';
import loginImage from './Images/login-img.svg';
import useLoginStatus from './useLoginStatus';
import UserContext from './UserContext';

const FormItem = Form.Item;
const { Content } = Layout;

function Login() {
  console.log("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [iconLoading, setIconLoading] = useState(false);
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);
  const [from, setFrom] = useState("/app/dashboard");

  let history = useHistory();
  let location = useLocation();

  const userContext = useContext(UserContext);
  const loginStatus = useLoginStatus();

  useEffect(() => {
    console.log("in effect login");
    document.title = "Log In";
    //execution comes here when login is in progress and current user is set.
    //loginStatus gets updated via context api and hence execution comes here.
    //variable isUserLoggingIn is used to prevent history.replace
    //from executiing twice and loading route twice.
    //Once its executed in useEffect and secind time in getUserInfo.
    //Without this check route gets called twice also causes interceptor to load twice.

    if (location.state && location.state.from && location.state.from.pathname) {
      setFrom(location.state.from.pathname);
    }

    if (loginStatus && isUserLoggingIn == false) {
      history.replace(from);
    }
  }, [loginStatus]);


  function submitRequest() {
    setIconLoading(true);

    var params = {
      "grant_type": "password",
      'username': username,
      'password': password
    };

    var authHeader = {
      username: 'client-id-1',
      password: 'client-id-1-secret',
      scope: 'all'
    };

    axios.request({
      url: "/oauth/token",
      method: "post",
      baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
      auth: authHeader,
      data: qs.stringify(params),
      headers: { "content-type": "application/x-www-form-urlencoded" }
    }).then((response) => {
      console.log(response);
      setIconLoading(false);
      // var decoded_token = jwt_decode(response.data.access_token);
      // console.log(decoded_token);
      getUserInfo(username, response.data.access_token);
    })
      .catch((error) => {
        setIconLoading(false);
        console.log("Error in login request: ", error);
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
              message.error(errorMessage, 5);
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
        } catch (error) {
          console.log(error);
          message.error('Something went wrong! If the problem persists, kindly contact support.', 5);
        };
      }
      );

  }

  function getUserInfo(loggedInUserName, accessToken) {
    setIconLoading(true);
    let config = {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    }
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/user/my/profile`, config)
      .then((response) => {
        console.log("getUserInfo", response);
        setIconLoading(false);
        let user = {
          id: loggedInUserName,
          accessToken: accessToken,
          displayName: response.data.displayName,
          roles: response.data.roles,
          tenantId: response.data.userName.split("@")[1],
          email: response.data.email,
        };

        setIsUserLoggingIn(true);
        userContext.setCurrentUser(user);
        history.replace(from);
      })
      .catch((error) => {
        message.error("Unable to fetch profile information.");
        setIconLoading(false);
      });
  }


  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ height: 'calc(100vh)' }}>

        <Row >
          <Col span={12} style={{ backgroundColor: '#FAFBFD', height: 'calc(100vh)' }}>
            <Form style={{ backgroundColor: '#FAFBFD', borderRadius: '25px', padding: '40px 100px 100px 100px' }}>
              <label style={{ fontSize: 30, fontWeight: 'bold', color: '#31363E' }}><b>Ketchup</b></label>
              <br />
              <img src={loginImage} height="200" width="200" />
              <br />
              <label style={{ fontSize: 20, fontWeight: 'bold', color: '#31363E' }}><b>Log In</b></label>
              <br />
              <Spin spinning={iconLoading}></Spin>
              <br />
              <FormItem>
                <Input
                  style={{ color: '#31363E', fontWeight: 'bold', borderRadius: '25px' }}
                  size="large"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value) }} />
              </FormItem>
              <FormItem>
                <Input
                  type="password"
                  style={{ color: '#31363E', fontWeight: 'bold', borderRadius: '25px' }}
                  size="large"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value) }} />
              </FormItem>
              <FormItem>
                <Button type="primary"
                  size="large"
                  shape="round"
                  block
                  style={{ backgroundColor: '#6c63ff', color: 'white', fontWeight: 'bold' }}
                  htmlType="submit"
                  onClick={submitRequest}>Sign In</Button>
              </FormItem>
              <FormItem>
                <a style={{ fontSize: '12px', color: '#31363E' }} onClick={
                  () => {

                  }}>Forgot Password</a>
              </FormItem>
            </Form>
          </Col>
          <Col span={12}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <label style={{ fontSize: '25px', fontWeight: 'bold' }}>Kubernetes Application Deployment Platform</label>
            <br />
            <img src={loginGeneralImage} height="400" width="600" />

          </Col>
        </Row>

      </Content>
    </Layout>
  );
}

export default Login;