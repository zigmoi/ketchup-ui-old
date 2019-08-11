import React, { useEffect } from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Nomatch from './Nomatch';
import UserProvider from './UserProvider';
import ProjectProvider from './ProjectProvider';
import useAxiosInterceptor from './useAxiosInterceptor';
import { withRouter } from 'react-router';


function App() {
  const setupAxiosInterceptor = useAxiosInterceptor();
  setupAxiosInterceptor();
  //calling setupAxiosInterceptor as a function directly here causes it to render always 
  //and error message comes multiple times for one request as Home renders multiple times (doesnt mounts but is executed again).
  //calling it as a function in useEffect breaks rules of hooks as setupAxiosInterceptor calls a hook 
  //and hooks should not be used in functions or conditions.
  //Thus creating a useAxiosInterceptor as custom hook which returns a function execute which gets called when Home mounts again. 
  // useEffect(() => {
  //   setupAxiosInterceptor();
  // });

  return (
    <UserProvider>
      <ProjectProvider>
        <div className="App">
          <Switch>
            <Route path="/" exact component={() => <Home />} />
            <Route path="/app" component={() => <Home />} />
            <Route path="/login" component={Login} />
            <Route component={Nomatch} />
          </Switch>
        </div>
      </ProjectProvider>
    </UserProvider>
  );
}

export default App;
