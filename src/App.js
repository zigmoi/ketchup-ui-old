import React from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Nomatch from './Nomatch';
import {UserProvider} from './UserContext.js';
import {ProjectProvider} from './ProjectContext.js'

function App() {
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
