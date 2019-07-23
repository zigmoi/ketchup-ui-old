import React, { Component } from 'react';
import UserContext from './UserContext';

class UserProvider extends Component {
    state = {
        currentUser: null,
    }

    setCurrentUser = (user) => {
        console.log("setting logged in user.")
        console.log(user);
        this.setState({ currentUser: user });
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log("setting logged in user complete.")
    }

    clearCurrentUser = () => {
        console.log("logout")
        this.setState({ currentUser: null });
        localStorage.removeItem("currentUser");
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