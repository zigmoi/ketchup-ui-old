import React, {useState} from 'react';

const UserContext = React.createContext({});
export const UserConsumer = UserContext.Consumer;

export function UserProvider(props) {
    const [loggedInUser, setLoggedInUser] = useState(null);

    function setCurrentUser(user) {
        console.log("started setting logged in user:", user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setLoggedInUser(user);
        console.log("setting logged in user complete.")
    }

    function clearCurrentUser() {
        console.log("clear current user started.");
        localStorage.removeItem("currentUser");
        setLoggedInUser(null);
        console.log("clear current user complete.");
    }

    return (
        <UserContext.Provider
            value={{
                currentUser: loggedInUser,
                setCurrentUser: setCurrentUser,
                clearCurrentUser: clearCurrentUser
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;