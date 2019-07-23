import React, { useContext } from 'react';
import UserContext from './UserContext';
import { Link } from 'react-router-dom';

function Dashboard1() {
  const user = useContext(UserContext);
  console.log(user);
  return (
    <div>
      Dashboard1:  { user.currentUser? user.currentUser.firstName : "" }
      <Link to="/login">
        <span style={{ fontWeight: 'normal' }}>login</span>
      </Link>
    </div>
  );
}

export default Dashboard1;