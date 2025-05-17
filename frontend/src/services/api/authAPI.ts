import axios from '../axios';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

interface VerifyOTPData {
    email: string;
    otp: string;
}

const authAPI = {
    login: (data: LoginData) => axios.post('/auth/login', data),
    register: (data: RegisterData) => axios.post('/auth/register', data),
    verifyOTP: (data: VerifyOTPData) => axios.post('/auth/verify-otp', data),
    refreshToken: () => axios.post('/auth/refresh-token'),
    logout: () => axios.post('/auth/logout')
};

export default authAPI; 