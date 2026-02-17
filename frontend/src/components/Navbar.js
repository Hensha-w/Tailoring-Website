import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const navItems = user?.role === 'admin' ? [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/payments', label: 'Payments' },
        { path: '/admin/feedback', label: 'Feedback' }
    ] : [
        { path: '/', label: 'Dashboard' },
        { path: '/clients', label: 'Clients' },
        { path: '/calendar', label: 'Calendar' },
        { path: '/payment', label: 'Payment' },
        { path: '/settings', label: 'Settings' }
    ];

    return (
        <nav className={`navbar ${darkMode ? 'navbar-dark' : ''}`}>
            <div className="navbar-container">
                <Link to={user?.role === 'admin' ? '/admin' : '/'} className="nav-brand">
                     TailorPro
                </Link>

                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li key={item.path} className="nav-item">
                            <Link to={item.path} className={isActive(item.path)}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-item">
                        <button onClick={handleLogout} className="nav-link logout-btn">
                            Logout
                        </button>
                    </li>
                </ul>

                <div className="nav-user">
                    <span className="user-name">{user?.name}</span>
                    <span className={`user-role ${user?.role}`}>{user?.role}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;