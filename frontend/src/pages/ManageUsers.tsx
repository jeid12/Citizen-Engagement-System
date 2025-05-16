import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
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
    MenuItem,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { userAPI } from '../services/api';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'citizen' | 'admin' | 'agency_staff';
    isEmailVerified: boolean;
    createdAt: string;
}

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const currentUser = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userAPI.getAll();
            setUsers(response.data);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setError(error.response?.data?.message || 'Failed to fetch users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!selectedUser) return;

        try {
            setUpdateLoading(true);
            setError(null);
            await userAPI.updateRole(selectedUser.id, selectedUser.role);
            setOpenDialog(false);
            await fetchUsers(); // Refresh the list
        } catch (error: any) {
            console.error('Error updating user role:', error);
            setError(error.response?.data?.message || 'Failed to update user role. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Manage Users
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'admin' ? 'error' : user.role === 'agency_staff' ? 'warning' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isEmailVerified ? 'Verified' : 'Unverified'}
                                        color={user.isEmailVerified ? 'success' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {user.id !== currentUser.id && (
                                        <IconButton
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setOpenDialog(true);
                                            }}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => !updateLoading && setOpenDialog(false)}>
                <DialogTitle>Update User Role</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            value={selectedUser.role}
                            onChange={(e) => setSelectedUser(prev => prev ? {...prev, role: e.target.value as any} : null)}
                            margin="normal"
                            disabled={updateLoading}
                        >
                            <MenuItem value="citizen">Citizen</MenuItem>
                            <MenuItem value="agency_staff">Agency Staff</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} disabled={updateLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateRole} 
                        variant="contained" 
                        color="primary"
                        disabled={updateLoading}
                    >
                        {updateLoading ? 'Updating...' : 'Update Role'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageUsers; 