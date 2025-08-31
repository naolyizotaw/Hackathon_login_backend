import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await authService.getCurrentUser(token);
                    setUser(response.data.user);
                } catch (error) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
    };

    const signup = async (username, email, password) => {
        return await authService.signup(username, email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
