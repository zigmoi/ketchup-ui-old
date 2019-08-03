import React from 'react';
import useCurrentUser from './useCurrentUser';
import { validatePermissions } from './Util';

//custom hook for validating if user has required permissions.
function useValidateUserPermissions(requiredPermissions) {
    console.log("In useValidateUserPermissions");
    const currentUser = useCurrentUser();
    if (currentUser && currentUser.permissions) {
        return validatePermissions(requiredPermissions, currentUser.permissions);
    } else {
        return false;
    }
}

export default useValidateUserPermissions;