import React from 'react';
import useCurrentUser from './useCurrentUser';
import { validateHasAllPermissions } from './Util';

//custom hook for validating if user has required permissions.
function useValidateUserHasAllPermissions(requiredPermissions) {
    console.log("In useValidateUserHasAllPermissions");
    const currentUser = useCurrentUser();
    if (currentUser && currentUser.permissions) {
        return validateHasAllPermissions(requiredPermissions, currentUser.permissions);
    } else {
        return false;
    }
}

export default useValidateUserHasAllPermissions;