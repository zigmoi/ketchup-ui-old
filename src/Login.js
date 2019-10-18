import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Form, Icon, Input, Button, Spin, Modal, message, Layout, Menu } from 'antd';
import qs from 'qs';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import useLoginStatus from './useLoginStatus';
import UserContext from './UserContext';
import ProjectContext from './ProjectContext';

const FormItem = Form.Item;
const { Header, Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

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
  const projectContext = useContext(ProjectContext);
  const loginStatus = useLoginStatus();

  useEffect(() => {
    console.log("in effect login");
    document.title = "Login";
    //execution comes here when login is in progress and current user is set.
    //loginStatus gets updated via context api and hence execution comes here.
    //variable isUserLoggingIn is used to prevent history.replace
    //from executiing twice and loading route twice.
    //Once its executed in useEffect and secind time in getUserInfo.
    //Without this check route gets called twice also causes interceptor to load twice.

    if (location.state && location.state.from && location.state.from.pathname) {
        setFrom(from => location.state.from.pathname);
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
      baseURL: "http://localhost:8097",
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
        console.log("Error in login request: ", error);
        setIconLoading(false);
      });

  }

  function getUserInfo(loggedInUserName, accessToken) {
    setIconLoading(true);
    let config = {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    }
    axios.get('http://localhost:8097/v1/user/my/profile', config)
      .then((response) => {
        console.log("getUserInfo", response);
        setIconLoading(false);
        let user = {
          id: loggedInUserName,
          accessToken: accessToken,
          displayName: response.data.displayName,
          roles: response.data.roles,
          tenantId: response.data.tenantId,
          email: response.data.email,
        };

        setIsUserLoggingIn(true);
        userContext.setCurrentUser(user);
        projectContext.setCurrentProject({ projectId: "p1" });
        history.replace(from);
      })
      .catch((error) => {
        message.error("Unable to fetch profile information.");
        setIconLoading(false);
      });
  }


  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ height: '48px', backgroundColor: '#efefef', padding: '0px' }}>
        <Menu
          theme="light"
          mode="horizontal"
          style={{ backgroundColor: '#efefef' }}
        >
          <Menu.Item key="Heading" style={{ fontWeight: 'bold' }}>
            <span style={{ fontSize: 14 }}> Ketchup Management Console</span>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ height: 'calc(100vh - 48px)' }}>
        <div style={{ height: 'calc(100vh - 48px)', backgroundColor: '#6d7993', paddingTop: '150px' }}>
          <Row type="flex" justify="center" align="middle">
            <Col span={8}  >

              <Form style={{ height: '320px', backgroundColor: '#efefef' }}>
                <br />
                <label style={{ fontSize: 15 }}><b>Login</b></label>
                <br />
                <Spin spinning={iconLoading}></Spin>
                <br />
                <br />
                <FormItem {...formItemLayout} label="Username:">
                  <Input prefix={<Icon type="user" style={{ fontSize: 20 }} />} placeholder=" Username"
                    autoFocus
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }} />
                </FormItem>
                <FormItem {...formItemLayout} label="Password:">
                  <Input.Password prefix={<Icon type="lock" style={{ fontSize: 20 }} />} placeholder=" Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />
                </FormItem>
                <FormItem>
                  <Button type="primary" style={{ backgroundColor: '#96858f' }}
                    //loading={this.state.loadingIcon}
                    icon={'login'}
                    htmlType="submit"
                    onClick={submitRequest}>Log In</Button>
                </FormItem>
                <FormItem>
                  <a style={{ color: '#373737' }} onClick={
                    () => {

                    }}>Forgot Password?</a>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default Login;