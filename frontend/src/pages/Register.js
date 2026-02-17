import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, googleLogin } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!agreed) {
            setError('You must agree to the terms and privacy policy');
            return;
        }

        setLoading(true);
        setError('');

        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Registration failed');
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
            setError(result.error || 'Google registration failed');
        }
        setLoading(false);
    };

    const handleGoogleError = () => {
        setError('Google registration failed. Please try again.');
    };

    return (
        <div className="form-container fade-in">
            <h1 className="text-center">Create Account</h1>
            <p className="text-center text-muted">Start your 7-day free trial</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                        minLength="6"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                        minLength="6"
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                        <Link to="/privacy">Privacy Policy</Link>
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <div className="google-login-wrapper">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                />
            </div>

            <div className="form-footer">
                <Link to="/login">Already have an account? Sign In</Link>
            </div>

            <div className="trial-notice">
                <p> 7-days free trial</p>
                <p> No credit card required</p>
            </div>
        </div>
    );
};

export default Register;