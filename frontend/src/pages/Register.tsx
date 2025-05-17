import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
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
    Grid,
} from '@mui/material';
import { authAPI } from '../services/api';
import { Link as RouterLink } from 'react-router-dom';

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
}

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required(t('auth.register.firstNameRequired'))
            .min(2, t('auth.register.firstNameMin')),
        lastName: Yup.string()
            .required(t('auth.register.lastNameRequired'))
            .min(2, t('auth.register.lastNameMin')),
        email: Yup.string()
            .email(t('errors.invalidEmail'))
            .required(t('errors.emailRequired')),
        password: Yup.string()
            .required(t('errors.passwordRequired'))
            .min(6, t('auth.register.passwordMin'))
            .matches(/[0-9]/, t('auth.register.passwordNumber'))
            .matches(/[A-Z]/, t('auth.register.passwordUppercase')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], t('auth.register.passwordsMatch'))
            .required(t('auth.register.confirmPasswordRequired')),
        phoneNumber: Yup.string()
            .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, t('auth.register.invalidPhone')),
    });

    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            setError(null);
            const { confirmPassword, ...registrationData } = values;
            const response = await authAPI.register(registrationData);
            
            setSuccess(t('auth.register.successMessage'));
            setTimeout(() => {
                navigate('/verify-otp', { state: { email: values.email } });
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || t('auth.register.error');
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {t('auth.register.title')}
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

                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        phoneNumber: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="firstName"
                                        name="firstName"
                                        label={t('auth.register.firstName')}
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.firstName && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        name="lastName"
                                        label={t('auth.register.lastName')}
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.lastName && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label={t('auth.register.email')}
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
                                label={t('auth.register.password')}
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label={t('auth.register.confirmPassword')}
                                type="password"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                id="phoneNumber"
                                name="phoneNumber"
                                label={t('auth.register.phoneNumber')}
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
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
                                {isSubmitting ? t('auth.register.buttonLoading') : t('auth.register.button')}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        {t('auth.haveAccount')}{' '}
                        <Link component={RouterLink} to="/login">
                            {t('auth.login.title')}
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register; 