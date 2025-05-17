import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    Alert,
    useTheme,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { categoryAPI } from '../services/api';
import { useSelector } from 'react-redux';

// Rwanda flag colors
const RWANDA_COLORS = {
    blue: '#00A0DC',   // Blue
    yellow: '#FAD201', // Yellow
    green: '#00B140'   // Green
};

interface Category {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

const Categories = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useSelector((state: any) => state.auth);
    const isAdmin = user?.role === 'admin';
    const [categories, setCategories] = useState<Category[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getCategories();
            setCategories(response.data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('categories.messages.error');
            setError(errorMessage);
            console.error('Error fetching categories:', error);
        }
    };

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                isActive: category.isActive
            });
        } else {
            setSelectedCategory(null);
            setFormData({ name: '', description: '', isActive: true });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
        setFormData({ name: '', description: '', isActive: true });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.name.trim()) {
                setError(t('categories.messages.nameRequired'));
                return;
            }

            if (formData.name.length > 100) {
                setError(t('categories.messages.nameTooLong'));
                return;
            }

            if (formData.description && formData.description.length > 500) {
                setError(t('categories.messages.descriptionTooLong'));
                return;
            }

            if (selectedCategory) {
                await categoryAPI.updateCategory(selectedCategory.id, formData);
                setSuccess(t('categories.messages.updateSuccess'));
            } else {
                await categoryAPI.createCategory(formData);
                setSuccess(t('categories.messages.addSuccess'));
            }
            fetchCategories();
            handleCloseDialog();
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('categories.messages.error');
            setError(errorMessage);
            console.error('Error submitting category:', error);
        }
    };

    const handleDelete = async (category: Category) => {
        try {
            await categoryAPI.deleteCategory(category.id);
            setSuccess(t('categories.messages.deleteSuccess'));
            fetchCategories();
            setDeleteConfirmOpen(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('categories.messages.error');
            setError(errorMessage);
            console.error('Error deleting category:', error);
        }
    };

    const handleToggleStatus = async (category: Category) => {
        try {
            await categoryAPI.toggleStatus(category.id);
            fetchCategories();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('categories.messages.error');
            setError(errorMessage);
            console.error('Error toggling category status:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" color={RWANDA_COLORS.blue}>
                        {t('categories.title')}
                    </Typography>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                backgroundColor: RWANDA_COLORS.green,
                                '&:hover': {
                                    backgroundColor: RWANDA_COLORS.green + 'dd'
                                }
                            }}
                        >
                            {t('categories.addCategory')}
                        </Button>
                    )}
                </Box>

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

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: RWANDA_COLORS.blue + '10' }}>
                                <TableCell>{t('categories.labels.name')}</TableCell>
                                <TableCell>{t('categories.labels.description')}</TableCell>
                                <TableCell>{t('categories.labels.status')}</TableCell>
                                {isAdmin && <TableCell align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={category.isActive}
                                            onChange={() => handleToggleStatus(category)}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: RWANDA_COLORS.green
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: RWANDA_COLORS.green
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => handleOpenDialog(category)}
                                                sx={{ color: RWANDA_COLORS.blue }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setDeleteConfirmOpen(true);
                                                }}
                                                sx={{ color: theme.palette.error.main }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: RWANDA_COLORS.blue }}>
                        {selectedCategory ? t('categories.editCategory') : t('categories.addCategory')}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('categories.labels.name')}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label={t('categories.labels.description')}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>{t('actions.cancel')}</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                backgroundColor: RWANDA_COLORS.green,
                                '&:hover': {
                                    backgroundColor: RWANDA_COLORS.green + 'dd'
                                }
                            }}
                        >
                            {selectedCategory ? t('categories.editCategory') : t('categories.addCategory')}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                    <DialogTitle>{t('categories.deleteCategory')}</DialogTitle>
                    <DialogContent>
                        <Typography>{t('categories.confirmDelete')}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)}>{t('actions.cancel')}</Button>
                        <Button
                            onClick={() => selectedCategory && handleDelete(selectedCategory)}
                            color="error"
                            variant="contained"
                        >
                            {t('categories.deleteCategory')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default Categories; 