import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import { Container, Typography, Box, Alert, Button, TextField } from '@mui/material';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const token = searchParams.get('token');
    const [inputCode, setInputCode] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!token || !inputCode) {
            setError('Token or code is missing.');
            return;
        }
        setVerifying(true);
        setError('');
        setMessage('');
        try {
            const response = await authService.verifyEmail(token, inputCode);
            setMessage(response.data.message || 'Email verified successfully! You can now log in.');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during email verification.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Email Verification
                </Typography>
                <form onSubmit={handleVerify} style={{ width: '100%' }}>
                    <TextField
                        label="Verification Code"
                        variant="outlined"
                        fullWidth
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                        sx={{ mt: 2 }}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={verifying}
                    >
                        {verifying ? 'Verifying...' : 'Verify Email'}
                    </Button>
                </form>
                {message && (
                    <Box>
                        <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>
                        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
                            Go to Login
                        </Button>
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                )}
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;
