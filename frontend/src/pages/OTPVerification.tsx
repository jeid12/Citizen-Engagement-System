import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

const validationSchema = Yup.object({
    otp: Yup.string()
        .required('OTP is required')
        .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Get email from location state
    const email = location.state?.email;

    if (!email) {
        navigate('/register');
        return null;
    }

    const handleSubmit = async (values: { otp: string }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
                {
                    email,
                    otp: values.otp,
                }
            );

            setSuccess('Email verified successfully!');
            dispatch(loginSuccess(response.data));

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error verifying OTP';
            setError(errorMessage);
        }
    };

    const handleResendOTP = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, { email });
            setSuccess('New OTP has been sent to your email');
            setError(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error resending OTP';
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Verify Your Email
                    </Typography>

                    <Typography align="center" color="textSecondary" paragraph>
                        Please enter the 6-digit code sent to {email}
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
                        initialValues={{ otp: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched }) => (
                            <Form>
                                <TextField
                                    fullWidth
                                    id="otp"
                                    name="otp"
                                    label="Verification Code"
                                    value={values.otp}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.otp && Boolean(errors.otp)}
                                    helperText={touched.otp && errors.otp}
                                    margin="normal"
                                    inputProps={{
                                        maxLength: 6,
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Verify Email
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleResendOTP}
                            sx={{ textDecoration: 'none' }}
                        >
                            Didn't receive the code? Resend OTP
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default OTPVerification; 