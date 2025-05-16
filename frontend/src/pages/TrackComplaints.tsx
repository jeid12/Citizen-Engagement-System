import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { complaintAPI } from '../services/api';
import { format } from 'date-fns';

interface Complaint {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    category: { name: string };
    agency: { name: string };
    createdAt: string;
    responses: Array<{
        response: string;
        createdAt: string;
        respondedBy: {
            firstName: string;
            lastName: string;
        };
    }>;
}

const statusColors = {
    pending: 'warning',
    in_progress: 'info',
    resolved: 'success',
    rejected: 'error',
};

const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
};

const TrackComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await complaintAPI.getAll();
            setComplaints(response.data);
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error fetching complaints');
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
    };

    const handleCloseDialog = () => {
        setSelectedComplaint(null);
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
        const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.agency.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" align="center">
                    Track Your Complaints
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Search Complaints"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title, description, category, or agency"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Filter by Status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Agency</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredComplaints.map((complaint) => (
                                    <TableRow key={complaint.id}>
                                        <TableCell>{complaint.title}</TableCell>
                                        <TableCell>{complaint.category.name}</TableCell>
                                        <TableCell>{complaint.agency.name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabels[complaint.status]}
                                                color={statusColors[complaint.status] as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleViewDetails(complaint)}
                                                color="primary"
                                                title="View Details"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredComplaints.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No complaints found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog
                    open={Boolean(selectedComplaint)}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                >
                    {selectedComplaint && (
                        <>
                            <DialogTitle>
                                Complaint Details
                            </DialogTitle>
                            <DialogContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedComplaint.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Submitted on {format(new Date(selectedComplaint.createdAt), 'MMMM dd, yyyy')}
                                    </Typography>
                                    <Chip
                                        label={statusLabels[selectedComplaint.status]}
                                        color={statusColors[selectedComplaint.status] as any}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Box>

                                <Typography variant="subtitle2" gutterBottom>Description:</Typography>
                                <Typography paragraph>{selectedComplaint.description}</Typography>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Category:</Typography>
                                        <Typography>{selectedComplaint.category.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Assigned Agency:</Typography>
                                        <Typography>{selectedComplaint.agency.name}</Typography>
                                    </Grid>
                                </Grid>

                                {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Responses
                                        </Typography>
                                        {selectedComplaint.responses.map((response, index) => (
                                            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                                                <Typography variant="body1">
                                                    {response.response}
                                                </Typography>
                                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                    Responded by {response.respondedBy.firstName} {response.respondedBy.lastName}
                                                    {' '} on {format(new Date(response.createdAt), 'MMM dd, yyyy HH:mm')}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Box>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Close</Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Paper>
        </Container>
    );
};

export default TrackComplaints; 