import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface LoginValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
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
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        {t('auth.login.title')}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
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

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link href="/register" variant="body2">
                            {t('auth.login.noAccount')}
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 