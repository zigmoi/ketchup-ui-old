import React, { useContext } from 'react';
import DeploymentContext from './DeploymentContext';

//custom hook to get current deployment.
function useCurrentDeployment() {
    console.log("In useCurrentDeployment");
    const deploymentContext = useContext(DeploymentContext);
    
    if (deploymentContext && deploymentContext.currentDeployment) {
        return deploymentContext.currentDeployment;
    } else {
        //if current deployment is present in local storage set it in DeploymentContext.
        const currentDeployment = JSON.parse(localStorage.getItem('currentDeployment'));
        console.log(currentDeployment);
        if (currentDeployment) {
            deploymentContext.setCurrentDeployment(currentDeployment);
            return currentDeployment;
        } else {
            return null;
        }
    }
}

export default useCurrentDeployment;