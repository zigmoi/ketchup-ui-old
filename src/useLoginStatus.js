import React, { useContext } from 'react';
import UserContext from './UserContext';

//custom hook for login status
function useLoginStatus() {
    console.log("In useLoginStatus");
    const userContext = useContext(UserContext);
    if (userContext && userContext.currentUser) {
        return true;
    } else {
        //if current logged in user (user details and auth token) is present in local storage,
        // get user from local storage to set it in UserContext.
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser);
        if (currentUser) {
            userContext.setCurrentUser(currentUser);
            return true;
        } else {
            return false;
        }
    }
}

export default useLoginStatus;