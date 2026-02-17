import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            getCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    const getCurrentUser = async () => {
        try {
            const { data } = await axios.get('/api/users/me');
            setUser(data);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            setError(null);
            return { success: true, user: data.user };
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const googleLogin = async (tokenId) => {
        try {
            const { data } = await axios.post('/api/auth/google', { tokenId });
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            setError(null);
            return { success: true, user: data.user };
        } catch (error) {
            setError(error.response?.data?.message || 'Google login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            setError(null);
            return { success: true, user: data.user };
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    // In your AuthContext.js, update these functions:

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('/api/auth/forgotpassword', { email });
            return {
                success: true,
                message: response.data.message || 'Reset email sent'
            };
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to send reset email'
            };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await axios.put(`/api/auth/resetpassword/${token}`, { password });
            return {
                success: true,
                message: response.data.message || 'Password reset successful'
            };
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to reset password'
            };
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        googleLogin,
        register,
        logout,
        forgotPassword,
        resetPassword
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};