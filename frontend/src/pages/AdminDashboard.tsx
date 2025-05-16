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
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import axios from 'axios';

interface Complaint {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    category: {
        name: string;
    };
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

const AdminDashboard = () => {
    const theme = useTheme();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statistics, setStatistics] = useState({
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
    });
    const token = useSelector((state: any) => state.auth.token);
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }
        fetchComplaints();
    }, [token]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching complaints with token:', token);
            const response = await axios.get(`http://localhost:5000/api/complaints/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Complaints response:', response.data);
            
            // Ensure response.data is an array, if not, set empty array
            const complaintsData = Array.isArray(response.data) ? response.data : [];
            setComplaints(complaintsData);
            
            // Calculate statistics safely
            const stats = complaintsData.reduce((acc: any, complaint: Complaint) => {
                acc.total++;
                if (complaint.status) {
                    acc[complaint.status]++;
                }
                return acc;
            }, {
                total: 0,
                pending: 0,
                in_progress: 0,
                resolved: 0,
                rejected: 0,
            });
            setStatistics(stats);
        } catch (error: any) {
            console.error('Error fetching complaints:', error);
            // Set empty data instead of showing error
            setComplaints([]);
            setStatistics({
                total: 0,
                pending: 0,
                in_progress: 0,
                resolved: 0,
                rejected: 0,
            });
            // Only set error if it's not a 404 (no complaints found)
            if (error.response?.status !== 404) {
                setError(error.response?.data?.message || 'Error fetching complaints');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async () => {
        if (!selectedComplaint) return;

        try {
            await axios.post(
                `http://localhost:5000/api/complaints/${selectedComplaint.id}/respond`,
                {
                    response: responseText,
                    status: selectedComplaint.status,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOpenDialog(false);
            setResponseText('');
            fetchComplaints();
        } catch (error: any) {
            console.error('Error responding to complaint:', error);
            setError(error.response?.data?.message || 'Error responding to complaint');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return theme.palette.warning.main;
            case 'in_progress':
                return theme.palette.primary.main;
            case 'resolved':
                return theme.palette.success.main;
            case 'rejected':
                return theme.palette.error.main;
            default:
                return theme.palette.grey[500];
        }
    };

    if (!user?.role || user.role !== 'admin') {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error">
                    You do not have permission to access this page.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={fetchComplaints}>
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Admin Dashboard
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Complaints
                            </Typography>
                            <Typography variant="h4">{statistics.total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: theme.palette.warning.light }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending
                            </Typography>
                            <Typography variant="h4">{statistics.pending}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: theme.palette.primary.light }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                In Progress
                            </Typography>
                            <Typography variant="h4">{statistics.in_progress}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: theme.palette.success.light }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Resolved
                            </Typography>
                            <Typography variant="h4">{statistics.resolved}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: theme.palette.error.light }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Rejected
                            </Typography>
                            <Typography variant="h4">{statistics.rejected}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Complaints Table */}
            {complaints.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Complaints Found
                    </Typography>
                    <Typography color="text.secondary">
                        There are currently no complaints in the system.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Submitted By</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {complaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.category.name}</TableCell>
                                    <TableCell>
                                        {`${complaint.user.firstName} ${complaint.user.lastName}`}
                                        <Typography variant="caption" display="block" color="textSecondary">
                                            {complaint.user.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(complaint.createdAt).toLocaleDateString()}
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
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setSelectedComplaint(complaint);
                                                setOpenDialog(true);
                                            }}
                                        >
                                            Respond
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Response Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Respond to Complaint</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        {selectedComplaint && (
                            <>
                                <Typography variant="h6">{selectedComplaint.title}</Typography>
                                <Typography color="textSecondary" paragraph>
                                    {selectedComplaint.description}
                                </Typography>
                            </>
                        )}
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            value={selectedComplaint?.status || ''}
                            onChange={(e) => setSelectedComplaint(prev => prev ? {...prev, status: e.target.value as any} : null)}
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
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleResponse} variant="contained" color="primary">
                        Submit Response
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard; 