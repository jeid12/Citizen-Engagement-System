import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import axios from 'axios';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/verify-email/${token}`
                );
                setStatus('success');
                setMessage('Email verified successfully! You can now log in.');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to verify email');
            }
        };

        verifyEmail();
    }, [searchParams]);

    const handleNavigate = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Email Verification
                    </Typography>

                    {status === 'loading' && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {status === 'success' && (
                        <>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {message}
                            </Alert>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNavigate}
                                fullWidth
                            >
                                Go to Login
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {message}
                            </Alert>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNavigate}
                                fullWidth
                            >
                                Go to Login
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default VerifyEmail; 