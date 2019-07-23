import React from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Nomatch from './Nomatch';
import UserProvider from './UserProvider';

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Switch>
          <Route path="/" exact component={() => <Home user={{ "id": "ashim", "roles": "ROLE_ADMIN" }} />} />
          <Route path="/profile" component={() => <Home user={{ "id": "ashim", "roles": "ROLE_ADMIN" }} />} />
          <Route path="/login" component={Login} />
          <Route component={Nomatch} />
        </Switch>
      </div>
    </UserProvider>
  );
}

export default App;
