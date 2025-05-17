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
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPassword = () => {
    const { t } = useTranslation();
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError(t('auth.resetPassword.passwordMismatch'));
            setLoading(false);
            return;
        }

        try {
            await authAPI.resetPassword({ token, newPassword });
            // Show success message and redirect to login
            navigate('/login', { state: { message: t('auth.resetPassword.success') } });
        } catch (error: any) {
            setError(error.response?.data?.message || t('auth.resetPassword.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {t('auth.resetPassword.title')}
                </Typography>

                <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                    {t('auth.resetPassword.description')}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label={t('auth.newPassword')}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label={t('auth.confirmPassword')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? t('common.loading') : t('auth.resetPassword.submit')}
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

export default ResetPassword; 