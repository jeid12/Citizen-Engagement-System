import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    Alert,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface Category {
    id: string;
    name: string;
}

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(20, 'Description must be at least 20 characters')
        .max(1000, 'Description must not exceed 1000 characters'),
    categoryId: Yup.string()
        .required('Category is required'),
    location: Yup.string()
        .optional(),
});

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const token = useSelector((state: any) => state.auth.token);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/complaints/categories`
            );
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setError(null);
        setUploading(true);

        try {
            // Upload files first if any
            const attachments: string[] = [];
            if (files.length > 0) {
                for (const file of files) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const uploadResponse = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/upload`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    attachments.push(uploadResponse.data.url);
                }
            }

            // Submit complaint with attachments
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/complaints/submit`,
                {
                    ...values,
                    attachments,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess(true);
            setTimeout(() => {
                navigate('/track-complaints');
            }, 2000);
        } catch (error: any) {
            console.error('Error submitting complaint:', error);
            setError(error.response?.data?.message || 'Error submitting complaint');
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom color="primary">
                        Submit a Complaint
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Complaint submitted successfully! Redirecting...
                        </Alert>
                    )}

                    <Formik
                        initialValues={{
                            title: '',
                            description: '',
                            categoryId: '',
                            location: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched }) => (
                            <Form>
                                <TextField
                                    fullWidth
                                    name="title"
                                    label="Title"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.title && Boolean(errors.title)}
                                    helperText={touched.title && errors.title}
                                    margin="normal"
                                />

                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                    margin="normal"
                                />

                                <TextField
                                    fullWidth
                                    select
                                    name="categoryId"
                                    label="Category"
                                    value={values.categoryId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.categoryId && Boolean(errors.categoryId)}
                                    helperText={touched.categoryId && errors.categoryId}
                                    margin="normal"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    name="location"
                                    label="Location (Optional)"
                                    value={values.location}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.location && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    margin="normal"
                                />

                                <Box sx={{ mt: 2, mb: 2 }}>
                                    <input
                                        accept="image/*,.pdf,.doc,.docx"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Upload Attachments
                                        </Button>
                                    </label>

                                    {files.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Attached Files:
                                            </Typography>
                                            {files.map((file, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {file.name}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeFile(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={uploading}
                                    sx={{ mt: 2 }}
                                >
                                    {uploading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        'Submit Complaint'
                                    )}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </Container>
    );
};

export default SubmitComplaint; 