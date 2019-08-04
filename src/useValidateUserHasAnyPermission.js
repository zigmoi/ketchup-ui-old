import React from 'react';
import useCurrentUser from './useCurrentUser';
import { validateHasAnyPermission } from './Util';

//custom hook for validating if user has required permissions.
function useValidateUserHasAnyPermission(requiredPermissions) {
    console.log("In useValidateUserHasAnyPermissions");
    const currentUser = useCurrentUser();
    if (currentUser && currentUser.permissions) {
        return validateHasAnyPermission(requiredPermissions, currentUser.permissions);
    } else {
        return false;
    }
}

export default useValidateUserHasAnyPermission;