import React, { useContext } from 'react';
import { Modal, Row, Col } from "antd";
import UserContext from './UserContext';

export function handleApiResponseErrors() {
    console.log("handleApiResponseErrors");
    Modal.error({
        width: 850,
        title: 'Validation Errors:',
        content: (
            <Row type="flex" justify="center" align="middle">
                <Col span={24}>
                    <div>Test</div>
                </Col>
            </Row>
        ),
        onOk() { },
    });
}

export function getApiRequestDefaults() {
    console.log("getApiRequestDefaults");
    // const user = useContext(UserContext);
    // console.log(user);
    // let accessToken = "";
    // if (user.currentUser && user.currentUser.accessToken) {
    //     accessToken = user.currentUser.accessToken
    // }
    // return accessToken;
}

export function validateHasAllPermissions(requiredPermissions, currentPermissions) {
    for (let rp of requiredPermissions) {
        if (currentPermissions.indexOf(rp) == -1) { //indexOf return -1 if element is not present.
            return false;
        }
    }
    return true;
}

export function validateHasAnyPermission(requiredPermissions, currentPermissions) {
    if (requiredPermissions && requiredPermissions.length == 0) {
        return true;
    }
    for (let rp of requiredPermissions) {
        if (currentPermissions.indexOf(rp) > -1) { //indexOf return -1 if element is not present.
            return true;
        }
    }
    return false;
}

export function mapRolesToPermissions(roles) {
    let permissions = [];
    for (let role of roles) {
        if (role === "ROLE_SUPER_ADMIN") {
            permissions.push("create-tenant", "view-tenant", "update-tenant", "delete-tenant", "manage-tenants", "list-all-tenants");
            permissions.push("create-user", "view-user", "update-user", "delete-user", "manage-users", "list-all-users");
        }
        if (role === "ROLE_TENANT_ADMIN") {
            permissions.push("create-user", "view-user", "update-user", "delete-user", "manage-users", "list-all-users");
        }

    }

    //remove duplicates
    permissions = Array.from(new Set(permissions));
    return permissions;
}

export default { handleApiResponseErrors, getApiRequestDefaults, validateHasAllPermissions, validateHasAnyPermission, mapRolesToPermissions };