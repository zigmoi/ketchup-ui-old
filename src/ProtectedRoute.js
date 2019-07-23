import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useLoginStatus from './useLoginStatus';

function ProtectedRoute({ component: Component, ...rest }) {
    console.log("In protected route");
    const loginStatus = useLoginStatus();
    return (
        <Route
            {...rest}
            render={props =>
                loginStatus ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

export default ProtectedRoute;