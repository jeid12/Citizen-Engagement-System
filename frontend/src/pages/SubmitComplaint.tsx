import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { complaintAPI } from '../services/api';
import { addComplaint } from '../store/slices/complaintSlice';

interface Category {
    id: string;
    name: string;
}

interface Agency {
    id: string;
    name: string;
    description?: string;
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
    agencyId: Yup.string()
        .required('Agency is required'),
    location: Yup.string()
        .optional(),
});

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState<Category[]>([]);
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchAgencies();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await complaintAPI.getCategories();
            setCategories(response.data);
        } catch (error: any) {
            setError('Error fetching categories. Please try again later.');
            console.error('Error fetching categories:', error);
        }
    };

    const fetchAgencies = async () => {
        try {
            const response = await complaintAPI.getAgencies();
            setAgencies(response.data);
        } catch (error: any) {
            setError('Error fetching agencies. Please try again later.');
            console.error('Error fetching agencies:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleFileDelete = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            setError(null);
            setUploading(true);

            // First, upload files if any
            let attachments: string[] = [];
            if (files.length > 0) {
                // Here you would implement file upload logic
                // For now, we'll just store the file names
                attachments = files.map(file => file.name);
            }

            const complaintData = {
                ...values,
                attachments,
            };

            const response = await complaintAPI.create(complaintData);
            dispatch(addComplaint(response.data));
            navigate('/track-complaints');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error submitting complaint');
            console.error('Error submitting complaint:', error);
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" align="center">
                    Submit a Complaint
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Formik
                    initialValues={{
                        title: '',
                        description: '',
                        categoryId: '',
                        agencyId: '',
                        location: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            <TextField
                                fullWidth
                                id="title"
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
                                id="description"
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
                                id="categoryId"
                                name="categoryId"
                                select
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
                                id="agencyId"
                                name="agencyId"
                                select
                                label="Responsible Agency"
                                value={values.agencyId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.agencyId && Boolean(errors.agencyId)}
                                helperText={touched.agencyId && errors.agencyId}
                                margin="normal"
                            >
                                {agencies.map((agency) => (
                                    <MenuItem key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                id="location"
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
                                        <Typography variant="subtitle1" gutterBottom>
                                            Attached Files:
                                        </Typography>
                                        {files.map((file, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ flex: 1 }}>
                                                    {file.name}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => handleFileDelete(index)}
                                                    size="small"
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
                                fullWidth
                                size="large"
                                disabled={loading || uploading}
                                sx={{ mt: 2 }}
                            >
                                {(loading || uploading) ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Submit Complaint'
                                )}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};

export default SubmitComplaint; 