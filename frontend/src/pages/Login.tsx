import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Link,
} from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { Link as RouterLink } from 'react-router-dom';

interface LoginValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t('errors.invalidEmail'))
            .required(t('errors.emailRequired')),
        password: Yup.string()
            .required(t('errors.passwordRequired')),
    });

    const handleSubmit = async (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
        try {
            dispatch(loginStart());
            setError(null);
            const response = await authAPI.login(values);
            
            if (response.data.token) {
                dispatch(loginSuccess(response.data));
                navigate('/dashboard');
            } else if (response.data.message.includes('not verified')) {
                navigate('/verify-otp', { state: { email: values.email } });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || t('errors.loginError');
            dispatch(loginFailure(errorMessage));
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {t('auth.login.title')}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {location.state?.message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {location.state.message}
                    </Alert>
                )}

                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
                        <FormikForm>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label={t('auth.login.email')}
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label={t('auth.login.password')}
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                margin="normal"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isSubmitting}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {isSubmitting ? t('auth.login.buttonLoading') : t('auth.login.button')}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2" gutterBottom>
                        {t('auth.login.noAccount')}{' '}
                        <Link component={RouterLink} to="/register">
                            {t('auth.register.title')}
                        </Link>
                    </Typography>
                    <Typography variant="body2">
                        <Link component={RouterLink} to="/forgot-password">
                            {t('auth.forgotPassword.link')}
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login; 