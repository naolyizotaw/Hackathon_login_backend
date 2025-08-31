import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const SignupPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await signup(values.username, values.email, values.password);
                setMessage(response.data.message || 'Signup successful! Please check your email to verify your account.');
                setError('');
                //setTimeout(() => navigate('/login'), 5000); // Redirect to login after 5s
                const { token } = response.data;
                setTimeout(() => navigate(`/verify-email?token=${token}`), 5000); // Redirect to verify email with token after 5s
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred during signup.');
                setMessage('');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formik.isSubmitting}
                    >
                        Sign Up
                    </Button>
                    <Link to="/login" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default SignupPage;
