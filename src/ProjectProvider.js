import React, { Component } from 'react';
import ProjectContext from './ProjectContext';

class ProjectProvider extends Component {
    state = {
        currentProject: null,
    }

    setCurrentProject = (project) => {
        console.log("setting current project.")
        console.log(project);
        this.setState({ currentProject: project });
        localStorage.setItem('currentProject', JSON.stringify(project));
        console.log("setting current project complete.")
    }

    clearCurrentProject = () => {
        console.log("clearing current project")
        this.setState({ currentProject: null });
        localStorage.removeItem("currentProject");
    }


    render() {
        return (
            <ProjectContext.Provider
                value={{
                    currentProject: this.state.currentProject,
                    setCurrentProject: this.setCurrentProject,
                    clearCurrentProject: this.clearCurrentProject
                }}
            >
                {this.props.children}
            </ProjectContext.Provider>
        );
    }

}

export default ProjectProvider;