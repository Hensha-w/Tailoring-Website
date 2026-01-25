import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/tailor/Dashboard';
import Clients from './pages/tailor/Clients';
import ClientDetails from './pages/tailor/ClientDetails';
import Calendar from './pages/tailor/Calendar';
import Payments from './pages/tailor/Payments';
import Settings from './pages/tailor/Settings';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPayments from './pages/admin/Payments';
import AdminFeedback from './pages/admin/Feedback';

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Toaster position="top-right" />
              <Routes>
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Route>

                {/* Tailor Routes */}
                <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetails />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/feedback" element={<AdminFeedback />} />
                </Route>

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
  );
}

export default App;