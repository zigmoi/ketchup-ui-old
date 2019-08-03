import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useLoginStatus from './useLoginStatus';
import useValidateUserPermissions from './useValidateUserPermissions';
import AccessDenied from './AccessDenied';

function ProtectedRoute({ component: Component, permissions: permissions, ...rest }) {
    console.log("In protected route");
    const loginStatus = useLoginStatus();
    console.log(permissions);
    let requiredPermissions = permissions || [];
    let hasPermissions = useValidateUserPermissions(requiredPermissions);
    console.log("hasPermissions", hasPermissions);


    let AuthenticatedView;
    if (loginStatus) {
        if (hasPermissions) {
            AuthenticatedView = (
                <Component {...rest} />
            );
        } else {
            AuthenticatedView = (
                <AccessDenied {...rest} />
            );
        }
    } else {
        AuthenticatedView = (
            <Redirect to={{ pathname: "/login", state: { from: rest.location } }} />
        );
    }


    return (
        <Route
            {...rest}
            render={props => AuthenticatedView
            }
        />
    );
}

export default ProtectedRoute;