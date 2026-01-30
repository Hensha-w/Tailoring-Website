// client/src/app.js
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/tailor/Dashboard';
import Clients from './components/tailor/Clients';
import Calendar from './components/tailor/Calendar';
import Payment from './components/tailor/Payment';
import Settings from './components/tailor/Settings';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/Users';
import AdminPayments from './components/admin/Payments';
import AdminFeedback from './components/admin/Feedback';

// Main App Component
function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [userRole, setUserRole] = React.useState(null);

    // Check authentication on mount
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    const PrivateRoute = ({ children, requiredRole }) => {
        if (!isAuthenticated) {
            return React.createElement(Navigate, { to: '/login' });
        }
        if (requiredRole && userRole !== requiredRole) {
            return React.createElement(Navigate, { to: userRole === 'admin' ? '/admin' : '/dashboard' });
        }
        return children;
    };

    return React.createElement(Router, null,
        React.createElement(Routes, null,
            // Public Routes
            React.createElement(Route, { path: '/login', element: React.createElement(Login, { setIsAuthenticated, setUserRole }) }),
            React.createElement(Route, { path: '/signup', element: React.createElement(SignUp) }),
            React.createElement(Route, { path: '/forgot-password', element: React.createElement(ForgotPassword) }),

            // Tailor Routes
            React.createElement(Route, { path: '/dashboard', element:
                    React.createElement(PrivateRoute, { requiredRole: 'tailor' },
                        React.createElement(Dashboard)
                    )
            }),
            React.createElement(Route, { path: '/clients', element:
                    React.createElement(PrivateRoute, { requiredRole: 'tailor' },
                        React.createElement(Clients)
                    )
            }),
            React.createElement(Route, { path: '/calendar', element:
                    React.createElement(PrivateRoute, { requiredRole: 'tailor' },
                        React.createElement(Calendar)
                    )
            }),
            React.createElement(Route, { path: '/payment', element:
                    React.createElement(PrivateRoute, { requiredRole: 'tailor' },
                        React.createElement(Payment)
                    )
            }),
            React.createElement(Route, { path: '/settings', element:
                    React.createElement(PrivateRoute, { requiredRole: 'tailor' },
                        React.createElement(Settings)
                    )
            }),

            // Admin Routes
            React.createElement(Route, { path: '/admin', element:
                    React.createElement(PrivateRoute, { requiredRole: 'admin' },
                        React.createElement(AdminDashboard)
                    )
            }),
            React.createElement(Route, { path: '/admin/users', element:
                    React.createElement(PrivateRoute, { requiredRole: 'admin' },
                        React.createElement(AdminUsers)
                    )
            }),
            React.createElement(Route, { path: '/admin/payments', element:
                    React.createElement(PrivateRoute, { requiredRole: 'admin' },
                        React.createElement(AdminPayments)
                    )
            }),
            React.createElement(Route, { path: '/admin/feedback', element:
                    React.createElement(PrivateRoute, { requiredRole: 'admin' },
                        React.createElement(AdminFeedback)
                    )
            }),

            // Default Route
            React.createElement(Route, { path: '/', element:
                    React.createElement(Navigate, { to: isAuthenticated ? (userRole === 'admin' ? '/admin' : '/dashboard') : '/login' })
            })
        )
    );
}

// Render the app
render(React.createElement(App), document.getElementById('root'));