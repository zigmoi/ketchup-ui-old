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

export function validateHasAllRoles(requiredRoles, currentRoles) {
    for (let rr of requiredRoles) {
        if (currentRoles.indexOf(rr) == -1) { //indexOf return -1 if element is not present.
            return false;
        }
    }
    return true;
}

export function validateHasAnyRole(requiredRoles, currentRoles) {
    if (requiredRoles && requiredRoles.length == 0) {
        return true;
    }
    for (let rr of requiredRoles) {
        if (currentRoles.indexOf(rr) > -1) { //indexOf return -1 if element is not present.
            return true;
        }
    }
    return false;
}

export default { handleApiResponseErrors, getApiRequestDefaults, validateHasAnyRole, validateHasAllRoles };

