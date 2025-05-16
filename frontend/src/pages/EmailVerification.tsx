import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Button,
    Alert,
} from '@mui/material';
import axios from 'axios';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/verify-email/${token}`
            );
            setStatus('success');
            setMessage('Email verified successfully! You can now log in.');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Error verifying email');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom color="primary">
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
                                onClick={() => navigate('/login')}
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
                                onClick={() => navigate('/register')}
                            >
                                Back to Register
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default EmailVerification; 