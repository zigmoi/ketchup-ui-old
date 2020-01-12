import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { Switch, Link, useHistory, Route } from 'react-router-dom';
import { Icon, Layout, Menu, Popover, Avatar, Tooltip } from 'antd';
import { Row, Col } from 'antd';

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
import EditUser from './Users/EditUser';
import ViewUser from './Users/ViewUser';
import ManageUsers from './Users/ManageUsers';
import ManageRoles from './Users/ManageRoles';

import CreateProject from './Projects/CreateProject';
import ViewProject from './Projects/ViewProject';
import EditProject from './Projects/EditProject';
import ManageProjects from './Projects/ManageProjects';
import ManageProjectMembers from './Projects/ManageProjectMembers';
import ManageProjectPermissions from './Projects/ManageProjectPermissions';

import ManageSettings from './Settings/ManageSettings';

import ManageDeployments from './Deployments/ManageDeployments';
import CreateDeployment from './Deployments/CreateDeployment';
import ListProjects from './Projects/ListProjects';
import DeploymentTypes from './Deployments/DeploymentTypes';


function Home() {
  const userContext = useContext(UserContext);
  let history = useHistory();

  const { Header, Content, Sider } = Layout;
  const SubMenu = Menu.SubMenu;

  const [collapsed, setCollapsed] = useState(false);

  const projectContext = useContext(ProjectContext);
  const currentProject = useCurrentProject();
  const [projectId, setProjectId] = useState("");

  const deploymentContext = useContext(DeploymentContext);
  const currentDeployment = useCurrentDeployment();
  const [deploymentId, setDeploymentId] = useState("");
  const [sideMenuOpenKeys, setSideMenuOpenKeys] = useState([]);
  const [sideMenuPreviousOpenKeys, setSideMenuPreviousOpenKeys] = useState([]);


  useEffect(() => {
    console.log("in effect home, project: ", currentProject);
    console.log("in effect home, deployment: ", currentDeployment);
    setProjectId(currentProject ? currentProject.projectId : "");
    setDeploymentId(currentProject && currentDeployment ? currentDeployment.deploymentId : "");
  }, [currentProject, currentDeployment]);

  useEffect(() => {
    if (projectId && deploymentId) {
      setSideMenuOpenKeys(['project', 'deployment', ...sideMenuOpenKeys]);
    } else if (projectId) {
      setSideMenuOpenKeys(['project', ...sideMenuOpenKeys]);
    } else {
      setSideMenuOpenKeys([...sideMenuOpenKeys]);
    }
  }, [projectId, deploymentId]);

  useEffect(() => {
    if (collapsed) {
      setSideMenuPreviousOpenKeys(sideMenuOpenKeys);
      setSideMenuOpenKeys([]);
    } else {
      setSideMenuOpenKeys(sideMenuPreviousOpenKeys);
      setSideMenuPreviousOpenKeys([]);
    }
  }, [collapsed]);


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
    history.push(`/app/project/${projectId}/deployment/select-type`);
    // message.info(`Activated deployment ${value}`);
  }

  function onSideMenuOpenChange(openKeys) {
    setSideMenuOpenKeys(openKeys);
  }

  function handleMenuClick(e) {
    let selectedKey = e.key;
    if (sideMenuOpenKeys.indexOf(selectedKey)) {
      let filteredKeys = sideMenuOpenKeys.filter(key => key !== selectedKey);
      setSideMenuOpenKeys(filteredKeys);
    } else {
      setSideMenuOpenKeys([...sideMenuOpenKeys, selectedKey]);
    }
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
        <Avatar style={{ backgroundColor: '#8c8c8c', verticalAlign: 'middle' }} size="large">
          {userContext.currentUser ? userContext.currentUser.displayName.charAt(0).toUpperCase() : ""}
        </Avatar>
      </Popover>
    </Menu.Item >
  )

  let manageTenantsMenu;
  if (useValidateUserHasAllRoles(['ROLE_SUPER_ADMIN'])) {
    manageTenantsMenu = (
      <Menu.Item key="manage-tenants" onClick={() => { history.push("/app/manage-tenants"); }} style={{ fontSize: 12 }}>
        <span>
          <Icon type="cluster" />
          <span style={{ fontWeight: 'bold' }}>Tenants</span>
          <Tooltip title="New Tenant">
            <span style={{ float: 'right' }}>
              <Icon type="plus-circle" onClick={(e) => { history.push("/app/create-tenant"); e.stopPropagation(); }} />
            </span>
          </Tooltip>
        </span>
      </Menu.Item>
    );
  } else {
    manageTenantsMenu = null;
  }

  let manageUsersMenu;
  if (useValidateUserHasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN'])) {
    manageUsersMenu = (
      <Menu.Item key="manage-users" onClick={() => { history.push("/app/manage-users"); }} style={{ fontSize: 12 }}>
        <span>
          <Icon type="team" />
          <span style={{ fontWeight: 'bold' }}>Users</span>
          <Tooltip title="New User">
            <span style={{ float: 'right' }}>
              <Icon type="plus-circle" onClick={(e) => { history.push("/app/create-user"); e.stopPropagation(); }} />
            </span>
          </Tooltip>
        </span>
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
        title={<span>
          <Link to={`/app/project/${projectId}/deployments`}
            style={{ fontWeight: 'bold', fontSize: 12 }}
            className="side-menu-link-custom"
            onClick={() => {
              deploymentContext.clearCurrentDeployment();
              setDeploymentId("");
            }}>
            <Icon type="deployment-unit" />
            <span>Deployments</span>
          </Link>
          <span style={{ float: 'right' }} onClick={(e) => { e.stopPropagation(); }}>
            <Tooltip title="New Deployment">
              <Icon type="plus-circle"
                onClick={(e) => {
                  history.push(`/app/project/${projectId}/deployment/select-type`);
                  e.stopPropagation();
                }} />
            </Tooltip>
            <Popover placement="rightBottom" content={<ListProjects />}>
              <Icon type="ordered-list" />
            </Popover>
          </span>
        </span>}
      >
        <Menu.ItemGroup key="active-deployment" title={deploymentId}>
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
        </Menu.ItemGroup>
      </SubMenu>
    );
  } else {
    deploymentView = null;
  }

  let projectView = null;
  if (useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']) === false) {
    projectView = null;
  } else {
    if (projectId) {
      projectView = (
        <SubMenu
          key="project"
          title={<span>
            <Link to="/app/projects"
              style={{ fontWeight: 'bold', fontSize: 12 }}
              className="side-menu-link-custom"
              onClick={() => {
                deploymentContext.clearCurrentDeployment();
                setDeploymentId("");
                projectContext.clearCurrentProject();
                setProjectId("");
              }}>
              <Icon type="project" />
              <span>Projects</span>
            </Link>
            <span style={{ float: 'right' }} onClick={(e) => { e.stopPropagation(); }}>
              <Tooltip title="New Project">
                <Icon type="plus-circle" onClick={(e) => { history.push("/app/project/create"); e.stopPropagation(); }} />
              </Tooltip>
              <Popover placement="rightBottom" content={<ListProjects />}>
                <Icon type="ordered-list" />
              </Popover>
            </span>
          </span>}>
          <Menu.ItemGroup key="active-project" title={projectId}>
            <Menu.Item key="project-general-details" style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
              <Link to={`/app/project/${projectId}/view`}>
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
            {deploymentId ? null :
              <Menu.Item key="deployment" onClick={() => { history.push(`/app/project/${projectId}/deployments`); }}
                style={{ height: '25px', lineHeight: '25px', fontSize: 12 }}>
                <span>
                  <Icon type="deployment-unit" />
                  <span>Deployments</span>
                  {collapsed ? null :
                    <Tooltip title="New Deployment">
                      <span style={{ float: 'right' }}>
                        <Icon type="plus-circle"
                          onClick={(e) => {
                            history.push(`/app/project/${projectId}/deployment/select-type`);
                            e.stopPropagation();
                          }} />
                      </span>
                    </Tooltip>
                  }
                </span>
              </Menu.Item>
            }
          </Menu.ItemGroup>
        </SubMenu>

      );
    } else {
      projectView = (
        <Menu.Item key="project" onClick={() => { history.push("/app/projects"); }} style={{ fontSize: 12 }}>
          <span>
            <Icon type="project" />
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>Projects</span>
            <Tooltip title="New Project">
              <span style={{ float: 'right' }}>
                <Icon type="plus-circle" onClick={(e) => { history.push("/app/project/create"); e.stopPropagation(); }} />
              </span>
            </Tooltip>
          </span>
        </Menu.Item>
      );
    }
  }

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#efefef', padding: '0px' }}>
      <Header theme={"dark"} style={{ height: '48px', padding: '0px' }}>
        <Menu
          mode="horizontal"
          activeKey="Heading"
          theme={"dark"}
        >
          <Menu.Item key="Heading" style={{ fontWeight: 'bold', float: 'left' }}>
            <span style={{ fontSize: 14 }}> <Icon type="thunderbolt" theme="twoTone" twoToneColor="#eb2f96" />Ketchup</span>
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
            onClick={handleMenuClick}
            onOpenChange={onSideMenuOpenChange}
            openKeys={sideMenuOpenKeys}
          >

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
                  <Route path="/" exact render={() => <ProtectedRoute component={Dashboard} />} />
                  <Route path="/app" exact render={() => <ProtectedRoute component={Dashboard} />} />
                  <Route path="/app/dashboard" render={() => <ProtectedRoute component={Dashboard} />} />
                  <Route path="/app/create-tenant" render={() => <ProtectedRoute component={CreateTenant} roles={['ROLE_SUPER_ADMIN']} />} />
                  <Route path="/app/manage-tenants" render={() => <ProtectedRoute component={ManageTenants} roles={['ROLE_SUPER_ADMIN']} />} />
                  <Route path="/app/create-user" render={() => <ProtectedRoute component={CreateUser} roles={['ROLE_SUPER_ADMIN', 'ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
                  <Route path="/app/manage-users" render={() => <ProtectedRoute component={ManageUsers} roles={['ROLE_SUPER_ADMIN', 'ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
                  <Route path="/app/user/:userName/view" render={() => <ProtectedRoute component={ViewUser} />} />
                  <Route path="/app/user/:userName/edit" render={() => <ProtectedRoute component={EditUser} />} />
                  <Route path="/app/user/:userName/roles" render={() => <ProtectedRoute component={ManageRoles} roles={['ROLE_SUPER_ADMIN', 'ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
                  <Route path="/app/project/create" render={() => <ProtectedRoute component={CreateProject} />} />
                  <Route path="/app/projects" render={() => <ProtectedRoute component={ManageProjects} />} />
                  <Route path="/app/project/:projectResourceId/view" render={() => <ProtectedRoute component={ViewProject} />} />
                  <Route path="/app/project/:projectResourceId/edit" render={() => <ProtectedRoute component={EditProject} />} />
                  <Route path="/app/project/:projectResourceId/members" render={() => <ProtectedRoute component={ManageProjectMembers} />} />
                  <Route path="/app/project/:projectResourceId/permissions/:userId?" render={() => <ProtectedRoute component={ManageProjectPermissions} />} />
                  <Route path="/app/project/:projectResourceId/settings/:settingId" render={() => <ProtectedRoute component={ManageSettings} />} />
                  <Route path="/app/project/:projectResourceId/deployments" render={() => <ProtectedRoute component={ManageDeployments} />} />
                  <Route path="/app/project/:projectResourceId/deployment/select-type" render={() => <ProtectedRoute component={DeploymentTypes} />} />
                  <Route path="/app/project/:projectResourceId/deployment/create" render={() => <ProtectedRoute component={CreateDeployment} />} />
                  <Route render={() => <ProtectedRoute component={Nomatch} />} />
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