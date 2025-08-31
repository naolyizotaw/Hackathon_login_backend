import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
