import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Alert,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import { agencyAPI, userAPI } from '../services/api';

interface Agency {
    id: string;
    name: string;
    description: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    website?: string;
    jurisdiction?: string;
    operatingHours?: string;
    isActive: boolean;
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
    const [openStaffDialog, setOpenStaffDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [agencyStaff, setAgencyStaff] = useState<User[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        website: '',
        jurisdiction: '',
        operatingHours: '',
        isActive: true,
    } as {
        name: string;
        description: string;
        contactEmail?: string;
        contactPhone?: string;
        address?: string;
        website?: string;
        jurisdiction?: string;
        operatingHours?: string;
        isActive: boolean;
    });

    useEffect(() => {
        fetchAgencies();
        fetchUsers();
    }, []);

    const fetchAgencies = async () => {
        try {
            const response = await agencyAPI.getAll();
            setAgencies(response.data);
        } catch (err) {
            setError('Failed to fetch agencies');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getAll();
            setUsers(response.data.filter((user: User) => 
                user.role === 'user' || user.role === 'agency_staff'
            ));
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    const fetchAgencyStaff = async (agencyId: string) => {
        try {
            const response = await agencyAPI.getStaff(agencyId);
            setAgencyStaff(response.data);
        } catch (err) {
            setError('Failed to fetch agency staff');
        }
    };

    const handleOpenDialog = (agency?: Agency) => {
        if (agency) {
            setSelectedAgency(agency);
            setFormData(agency);
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
                isActive: true,
            });
        }
        setOpenDialog(true);
    };

    const handleOpenStaffDialog = async (agency: Agency) => {
        setSelectedAgency(agency);
        await fetchAgencyStaff(agency.id);
        setOpenStaffDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenStaffDialog(false);
        setSelectedAgency(null);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (selectedAgency) {
                await agencyAPI.update(selectedAgency.id, formData);
                setSuccess('Agency updated successfully');
            } else {
                await agencyAPI.create(formData);
                setSuccess('Agency created successfully');
            }
            fetchAgencies();
            setTimeout(handleCloseDialog, 1500);
        } catch (err) {
            setError('Failed to save agency');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this agency?')) {
            try {
                await agencyAPI.delete(id);
                setSuccess('Agency deleted successfully');
                fetchAgencies();
            } catch (err) {
                setError('Failed to delete agency');
            }
        }
    };

    const handleAssignStaff = async (userId: string) => {
        if (!selectedAgency) return;
        try {
            await agencyAPI.assignUser(selectedAgency.id, userId);
            await userAPI.updateRole(userId, 'agency_staff');
            setSuccess('User assigned to agency successfully');
            await fetchAgencyStaff(selectedAgency.id);
            fetchUsers();
        } catch (err) {
            setError('Failed to assign user to agency');
        }
    };

    const handleRemoveStaff = async (userId: string) => {
        if (!selectedAgency) return;
        try {
            await agencyAPI.removeUser(selectedAgency.id, userId);
            await userAPI.updateRole(userId, 'user');
            setSuccess('User removed from agency successfully');
            await fetchAgencyStaff(selectedAgency.id);
            fetchUsers();
        } catch (err) {
            setError('Failed to remove user from agency');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Manage Agencies
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Agency
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agencies.map((agency) => (
                            <TableRow 
                                key={agency.id}
                                sx={{ 
                                    opacity: agency.isActive ? 1 : 0.5,
                                    backgroundColor: agency.isActive ? 'inherit' : 'action.hover'
                                }}
                            >
                                <TableCell>{agency.name}</TableCell>
                                <TableCell>{agency.description}</TableCell>
                                <TableCell>
                                    {agency.contactEmail}<br />
                                    {agency.contactPhone}
                                </TableCell>
                                <TableCell>{agency.address}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={agency.isActive ? 'Active' : 'Inactive'}
                                        color={agency.isActive ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpenDialog(agency)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleOpenStaffDialog(agency)}
                                        color="primary"
                                        disabled={!agency.isActive}
                                    >
                                        <GroupIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(agency.id)}
                                        color="error"
                                    >
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
                    {selectedAgency ? 'Edit Agency' : 'Add Agency'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contact Email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Contact Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Jurisdiction"
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Operating Hours"
                        name="operatingHours"
                        value={formData.operatingHours}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                name="isActive"
                            />
                        }
                        label="Agency Active"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedAgency ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Staff Management Dialog */}
            <Dialog open={openStaffDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Manage Staff - {selectedAgency?.name}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Current Staff</Typography>
                    <List>
                        {agencyStaff.map((staff) => (
                            <ListItem key={staff.id}>
                                <ListItemText
                                    primary={`${staff.firstName} ${staff.lastName}`}
                                    secondary={staff.email}
                                />
                                <ListItemSecondaryAction>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveStaff(staff.id)}
                                    >
                                        Remove
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Available Users</Typography>
                    <List>
                        {users
                            .filter(user => !agencyStaff.some(staff => staff.id === user.id))
                            .map((user) => (
                                <ListItem key={user.id}>
                                    <ListItemText
                                        primary={`${user.firstName} ${user.lastName}`}
                                        secondary={user.email}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleAssignStaff(user.id)}
                                        >
                                            Assign
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageAgencies; 