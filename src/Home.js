import React, {useState, useContext} from 'react';
import './App.css';

import { Route, Switch, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Dashboard1 from './Dashboard1';
import Nomatch from './Nomatch';
import ProtectedRoute from './ProtectedRoute';
import { Icon, Layout, Menu, Spin, Popover, Avatar } from 'antd';
import { Row, Col } from 'antd';
import UserContext from './UserContext';

function Home(props) {
  const { Header, Content, Sider } = Layout;
  const SubMenu = Menu.SubMenu;

  const userContext = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);

  let userProfileButton;
  const profileContent = (
    <div>
      <span>User: </span>
      <span style={{ fontWeight: 'bold' }}>{props.user.id}</span>
      <br />
      <span>Role: </span>
      <span style={{ fontWeight: 'bold' }}>{props.user.roles.replace("ROLE_", "")}</span>
      <br />
      <Link to="/login"
        onClick={() => {
            userContext.clearCurrentUser();
        }}>
        <span style={{ fontWeight: 'bold' }}>Sign Out</span>
      </Link>
    </div>
  );

  userProfileButton = (
    <Menu.Item key="username" style={{ float: "right" }}>
      <Popover placement="bottomLeft" content={profileContent} trigger={"click"}>
        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
          {props.user.id}
        </Avatar>
      </Popover>
    </Menu.Item >
  )

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#efefef', padding: '0px' }}>
      <Header style={{ height: '48px', backgroundColor: '#efefef', padding: '0px' }}>
        <Menu
          theme="light"
          mode="horizontal"
          style={{ backgroundColor: '#fff' }}
        >
          {/* <Menu.Item key="Spinner" style={{ fontWeight: 'bold', float: 'left' }}>
            <Spin spinning />
          </Menu.Item> */}
          <Menu.Item key="Heading" style={{ fontWeight: 'bold', color: 'black', float: 'left' }}>
            <span style={{ fontSize: 14 }}> Ketchup Management Console</span>
          </Menu.Item>
          {userProfileButton}
        </Menu>
      </Header>
      <Layout style={{height: 'calc(100vh - 48px)'}}>
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: '#fff', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 96px)' }}
        >
          <Menu mode="inline" theme="light" style={{ background: '#fff', borderRight: 0, textAlign: 'left' }}>

            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/profile/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="settings"
              title={<span>
                <Icon type="setting" />
                <span style={{ fontWeight: 'bold' }}>Settings</span>
              </span>}
            >
              <Menu.Item key="user-account"><span style={{ fontWeight: 'bold' }}>User Account Settings</span></Menu.Item>
              <Menu.Item key="app"><span style={{ fontWeight: 'bold' }}>Application Settings</span></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>


        <Layout style={{ borderLeft: '1px solid #e9e9e9', 
                         height: 'calc(100vh- 48px)', 
                         backgroundColor: '#fff', 
                         paddingLeft: '5px, 5px, 0px,0px',
                         overflow: 'auto' }}>
          <Content style={{ backgroundColor: '#fff' }}>
            <Row>
              <Col span={24}>
                <Switch>
                  <Route path="/" exact component={Dashboard} />
                  <Route path="/profile" exact component={Dashboard} />
                  <Route path="/profile/dashboard" component={Dashboard} />
                  <ProtectedRoute path="/profile/dashboard1" component={Dashboard1} />
                  <Route component={Nomatch} />
                </Switch>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;