import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Login failed');
        }
        setLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');

        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Google login failed');
        }
        setLoading(false);
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="form-container fade-in">
            <h1 className="text-center">Welcome Back</h1>
            <p className="text-center text-muted">Sign in to your account</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
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

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <div className="google-login-wrapper">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                />
            </div>

            <div className="form-footer">
                <Link to="/forgotpassword">Forgot Password?</Link>
                <Link to="/register">Don't have an account? Sign Up</Link>
            </div>
        </div>
    );
};

export default Login;