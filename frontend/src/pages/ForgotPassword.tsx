import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Box,
    Link
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await authAPI.forgotPassword({ email });
            setSuccess(t('auth.forgotPassword.success'));
            setEmail('');
        } catch (error: any) {
            setError(error.response?.data?.message || t('auth.forgotPassword.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {t('auth.forgotPassword.title')}
                </Typography>

                <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                    {t('auth.forgotPassword.description')}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label={t('auth.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mb: 2 }}
                    >
                        {loading ? t('common.loading') : t('auth.forgotPassword.submit')}
                    </Button>

                    <Box textAlign="center">
                        <Link component={RouterLink} to="/login">
                            {t('auth.backToLogin')}
                        </Link>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default ForgotPassword; 