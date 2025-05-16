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
    Box,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { complaintAPI } from '../services/api';
import { format } from 'date-fns';

interface Complaint {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    category: {
        name: string;
    };
    agency: {
        name: string;
    };
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    responses: Array<{
        response: string;
        createdAt: string;
        respondedBy: {
            firstName: string;
            lastName: string;
        };
    }>;
}

const AdminComplaints = () => {
    const theme = useTheme();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState('');
    const [newStatus, setNewStatus] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await complaintAPI.getAllAdmin();
            setComplaints(response.data);
        } catch (error: any) {
            console.error('Error fetching complaints:', error);
            setError(error.response?.data?.message || 'Error fetching complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async () => {
        if (!selectedComplaint) return;

        try {
            await complaintAPI.respond(selectedComplaint.id, {
                response: responseText,
                status: newStatus || selectedComplaint.status,
            });
            setOpenDialog(false);
            setResponseText('');
            setNewStatus('');
            fetchComplaints();
        } catch (error: any) {
            console.error('Error responding to complaint:', error);
            setError(error.response?.data?.message || 'Error responding to complaint');
        }
    };

    const handleViewDetails = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setNewStatus(complaint.status);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedComplaint(null);
        setResponseText('');
        setNewStatus('');
        setOpenDialog(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return theme.palette.warning.main;
            case 'in_progress':
                return theme.palette.info.main;
            case 'resolved':
                return theme.palette.success.main;
            case 'rejected':
                return theme.palette.error.main;
            default:
                return theme.palette.grey[500];
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
        const matchesSearch = 
            complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${complaint.user.firstName} ${complaint.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (!user?.role || user.role !== 'admin') {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error">
                    You do not have permission to access this page.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Manage Complaints
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Search Complaints"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title, description, category, agency, or user"
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
            ) : filteredComplaints.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Complaints Found
                    </Typography>
                    <Typography color="text.secondary">
                        There are currently no complaints matching your filters.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Agency</TableCell>
                                <TableCell>Submitted By</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredComplaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.category.name}</TableCell>
                                    <TableCell>{complaint.agency.name}</TableCell>
                                    <TableCell>
                                        {`${complaint.user.firstName} ${complaint.user.lastName}`}
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {complaint.user.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={complaint.status.replace('_', ' ')}
                                            sx={{
                                                bgcolor: getStatusColor(complaint.status),
                                                color: 'white',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetails(complaint)}
                                        >
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedComplaint && (
                    <>
                        <DialogTitle>
                            Manage Complaint: {selectedComplaint.title}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Description:
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {selectedComplaint.description}
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            Category: {selectedComplaint.category.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            Agency: {selectedComplaint.agency.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Previous Responses:
                                </Typography>
                                {selectedComplaint.responses && selectedComplaint.responses.length > 0 ? (
                                    selectedComplaint.responses.map((response, index) => (
                                        <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="body1">
                                                {response.response}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                By {response.respondedBy.firstName} {response.respondedBy.lastName} on{' '}
                                                {format(new Date(response.createdAt), 'MMM dd, yyyy HH:mm')}
                                            </Typography>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No responses yet
                                    </Typography>
                                )}
                            </Box>

                            <TextField
                                select
                                fullWidth
                                label="Update Status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Response"
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Enter your response to the complaint..."
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleResponse}
                                variant="contained"
                                color="primary"
                                disabled={!responseText.trim()}
                            >
                                Submit Response
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default AdminComplaints; 