// client/src/components/auth/Login.js
const React = window.React;
const { useState } = React;
const { useNavigate, Link } = window.ReactRouterDOM;
const axios = window.axios;

function Login({ setIsAuthenticated, setUserRole }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', formData);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.user.role);
                setIsAuthenticated(true);
                setUserRole(response.data.user.role);

                // Redirect based on role
                if (response.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', { className: 'login-container' },
        React.createElement('div', { className: 'login-card' },
            React.createElement('h1', null, 'TailorPro Login'),
            React.createElement('p', { className: 'subtitle' }, 'Manage your tailoring business efficiently'),

            error && React.createElement('div', { className: 'error-message' }, error),

            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'email' }, 'Email'),
                    React.createElement('input', {
                        type: 'email',
                        id: 'email',
                        name: 'email',
                        value: formData.email,
                        onChange: handleChange,
                        required: true,
                        placeholder: 'Enter your email'
                    })
                ),

                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'password' }, 'Password'),
                    React.createElement('input', {
                        type: 'password',
                        id: 'password',
                        name: 'password',
                        value: formData.password,
                        onChange: handleChange,
                        required: true,
                        placeholder: 'Enter your password'
                    })
                ),

                React.createElement('button', {
                    type: 'submit',
                    className: 'btn btn-primary',
                    disabled: loading
                }, loading ? 'Logging in...' : 'Login'),

                React.createElement('div', { className: 'links' },
                    React.createElement(Link, { to: '/forgot-password' }, 'Forgot Password?'),
                    React.createElement('span', null, ' | '),
                    React.createElement(Link, { to: '/signup' }, 'Create Account')
                ),

                React.createElement('div', { className: 'divider' },
                    React.createElement('span', null, 'Or login with')
                ),

                React.createElement('button', {
                        type: 'button',
                        className: 'btn btn-google',
                        onClick: () => alert('Google login would be implemented here')
                    },
                    React.createElement('i', { className: 'fab fa-google' }),
                    ' Google'
                )
            ),

            React.createElement('div', { className: 'trial-notice' },
                React.createElement('i', { className: 'fas fa-info-circle' }),
                ' New users get 30 days free trial!'
            )
        ),

        // Add some inline styles
        React.createElement('style', null, `
            .login-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
            }
            
            .login-card {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 400px;
            }
            
            .login-card h1 {
                color: #333;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .subtitle {
                color: #666;
                text-align: center;
                margin-bottom: 30px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                color: #555;
                font-weight: 500;
            }
            
            .form-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s;
                margin-bottom: 15px;
            }
            
            .btn-primary {
                background-color: #667eea;
                color: white;
            }
            
            .btn-primary:hover {
                background-color: #5a67d8;
            }
            
            .btn-primary:disabled {
                background-color: #a0aec0;
                cursor: not-allowed;
            }
            
            .btn-google {
                background-color: white;
                color: #333;
                border: 1px solid #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .btn-google:hover {
                background-color: #f7fafc;
            }
            
            .links {
                text-align: center;
                margin: 15px 0;
            }
            
            .links a {
                color: #667eea;
                text-decoration: none;
            }
            
            .links a:hover {
                text-decoration: underline;
            }
            
            .divider {
                text-align: center;
                margin: 20px 0;
                color: #999;
                position: relative;
            }
            
            .divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #eee;
                z-index: 1;
            }
            
            .divider span {
                background: white;
                padding: 0 10px;
                position: relative;
                z-index: 2;
            }
            
            .error-message {
                background-color: #fed7d7;
                color: #c53030;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .trial-notice {
                background-color: #ebf8ff;
                color: #2b6cb0;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
            }
            
            .trial-notice i {
                margin-right: 5px;
            }
        `)
    );
}

export default Login;