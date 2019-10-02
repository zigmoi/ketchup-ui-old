import React, { Component } from 'react';
import UserContext from './UserContext';

class UserProvider extends Component {
    state = {
        currentUser: null,
    }

    setCurrentUser = (user) => {
        console.log("started setting logged in user:", user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.setState({ currentUser: user });
        console.log("setting logged in user complete.")
    }

    clearCurrentUser = () => {
        console.log("clear current user started.");
        localStorage.removeItem("currentUser");
        this.setState({ currentUser: null });
        console.log("clear current user complete.");
    }


    render() {
        return (
            <UserContext.Provider
                value={{
                    currentUser: this.state.currentUser,
                    setCurrentUser: this.setCurrentUser,
                    clearCurrentUser: this.clearCurrentUser
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }

}

export default UserProvider;