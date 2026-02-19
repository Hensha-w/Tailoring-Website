import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Protected Pages (User)
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Payment from './pages/Payment';
import Settings from './pages/Settings';

// Protected Pages (Admin)
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPayments from './pages/admin/Payments';
import AdminFeedback from './pages/admin/Feedback';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Loading Component
const LoadingScreen = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading TailorPro...</p>
    </div>
);

// Safe way to get Google Client ID
const getGoogleClientId = () => {
    // Method 1: From Webpack DefinePlugin (production)
    if (typeof GOOGLE_CLIENT_ID !== 'undefined') {
        return GOOGLE_CLIENT_ID;
    }

    // Method 2: From process.env (development with DefinePlugin)
    if (typeof process !== 'undefined' && process.env) {
        return process.env.REACT_APP_GOOGLE_CLIENT_ID ||
            process.env.GOOGLE_CLIENT_ID;
    }

    // Method 3: From window object (if set globally)
    if (typeof window !== 'undefined' && window.GOOGLE_CLIENT_ID) {
        return window.GOOGLE_CLIENT_ID;
    }

    // Method 4: Hardcoded fallback (replace with your actual client ID for testing)
    // IMPORTANT: Replace this with your actual Google Client ID
    return '928819611673-tihpj3k39cgu3cjv47nddvpbkj46nbal.apps.googleusercontent.com';
};

// Main App Content with Authentication Logic
const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className={user?.settings?.darkMode ? 'dark-mode' : ''}>
            <Router>
                {user && <Navbar />}

                <div className="container">
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/login"
                            element={!user ? <Login /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/register"
                            element={!user ? <Register /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/forgotpassword"
                            element={!user ? <ForgotPassword /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/resetpassword/:token"
                            element={!user ? <ResetPassword /> : <Navigate to="/" />}
                        />

                        {/* Legal Pages - Always accessible */}
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />

                        {/* Protected User Routes */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/clients" element={<Clients />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>

                        {/* Protected Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/payments" element={<AdminPayments />} />
                            <Route path="/admin/feedback" element={<AdminFeedback />} />
                        </Route>

                        {/* 404 Page */}
                        <Route
                            path="*"
                            element={
                                <div className="not-found-page">
                                    <div className="not-found-container">
                                        <h1>404</h1>
                                        <h2>Page Not Found</h2>
                                        <p>The page you're looking for doesn't exist or has been moved.</p>
                                        <div className="not-found-actions">
                                            <a href="/" className="btn btn-primary">Go to Dashboard</a>
                                            <a href="/" className="btn btn-secondary">Go Home</a>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

// Main App Component with Providers
function App() {
    const googleClientId = getGoogleClientId();

    // Log for debugging (remove in production)
    console.log('Google Client ID configured:', googleClientId ? 'Yes' : 'No');

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