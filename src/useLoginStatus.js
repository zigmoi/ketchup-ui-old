import React, { useContext } from 'react';
import UserContext from './UserContext';
import useCurrentUser from './useCurrentUser';

//custom hook for login status
function useLoginStatus() {
    console.log("In useLoginStatus");
    const userContext = useContext(UserContext);
    const currentUser = useCurrentUser();
    if (currentUser) {
        return true;
    } else {
       return false;
    }
}

export default useLoginStatus;