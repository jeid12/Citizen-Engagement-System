import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
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
import axios from 'axios';

const validationSchema = Yup.object({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    phoneNumber: Yup.string()
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number format'),
});

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

    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            const { confirmPassword, ...registrationData } = values;
            const response = await axios.post(
                `http://localhost:5000/api/auth/register`,
                registrationData
            );
            setSuccess('Registration successful! Please verify your email with the OTP sent.');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email: values.email } });
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred during registration';
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Register
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
                        {({ values, handleChange, handleBlur, errors, touched }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="firstName"
                                            name="firstName"
                                            label="First Name"
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
                                            label="Last Name"
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
                                    label="Email"
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
                                    label="Password"
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
                                    label="Confirm Password"
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
                                    label="Phone Number"
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
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Register
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 