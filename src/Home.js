import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { Switch, Link, useHistory, useLocation } from 'react-router-dom';
import { Icon, Layout, Menu, Popover, Avatar, Select, message, Button, Dropdown, Tooltip } from 'antd';
import { Row, Col } from 'antd';

import axiosInterceptor from './axiosInterceptor';
import useValidateUserHasAnyRole from './useValidateUserHasAnyRole';
import useValidateUserHasAllRoles from './useValidateUserHasAllRoles';

import UserContext from './UserContext';
import ProjectContext from './ProjectContext';
import useCurrentProject from './useCurrentProject';
import DeploymentContext from './DeploymentContext';
import useCurrentDeployment from './useCurrentDeployment';
import ProtectedRoute from './ProtectedRoute';

import Nomatch from './Nomatch';
import Dashboard from './Dashboard';
import ManageTenants from './Tenants/ManageTenants';
import CreateTenant from './Tenants/CreateTenant';

import CreateUser from './Users/CreateUser';
import ManageUsers from './Users/ManageUsers';
import ManageRoles from './Users/ManageRoles';

import CreateProject from './Projects/CreateProject';
import ViewProject from './Projects/ViewProject';
import ManageProjects from './Projects/ManageProjects';
import ManageProjectMembers from './Projects/ManageProjectMembers';
import ManageProjectPermissions from './Projects/ManageProjectPermissions';

import ManageSettings from './Settings/ManageSettings';

import ManageDeployments from './Deployments/ManageDeployments';
import CreateDeployment from './Deployments/CreateDeployment';



function Home() {
  const userContext = useContext(UserContext);
  let history = useHistory();
  let location = useLocation();
  useEffect(() => {
    //home is loaded again when user gets logged out to login page.
    //on login user is redirected to a route which mounts Home page again.
    //thus interceptor gets called again.
    //To prevent inteceptor has a check (If its already loaded) before setting it up. 
    axiosInterceptor(userContext, history, location);
  }, []);

  const { Header, Content, Sider } = Layout;
  const SubMenu = Menu.SubMenu;
  const { Option } = Select;

  const [collapsed, setCollapsed] = useState(false);

  const projectContext = useContext(ProjectContext);
  const currentProject = useCurrentProject();
  const [projectId, setProjectId] = useState("");

  const deploymentContext = useContext(DeploymentContext);
  const currentDeployment = useCurrentDeployment();
  const [deploymentId, setDeploymentId] = useState("");
  const [sideMenuOpenKeys, setSideMenuOpenKeys] = useState([]);


  useEffect(() => {
    console.log("in effect home, project: ", currentProject);
    console.log("in effect home, deployment: ", currentDeployment);
    setProjectId(currentProject ? currentProject.projectId : "");
    setDeploymentId(currentProject && currentDeployment ? currentDeployment.deploymentId : "");
    setSideMenuOpenKeys(['project', 'deployment']);
  }, [currentProject, currentDeployment]);


  function onProjectChange(value) {
    console.log(`selected project: ${value}`);
    projectContext.setCurrentProject({ projectId: value });
    setProjectId(value);
    deploymentContext.clearCurrentDeployment();
    setDeploymentId("");
    history.push(`/app/project/${value}/members`);
    // message.info(`Activated project ${value}`);
  }

  function onDeploymentChange(value) {
    console.log(`selected deployment: ${value}`);
    deploymentContext.setCurrentDeployment({ deploymentId: value });
    setDeploymentId(value);
    history.push(`/app/project/${projectId}/deployment/create`);
    // message.info(`Activated deployment ${value}`);
  }


  let userProfileButton;
  const profileContent = (
    <div style={{ backgroundColor: '#efefef' }}>
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
          deploymentContext.clearCurrentDeployment();
          projectContext.clearCurrentProject();
          userContext.clearCurrentUser();
        }}>
        <span style={{ fontWeight: 'bold' }}>Sign Out</span>
      </Link>
    </div>
  );


  userProfileButton = (
    <Menu.Item key="username" style={{ float: "right" }}>
      <Popover placement="bottomLeft"
        content={profileContent}
        trigger={"click"}>
        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
          {userContext.currentUser ? userContext.currentUser.displayName.charAt(0).toUpperCase() : ""}
        </Avatar>
      </Popover>
    </Menu.Item >
  )

  let manageTenantsMenu;
  if (useValidateUserHasAllRoles(['ROLE_SUPER_ADMIN'])) {
    manageTenantsMenu = (
      <Menu.Item key="manage-tenants" style={{ fontSize: 12 }}>
        <Link to="/app/manage-tenants">
          <Icon type="team" />
          <span style={{ fontWeight: 'bold' }}>Tenants</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageTenantsMenu = null;
  }

  let manageUsersMenu;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN'])) {
    manageUsersMenu = (
      <Menu.Item key="manage-users" style={{ fontSize: 12 }}>
        <Link to="/app/manage-users">
          <Icon type="team" />
          <span style={{ fontWeight: 'bold' }}>Users</span>
        </Link>
      </Menu.Item>
    );
  } else {
    manageUsersMenu = null;
  }

  let deploymentView = null;
  if (projectId && deploymentId) {
    deploymentView = (
      <SubMenu
        key="deployment"
        style={{ fontSize: 12 }}
        title={<span>
          <Icon type="deployment-unit" />
          <span style={{ fontWeight: 'bold', fontSize: 12 }}>
            <Link to={`/app/project/${projectId}/deployments`} 
                  className="side-menu-link-custom"
                  onClick={() => {
                        deploymentContext.clearCurrentDeployment();
                        setDeploymentId("");
            }}>
              Deployments
            </Link>
          </span>
          <span style={{ fontWeight: 'bold', float: 'right' }}>
            <Tooltip title="New Deployment">
              <Link to={`/app/project/${projectId}/deployment/create`}><Icon type="plus-circle" /></Link>
            </Tooltip>
          </span>
        </span>}
      >
        <Menu.ItemGroup key="active-deployment"
          title={<span>
            <Select defaultValue={deploymentId}
              value={deploymentId}
              size={"small"}
              dropdownMatchSelectWidth={false}
              style={{ width: 200 }}
              onChange={onDeploymentChange}>
              <Option value="d1">D1</Option>
              <Option value="d2">D2</Option>
              <Option value="d3">D3</Option>
            </Select>
          </span>}
        ></Menu.ItemGroup>
        <Menu.Item key="deployment-general-details" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
          <Link to={`/app/project/${projectId}/members`}>
            <Icon type="container" />
            <span>General</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="deployment-members" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
          <Link to={`/app/project/${projectId}/members`}>
            <Icon type="team" />
            <span>Members</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="deployment-permissions" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
          <Link to={`/app/project/${projectId}/permissions`}>
            <Icon type="lock" />
            <span>Permissions</span>
          </Link>
        </Menu.Item>
      </SubMenu>
    );
  } else {
    deploymentView = null;
  }

  let projectView = null;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']) && projectId) {
    projectView = (
      <SubMenu
        key="project"
        style={{ fontSize: 12 }}
        title={<span>
          <Icon type="project" />
          <span style={{ fontWeight: 'bold', fontSize: 12 }}>
            <Link to="/app/projects" 
              className="side-menu-link-custom"
              onClick={() => {
                deploymentContext.clearCurrentDeployment();
                setDeploymentId("");
                projectContext.clearCurrentProject();
                setProjectId("");
            }}>
              Projects
            </Link>
          </span>
          <span style={{ fontWeight: 'bold', float: 'right' }}>
            <Tooltip title="New Project">
              <Link to={"/app/project/create"}><Icon type="plus-circle" /></Link>
            </Tooltip>
          </span>
        </span>
        }
      >
        <Menu.ItemGroup key="active-project"
          title={<span>
            <Select defaultValue={projectId}
              value={projectId}
              size={"small"}
              dropdownMatchSelectWidth={false}
              style={{ width: 200 }}
              onChange={onProjectChange}>
              <Option value="a1">A1</Option>
              <Option value="p1">P1</Option>
              <Option value="p2">P2</Option>
              <Option value="p3">P3</Option>
            </Select>
          </span>}
        >
          <Menu.Item key="project-general-details" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
            <Link to={`/app/project/${projectId}/members`}>
              <Icon type="container" />
              <span>General</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="project-members" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
            <Link to={`/app/project/${projectId}/members`}>
              <Icon type="team" />
              <span>Members</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="project-permissions" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
            <Link to={`/app/project/${projectId}/permissions`}>
              <Icon type="lock" />
              <span>Permissions</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="project-settings" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
            <Link to={`/app/project/${projectId}/settings/cloud-providers`}>
              <Icon type="setting" />
              <span>Settings</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="project-deployments" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
            <Link to={`/app/project/${projectId}/deployments`}>
              <Icon type="deployment-unit" />
              <span>Deployments</span>
            </Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>

    );
  } else {
    projectView = (
      <Menu.Item key="manage-projects">
        <Link to="/app/projects">
          <Icon type="project" />
          <span style={{ fontWeight: 'bold', fontSize: 12 }}>Projects</span>
        </Link>
      </Menu.Item>
    );
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
          <Menu.Item key="Heading" style={{ fontWeight: 'bold', float: 'left' }}>
            <span style={{ fontSize: 14 }}> Ketchup Management Console</span>
          </Menu.Item>
          {userProfileButton}
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
          <Menu mode="inline" theme="dark"
            style={{ borderRight: 0, textAlign: 'left' }}
            openKeys={['project', 'deployment']}>

            <Menu.Item key="dashboard" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
              <Link to="/app/dashboard">
                <Icon type="home" />
                <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              </Link>
            </Menu.Item>
            {manageTenantsMenu}
            {manageUsersMenu}
            {projectView}
            {deploymentView}
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
                  <ProtectedRoute path="/app/create-tenant" component={CreateTenant} roles={['ROLE_SUPER_ADMIN']} />
                  <ProtectedRoute path="/app/manage-tenants" component={ManageTenants} roles={['ROLE_SUPER_ADMIN']} />
                  <ProtectedRoute path="/app/create-user" component={CreateUser} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/manage-users" component={ManageUsers} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/user/:userName/roles" component={ManageRoles} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />
                  <ProtectedRoute path="/app/project/create" component={CreateProject} />
                  <ProtectedRoute path="/app/projects" component={ManageProjects} />
                  <ProtectedRoute path="/app/project/:projectResourceId/view" component={ViewProject} />
                  <ProtectedRoute path="/app/project/:projectResourceId/members" component={ManageProjectMembers} />
                  <ProtectedRoute path="/app/project/:projectResourceId/permissions" component={ManageProjectPermissions} />
                  <ProtectedRoute path="/app/project/:projectResourceId/settings/:settingId" component={ManageSettings} />

                  <ProtectedRoute path="/app/project/:projectResourceId/deployments" component={ManageDeployments} />
                  <ProtectedRoute path="/app/project/:projectResourceId/deployment/create" component={CreateDeployment} />
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