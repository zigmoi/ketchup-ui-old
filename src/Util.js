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

export function validatePermissions(requiredPermissions, currentPermissions) {
    for (let rp of requiredPermissions) {
        if (currentPermissions.indexOf(rp) == -1) {
            return false;
        }
    }
    return true;
}

export default { handleApiResponseErrors, getApiRequestDefaults, validatePermissions };