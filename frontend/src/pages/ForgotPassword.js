import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const result = await forgotPassword(email);
        if (result.success) {
            setMessage('Password reset email sent! Check your inbox.');
            setEmail('');
        } else {
            setError(result.error || 'Failed to send reset email');
        }
        setLoading(false);
    };

    return (
        <div className="form-container fade-in">
            <h1 className="text-center">Forgot Password</h1>
            <p className="text-center text-muted">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div className="form-footer">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;