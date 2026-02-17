import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const result = await resetPassword(token, password);
        if (result.success) {
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(result.error || 'Failed to reset password');
        }
        setLoading(false);
    };

    return (
        <div className="form-container fade-in">
            <h1 className="text-center">Reset Password</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                        minLength="6"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        minLength="6"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>

            <div className="form-footer">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
};

export default ResetPassword;