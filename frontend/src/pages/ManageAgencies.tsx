import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Box,
    Alert,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { agencyAPI, userAPI } from '../services/api';

interface Agency {
    id: string;
    name: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    website: string;
    jurisdiction: string;
    operatingHours: string;
    isActive: boolean;
    staff: User[];
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const ManageAgencies = () => {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        website: '',
        jurisdiction: '',
        operatingHours: '',
    });

    useEffect(() => {
        fetchAgencies();
        fetchUsers();
    }, []);

    const fetchAgencies = async () => {
        try {
            setLoading(true);
            const response = await agencyAPI.getAll();
            setAgencies(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error fetching agencies');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getAll();
            setUsers(response.data.filter((user: User) => user.role !== 'admin' && user.role !== 'agency_staff'));
        } catch (error: any) {
            console.error('Error fetching users:', error);
        }
    };

    const handleOpenDialog = (agency?: Agency) => {
        if (agency) {
            setSelectedAgency(agency);
            setFormData({
                name: agency.name,
                description: agency.description,
                contactEmail: agency.contactEmail || '',
                contactPhone: agency.contactPhone || '',
                address: agency.address || '',
                website: agency.website || '',
                jurisdiction: agency.jurisdiction || '',
                operatingHours: agency.operatingHours || '',
            });
        } else {
            setSelectedAgency(null);
            setFormData({
                name: '',
                description: '',
                contactEmail: '',
                contactPhone: '',
                address: '',
                website: '',
                jurisdiction: '',
                operatingHours: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAgency(null);
        setFormData({
            name: '',
            description: '',
            contactEmail: '',
            contactPhone: '',
            address: '',
            website: '',
            jurisdiction: '',
            operatingHours: '',
        });
    };

    const handleSubmit = async () => {
        try {
            if (selectedAgency) {
                await agencyAPI.update(selectedAgency.id, formData);
            } else {
                await agencyAPI.create(formData);
            }
            fetchAgencies();
            handleCloseDialog();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error saving agency');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this agency?')) {
            try {
                await agencyAPI.delete(id);
                fetchAgencies();
            } catch (error: any) {
                setError(error.response?.data?.message || 'Error deleting agency');
            }
        }
    };

    const handleOpenAssignDialog = (agency: Agency) => {
        setSelectedAgency(agency);
        setOpenAssignDialog(true);
    };

    const handleAssignUser = async () => {
        if (!selectedAgency || !selectedUser) return;

        try {
            await agencyAPI.assignUser(selectedAgency.id, selectedUser);
            fetchAgencies();
            fetchUsers();
            setOpenAssignDialog(false);
            setSelectedUser('');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error assigning user to agency');
        }
    };

    const handleRemoveUser = async (agencyId: string, userId: string) => {
        if (window.confirm('Are you sure you want to remove this user from the agency?')) {
            try {
                await agencyAPI.removeUser(agencyId, userId);
                fetchAgencies();
                fetchUsers();
            } catch (error: any) {
                setError(error.response?.data?.message || 'Error removing user from agency');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Manage Agencies
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                >
                    Add New Agency
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Staff</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agencies.map((agency) => (
                            <TableRow key={agency.id}>
                                <TableCell>{agency.name}</TableCell>
                                <TableCell>{agency.description}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {agency.contactEmail}<br />
                                        {agency.contactPhone}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {agency.staff?.map((user) => (
                                        <Box key={user.id} display="flex" alignItems="center" mb={1}>
                                            <Typography variant="body2">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveUser(agency.id, user.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Button
                                        startIcon={<PersonAddIcon />}
                                        size="small"
                                        onClick={() => handleOpenAssignDialog(agency)}
                                    >
                                        Assign Staff
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(agency)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(agency.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Agency Form Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedAgency ? 'Edit Agency' : 'Add New Agency'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Phone"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Website"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Jurisdiction"
                                value={formData.jurisdiction}
                                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Operating Hours"
                                value={formData.operatingHours}
                                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedAgency ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign User Dialog */}
            <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
                <DialogTitle>Assign User to Agency</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        label="Select User"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.email})
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleAssignUser}
                        variant="contained"
                        color="primary"
                        disabled={!selectedUser}
                    >
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageAgencies; 