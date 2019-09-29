import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { Switch, Link } from 'react-router-dom';
import { Icon, Layout, Menu, Spin, Popover, Avatar, Select, message } from 'antd';
import { Row, Col } from 'antd';

import useValidateUserHasAnyRole from './useValidateUserHasAnyRole';
import useValidateUserHasAllRoles from './useValidateUserHasAllRoles';

import UserContext from './UserContext';
import ProjectContext from './ProjectContext';
import useCurrentProject from './useCurrentProject';
import ProtectedRoute from './ProtectedRoute';

import Nomatch from './Nomatch';
import Dashboard from './Dashboard';
import Dashboard1 from './Dashboard1';
import ManageTenants from './Tenants/ManageTenants';
import ManageUsersOld from './Users/ManageUsersOld';
import CreateTenant from './Tenants/CreateTenant';
import CreateUserOld from './Users/CreateUserOld';

import CreateUser from './Users/CreateUser';
import ManageUsers from './Users/ManageUsers';

import ManageProjects from './Projects/ManageProjects';

import CreateGitProvider from './Resources/GitProviders/CreateGitProvider';
import ManageGitProvider from './Resources/GitProviders/ManageGitProvider';
import CreateBuildTool from './Resources/BuildTools/CreateBuildTool';
import ManageBuildTool from './Resources/BuildTools/ManageBuildTool';
import CreateProject from './Projects/CreateProject';
import ViewProject from './Projects/ViewProject';
import ManageProjectMembers from './Projects/ManageProjectMembers';
import ManageProjectPermissions from './Projects/ManageProjectPermissions';




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
  if (useValidateUserHasAllRoles(['ROLE_SUPER_ADMIN'])) {
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
  if (useValidateUserHasAllRoles(['ROLE_SUPER_ADMIN'])) {
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

  let manageUsersMenu;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN'])) {
    manageUsersMenu = (
      <Menu.Item key="manage-users">
        <Link to="/app/manage-users">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Manage Users</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageUsersMenu = null;
  }

  let usersSubMenu;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN'])) {
    usersSubMenu = (
      <SubMenu
        key="users"
        title={<span>
          <Icon type="user" />
          <span style={{ fontWeight: 'bold' }}>Users</span>
        </span>}
      >
        {manageUsersMenu}
      </SubMenu>
    )
  } else {
    usersSubMenu = null;
  }

  let manageProjectsMenu;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN'])) {
    manageProjectsMenu = (
      <Menu.Item key="manage-projects">
        <Link to="/app/projects">
          <Icon type="container" />
          <span style={{ fontWeight: 'bold' }}>Manage Projects</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageProjectsMenu = null;
  }

  let projectsSubMenu;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN'])) {
    projectsSubMenu = (
      <SubMenu
        key="projects"
        title={<span>
          <Icon type="project" />
          <span style={{ fontWeight: 'bold' }}>Projects</span>
        </span>}
      >
        {manageProjectsMenu}
      </SubMenu>
    )
  } else {
    projectsSubMenu = null;
  }

  let createGitProviderMenu = null;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
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
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
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
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
    gitProviderSubMenu = (
      <SubMenu key="git-provider" title={<span> <Icon type="github" /> <span style={{ fontWeight: 'bold' }}>Git Providers</span></span>}>
        {createGitProviderMenu}
        {manageGitProviderMenu}
      </SubMenu>
    )
  }

  let createBuildToolMenu = null;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
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
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
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
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
    buildToolSubMenu = (
      <SubMenu key="build-tools" title={<span> <Icon type="tool" /><span style={{ fontWeight: 'bold' }}>Build Tools</span></span>}>
        {createBuildToolMenu}
        {manageBuildToolMenu}
      </SubMenu>
    )
  }

  let resourceSubMenu = null;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN'])) {
    resourceSubMenu = (
      <SubMenu key="resources" title={<span><Icon type="appstore" /><span style={{ fontWeight: 'bold' }}>Resources</span></span>}>
        {gitProviderSubMenu}
        {buildToolSubMenu}
      </SubMenu>
    )
  }

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#efefef', padding: '0px' }}>
      <Header theme={"dark"} style={{ height: '48px', padding: '0px' }}>
        <Menu
          theme="light"
          mode="horizontal"
          activeKey="Heading"
          theme={"dark"}
        >
          {/* <Menu.Item key="Spinner" style={{ fontWeight: 'bold', float: 'left' }}>
          <Spin spinning />
        </Menu.Item> */}
          <Menu.Item key="Heading" style={{ fontWeight: 'bold', float: 'left' }}>
            <span style={{ fontSize: 14 }}> Ketchup Management Console</span>
          </Menu.Item>

          {userProfileButton}
          <Menu.Item key="Project" style={{ fontWeight: 'bold', float: 'left', float: "right" }}>
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
          theme={"dark"}
          style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 96px)' }}
        >
          <Menu mode="inline" theme="dark" style={{ borderRight: 0, textAlign: 'left' }}>

            <Menu.Item key="dashboard">
              <Link to="/app/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            {tenantsSubMenu}
            {usersSubMenu}
            {projectsSubMenu}
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
                  <ProtectedRoute path="/" exact component={Dashboard} />
                  <ProtectedRoute path="/app" exact component={Dashboard} />
                  <ProtectedRoute path="/app/dashboard" component={Dashboard} />
                  <ProtectedRoute path="/app/dashboard1" component={Dashboard1} />
                  <ProtectedRoute path="/app/create-tenant" component={CreateTenant} roles={['ROLE_SUPER_ADMIN']} />
                  <ProtectedRoute path="/app/manage-tenants" component={ManageTenants} roles={['ROLE_SUPER_ADMIN']} />
                  <ProtectedRoute path="/app/create-user" component={CreateUser} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/manage-users" component={ManageUsers} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/create-user-old" component={CreateUserOld} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/manage-users-old" component={ManageUsersOld} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/add-git-provider" component={CreateGitProvider} />
                  <ProtectedRoute path="/app/manage-git-provider" component={ManageGitProvider} />
                  <ProtectedRoute path="/app/add-build-tool" component={CreateBuildTool} />
                  <ProtectedRoute path="/app/manage-build-tool" component={ManageBuildTool} />
                  <ProtectedRoute path="/app/project/create" component={CreateProject} />
                  <ProtectedRoute path="/app/projects" component={ManageProjects} />
                  <ProtectedRoute path="/app/project/:projectResourceId/view" component={ViewProject} />
                  <ProtectedRoute path="/app/project/:projectResourceId/members" component={ManageProjectMembers} />
                  <ProtectedRoute path="/app/project/:projectResourceId/permissions" component={ManageProjectPermissions} />
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