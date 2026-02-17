import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Profile settings
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Password change
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Email change
    const [emailData, setEmailData] = useState({
        newEmail: '',
        password: ''
    });

    // Notifications
    const [notifications, setNotifications] = useState({
        emailReminders: user?.settings?.notifications?.emailReminders || true
    });

    // Feedback
    const [feedback, setFeedback] = useState({
        subject: '',
        message: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.put('/api/users/settings', { ...user?.settings, name: profile.name });
            setMessage('Profile updated successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.put('/api/users/changepassword', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage('Password changed successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        // Basic validation
        if (!emailData.newEmail || !emailData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailData.newEmail)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            console.log('Sending email change request:', {
                newEmail: emailData.newEmail,
                passwordProvided: !!emailData.password
            });

            const response = await axios.put('/api/users/changeemail', {
                newEmail: emailData.newEmail,
                password: emailData.password
            });

            console.log('Email change response:', response.data);

            if (response.data.success) {
                setMessage(response.data.message || 'Email updated successfully');
                setEmailData({ newEmail: '', password: '' });

                // Update the user object in context if you have a method
                if (user) {
                    user.email = emailData.newEmail;
                }
            } else {
                setError(response.data.message || 'Failed to change email');
            }
        } catch (error) {
            console.error('Email change error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });

            // Handle different error responses
            if (error.response) {
                // The request was made and the server responded with an error
                setError(error.response.data?.message ||
                    error.response.data?.error ||
                    `Server error: ${error.response.status}`);
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response from server. Please check if the backend is running.');
            } else {
                // Something happened in setting up the request
                setError('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationsUpdate = async () => {
        setLoading(true);
        try {
            await axios.put('/api/users/settings', {
                ...user?.settings,
                notifications: { emailReminders: notifications.emailReminders }
            });
            setMessage('Notification preferences updated');
        } catch (error) {
            setError('Failed to update notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.post('/api/feedback', feedback);
            setMessage('Feedback sent successfully');
            setFeedback({ subject: '', message: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="settings-container">
                <div className="settings-sidebar">
                    <ul className="settings-nav">
                        <li className={activeTab === 'profile' ? 'active' : ''}>
                            <button onClick={() => setActiveTab('profile')}> Profile</button>
                        </li>
                        <li className={activeTab === 'security' ? 'active' : ''}>
                            <button onClick={() => setActiveTab('security')}> Security</button>
                        </li>
                        <li className={activeTab === 'notifications' ? 'active' : ''}>
                            <button onClick={() => setActiveTab('notifications')}> Notifications</button>
                        </li>
                        <li className={activeTab === 'feedback' ? 'active' : ''}>
                            <button onClick={() => setActiveTab('feedback')}> Feedback</button>
                        </li>
                    </ul>
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-card">
                            <h2>Profile Settings</h2>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="form-control"
                                    />
                                    <small className="form-text">
                                        To change your email, go to Security settings
                                    </small>
                                </div>
                                <button type="submit" className="btn" disabled={loading}>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <>
                            <div className="settings-card">
                                <h2>Change Password</h2>
                                <form onSubmit={handlePasswordChange}>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn" disabled={loading}>
                                        Change Password
                                    </button>
                                </form>
                            </div>

                            <div className="settings-card">
                                <h2>Change Email</h2>
                                <form onSubmit={handleEmailChange}>
                                    <div className="form-group">
                                        <label>New Email</label>
                                        <input
                                            type="email"
                                            value={emailData.newEmail}
                                            onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            value={emailData.password}
                                            onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn" disabled={loading}>
                                        Change Email
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-card">
                            <h2>Notification Settings</h2>
                            <div className="notification-options">
                                <div className="notification-option">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={notifications.emailReminders}
                                            onChange={(e) => {
                                                setNotifications({ emailReminders: e.target.checked });
                                                setTimeout(handleNotificationsUpdate, 100);
                                            }}
                                        />
                                        <span>Email reminders for calendar events</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'feedback' && (
                        <div className="settings-card">
                            <h2>Send Feedback</h2>
                            <p className="feedback-intro">
                                Have suggestions or found a bug? Let us know!
                            </p>
                            <form onSubmit={handleFeedbackSubmit}>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        value={feedback.subject}
                                        onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
                                        className="form-control"
                                        required
                                        placeholder="Brief summary of your feedback"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea
                                        value={feedback.message}
                                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                                        className="form-control"
                                        rows="5"
                                        required
                                        placeholder="Describe your feedback in detail..."
                                    />
                                </div>
                                <button type="submit" className="btn" disabled={loading}>
                                    Send Feedback
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;