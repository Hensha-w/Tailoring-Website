// frontend/src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoogleLogin } from 'react-google-login';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
    Container, Paper, Typography, TextField, Button,
    Box, Divider, Grid, InputAdornment
} from '@mui/material';
import { Email, Lock, Google } from '@mui/icons-material';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required')
});

const Login = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setIsLoading(true);
            await login(values.email, values.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            await googleLogin(response.tokenId);
            toast.success('Logged in with Google');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Google login failed');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                        TailorCraft
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Sign in to your account
                    </Typography>
                </Box>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={<ErrorMessage name="email" />}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        variant="outlined"
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={<ErrorMessage name="password" />}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={isLoading || isSubmitting}
                                        sx={{
                                            bgcolor: 'primary.mid',
                                            '&:hover': { bgcolor: 'primary.dark' }
                                        }}
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>

                <Box sx={{ my: 3 }}>
                    <Divider>
                        <Typography variant="body2" color="textSecondary">
                            OR
                        </Typography>
                    </Divider>
                </Box>

                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Continue with Google"
                    onSuccess={handleGoogleSuccess}
                    onFailure={(error) => toast.error('Google login failed')}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => (
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={renderProps.onClick}
                            startIcon={<Google />}
                            sx={{ mb: 2 }}
                        >
                            Continue with Google
                        </Button>
                    )}
                />

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">
                            Forgot password?
                        </Typography>
                    </Link>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ textDecoration: 'none' }}>
                            <Typography component="span" color="primary" fontWeight="bold">
                                Sign up
                            </Typography>
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;