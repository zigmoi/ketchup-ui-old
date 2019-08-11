import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { Switch, Link } from 'react-router-dom';
import { Icon, Layout, Menu, Spin, Popover, Avatar, Select, message } from 'antd';
import { Row, Col } from 'antd';

import useValidateUserHasAnyPermission from './useValidateUserHasAnyPermission';
import useValidateUserHasAllPermissions from './useValidateUserPermissions';

import UserContext from './UserContext';
import ProjectContext from './ProjectContext';
import useCurrentProject from './useCurrentProject';
import ProtectedRoute from './ProtectedRoute';

import Nomatch from './Nomatch';
import Dashboard from './Dashboard';
import Dashboard1 from './Dashboard1';
import ManageTenants from './Tenants/ManageTenants';
import ManageUsers from './Users/ManageUsers';
import CreateTenant from './Tenants/CreateTenant';
import CreateUser from './Users/CreateUser';

import CreateUser1 from './Users/CreateUser1';
import ManageUsers1 from './Users/ManageUsers1';

import CreateGitProvider from './Resources/GitProviders/CreateGitProvider';
import ManageGitProvider from './Resources/GitProviders/ManageGitProvider';
import CreateBuildTool from './Resources/BuildTools/CreateBuildTool';
import ManageBuildTool from './Resources/BuildTools/ManageBuildTool';




function Home() {
  const { Header, Content, Sider } = Layout;
  const SubMenu = Menu.SubMenu;
  const { Option } = Select;

  const userContext = useContext(UserContext);
  const projectContext = useContext(ProjectContext);
  const currentProject = useCurrentProject();

  const [collapsed, setCollapsed] = useState(false);
  const [projectId, setProjectId] = useState("");


  useEffect(() => {
    console.log("in effect home, project: ", currentProject);
    setProjectId(currentProject ? currentProject.projectId : "");
  }, []);


  function onProjectChange(value) {
    console.log(`selected ${value}`);
    projectContext.setCurrentProject({ projectId: value });
    setProjectId(value);
    message.info(`Activated project ${value}`);
  }


  let userProfileButton;
  const profileContent = (
    <div>
      <span>User: </span>
      <span style={{ fontWeight: 'bold' }}>{userContext.currentUser ? userContext.currentUser.id : ""}</span>
      <br />
      <span>Alias: </span>
      <span style={{ fontWeight: 'bold' }}>{userContext.currentUser ? userContext.currentUser.displayName : ""}</span>
      <br />
      <span>Role: </span>
      <span style={{ fontWeight: 'bold' }}>{userContext.currentUser ? userContext.currentUser.roles[0].replace("ROLE_", "") : ""}</span>
      <br />
      <span>Email: </span>
      <span style={{ fontWeight: 'bold' }}>{userContext.currentUser ? userContext.currentUser.email : ""}</span>
      <br />
      <Link to="/login"
        onClick={() => {
          projectContext.clearCurrentProject();
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
          {userContext.currentUser ? userContext.currentUser.displayName.charAt(0).toUpperCase() : ""}
        </Avatar>
      </Popover>
    </Menu.Item >
  )

  let manageTenantsMenu;
  if (useValidateUserHasAllPermissions(['manage-tenants'])) {
    manageTenantsMenu = (
      <Menu.Item key="manage-tenants">
        <Link to="/app/manage-tenants">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Manage</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageTenantsMenu = null;
  }

  let tenantsSubMenu;
  if (useValidateUserHasAnyPermission(['create-tenant', 'manage-tenants'])) {
    tenantsSubMenu = (
      <SubMenu
        key="tenants"
        title={<span>
          <Icon type="team" />
          <span style={{ fontWeight: 'bold' }}>Tenants</span>
        </span>}
      >
        {manageTenantsMenu}
      </SubMenu>
    )
  } else {
    tenantsSubMenu = null;
  }



  let createUserMenu;
  if (useValidateUserHasAllPermissions(['create-user'])) {
    createUserMenu = (
      <Menu.Item key="create-user">
        <Link to="/app/create-user">
          <Icon type="plus-circle" />
          <span style={{ fontWeight: 'bold' }}>Create</span>
        </Link>
      </Menu.Item>
    );
  } else {
    createUserMenu = null;
  }

  let manageUsersMenu;
  if (useValidateUserHasAllPermissions(['manage-users'])) {
    manageUsersMenu = (
      <Menu.Item key="manage-users">
        <Link to="/app/manage-users">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Manage</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageUsersMenu = null;
  }

  let createUserMenu1;
  if (useValidateUserHasAllPermissions(['create-user'])) {
    createUserMenu1 = (
      <Menu.Item key="create-user1">
        <Link to="/app/create-user1">
          <Icon type="plus-circle" />
          <span style={{ fontWeight: 'bold' }}>Create User1</span>
        </Link>
      </Menu.Item>
    );
  } else {
    createUserMenu1 = null;
  }

  let manageUsersMenu1;
  if (useValidateUserHasAllPermissions(['manage-users'])) {
    manageUsersMenu1 = (
      <Menu.Item key="manage-users1">
        <Link to="/app/manage-users1">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Manage Users1</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageUsersMenu1 = null;
  }

  let usersSubMenu;
  if (useValidateUserHasAnyPermission(['create-user', 'manage-users'])) {
    usersSubMenu = (
      <SubMenu
        key="users"
        title={<span>
          <Icon type="user" />
          <span style={{ fontWeight: 'bold' }}>Users</span>
        </span>}
      >
        {createUserMenu}
        {manageUsersMenu}
        {createUserMenu1}
        {manageUsersMenu1}
      </SubMenu>
    )
  } else {
    usersSubMenu = null;
  }

  let createGitProviderMenu = null;
  if (useValidateUserHasAllPermissions(['create-git-provider'])) {
    createGitProviderMenu = (
      <Menu.Item key="add-git-provider">
        <Link to="/app/add-git-provider">
          <Icon type="plus-circle" />
          <span style={{ fontWeight: 'bold' }}>Add Git Provider</span>
        </Link>
      </Menu.Item>
    );
  }

  let manageGitProviderMenu = null;
  if (useValidateUserHasAllPermissions(['manage-git-provider'])) {
    manageGitProviderMenu = (
      <Menu.Item key="manage-git-provider">
        <Link to="/app/manage-git-provider">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Manage Git Provider</span>
        </Link>
      </Menu.Item>
    );
  }

  let gitProviderSubMenu = null;
  if (useValidateUserHasAnyPermission(["create-git-provider", "manage-git-provider"])) {
    gitProviderSubMenu = (
      <SubMenu key="git-provider" title={<span> <Icon type="github" /> <span style={{ fontWeight: 'bold' }}>Git Providers</span></span>}>
        {createGitProviderMenu}
        {manageGitProviderMenu}
      </SubMenu>
    )
  }

  let createBuildToolMenu = null;
  if (useValidateUserHasAllPermissions(['create-git-provider'])) {
    createBuildToolMenu = (
      <Menu.Item key="add-build-tool">
        <Link to="/app/add-build-tool">
          <Icon type="plus-circle" />
          <span style={{ fontWeight: 'bold' }}>Add Build Tool</span>
        </Link>
      </Menu.Item>
    );
  }

  let manageBuildToolMenu = null;
  if (useValidateUserHasAllPermissions(['manage-git-provider'])) {
    manageBuildToolMenu = (
      <Menu.Item key="manage-build-tool">
        <Link to="/app/manage-build-tool">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Mange Build Tool</span>
        </Link>
      </Menu.Item>
    );
  }

  let buildToolSubMenu = null;
  if (useValidateUserHasAnyPermission(["create-build-tool", "manage-build-tool"])) {
    buildToolSubMenu = (
      <SubMenu key="build-tools" title={<span> <Icon type="tool" /><span style={{ fontWeight: 'bold' }}>Build Tools</span></span>}>
        {createBuildToolMenu}
        {manageBuildToolMenu}
      </SubMenu>
    )
  }

  let resourceSubMenu = null;
  if (useValidateUserHasAnyPermission(["create-git-provider", "manage-git-provider", "create-build-tool", "manage-build-tool"])) {
    resourceSubMenu = (
      <SubMenu key="resources" title={<span><Icon type="appstore" /><span style={{ fontWeight: 'bold' }}>Resources</span></span>}>
        {gitProviderSubMenu}
        {buildToolSubMenu}
      </SubMenu>
    )
  }

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#efefef', padding: '0px' }}>
      <Header style={{ height: '48px', backgroundColor: '#efefef', padding: '0px' }}>
        <Menu
          theme="light"
          mode="horizontal"
          activeKey="Heading"
          style={{ backgroundColor: '#fff' }}
        >
          {/* <Menu.Item key="Spinner" style={{ fontWeight: 'bold', float: 'left' }}>
          <Spin spinning />
        </Menu.Item> */}
          <Menu.Item key="Heading" style={{ fontWeight: 'bold', color: 'black', float: 'left' }}>
            <span style={{ fontSize: 14 }}> Ketchup Management Console</span>
          </Menu.Item>

          {userProfileButton}
          <Menu.Item key="Project" style={{ fontWeight: 'bold', color: 'black', float: 'left', float: "right" }}>
            <span style={{ fontSize: 14 }}> Active Project: </span>
            <Select defaultValue={projectId}
              value={projectId}
              size={"small"}
              style={{ width: 120 }}
              onChange={onProjectChange}>
              <Option value="p1">P1</Option>
              <Option value="p2">P2</Option>
              <Option value="p3">P3</Option>
            </Select>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout style={{ height: 'calc(100vh - 48px)' }}>
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: '#fff', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 96px)' }}
        >
          <Menu mode="inline" theme="light" style={{ background: '#fff', borderRight: 0, textAlign: 'left' }}>

            <Menu.Item key="dashboard">
              <Link to="/app/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            {tenantsSubMenu}
            {usersSubMenu}
            {resourceSubMenu}
          </Menu>
        </Sider>


        <Layout style={{
          borderLeft: '1px solid #e9e9e9',
          height: 'calc(100vh- 48px)',
          backgroundColor: '#fff',
          paddingLeft: '5px, 5px, 0px,0px',
          overflow: 'auto'
        }}>
          <Content style={{ backgroundColor: '#fff' }}>
            <Row>
              <Col span={24}>
                <Switch>
                  <ProtectedRoute path="/" exact component={Dashboard} permissions={['dashboard', 'test']} />
                  <ProtectedRoute path="/app" exact component={Dashboard} permissions={['dashboard', 'test']} />
                  <ProtectedRoute path="/app/dashboard" component={Dashboard} permissions={['dashboard', 'test']} />
                  <ProtectedRoute path="/app/dashboard1" component={Dashboard1} permissions={['dashboard1']} />
                  <ProtectedRoute path="/app/create-tenant" component={CreateTenant} permissions={['create-tenant']} />
                  <ProtectedRoute path="/app/manage-tenants" component={ManageTenants} permissions={['manage-tenants']} />
                  <ProtectedRoute path="/app/create-user1" component={CreateUser1} permissions={['create-user']} />
                  <ProtectedRoute path="/app/manage-users1" component={ManageUsers1} permissions={['manage-users']} />
                  <ProtectedRoute path="/app/create-user" component={CreateUser} permissions={['create-user']} />
                  <ProtectedRoute path="/app/manage-users" component={ManageUsers} permissions={['manage-users']} />
                  <ProtectedRoute path="/app/add-git-provider" component={CreateGitProvider} permissions={['create-git-provider']} />
                  <ProtectedRoute path="/app/manage-git-provider" component={ManageGitProvider} permissions={['manage-git-provider']} />
                  <ProtectedRoute path="/app/add-build-tool" component={CreateBuildTool} permissions={['create-build-tool']} />
                  <ProtectedRoute path="/app/manage-build-tool" component={ManageBuildTool} permissions={['manage-build-tool']} />
                  <ProtectedRoute component={Nomatch} />
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