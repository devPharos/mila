

import React, { createContext, useContext } from 'react';

export const AuthContext = createContext([]);

function AuthProvider({ children }) {
    const user = {
        student: null
    }
    return (
        <AuthContext.Provider value={user}>
            { children }
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context
}

export { AuthProvider, useAuth }