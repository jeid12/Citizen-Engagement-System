import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

export const registerSchema = Yup.object({
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
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number format')
        .optional(),
});

export const complaintSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(20, 'Description must be at least 20 characters')
        .max(1000, 'Description must not exceed 1000 characters'),
    location: Yup.string()
        .optional()
        .min(5, 'Location must be at least 5 characters')
        .max(200, 'Location must not exceed 200 characters'),
    categoryId: Yup.string()
        .required('Category is required'),
});

export const complaintUpdateSchema = Yup.object({
    status: Yup.string()
        .oneOf(['pending', 'in_progress', 'resolved', 'rejected'], 'Invalid status')
        .optional(),
    response: Yup.string()
        .optional()
        .min(10, 'Response must be at least 10 characters')
        .max(500, 'Response must not exceed 500 characters'),
    agencyId: Yup.string()
        .optional(),
}); 