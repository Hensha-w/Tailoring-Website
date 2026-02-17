import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Payment from './pages/Payment';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPayments from './pages/admin/Payments';
import AdminFeedback from './pages/admin/Feedback';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className={user?.settings?.darkMode ? 'dark-mode' : ''}>
            <Router>
                {user && <Navbar />}
                <main className="container">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                        <Route path="/forgotpassword" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
                        <Route path="/resetpassword/:token" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />

                        {/* Protected User Routes */}
                        <Route path="/" element={<PrivateRoute />}>
                            <Route index element={<Dashboard />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="calendar" element={<Calendar />} />
                            <Route path="payment" element={<Payment />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        {/* Protected Admin Routes */}
                        <Route path="/admin" element={<AdminRoute />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="payments" element={<AdminPayments />} />
                            <Route path="feedback" element={<AdminFeedback />} />
                        </Route>

                        {/* 404 Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </Router>
        </div>
    );
};

function App() {
    // Get Google Client ID from environment variables
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        '';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;