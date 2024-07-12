import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        // Retrieve user ID from local storage
        const storedUserID = localStorage.getItem('userID');
        if (storedUserID) {
            setUserID(storedUserID);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userID, setUserID }}>
            {children}
        </UserContext.Provider>
    );
};
