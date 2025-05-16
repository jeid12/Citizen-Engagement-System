import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Chip,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

interface ComplaintResponse {
    id: string;
    response: string;
    createdAt: string;
    respondedBy: {
        firstName: string;
        lastName: string;
    };
}

interface Complaint {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    category: {
        name: string;
    };
    createdAt: string;
    responses: ComplaintResponse[];
}

const TrackComplaints = () => {
    const theme = useTheme();
    const token = useSelector((state: any) => state.auth.token);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/complaints/my-complaints`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComplaints(response.data);
        } catch (error: any) {
            console.error('Error fetching complaints:', error);
            setError(error.response?.data?.message || 'Error fetching complaints');
        } finally {
            setLoading(false);
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Track Complaints
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {complaints.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No complaints submitted yet
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {complaints.map((complaint) => (
                        <Grid item xs={12} key={complaint.id}>
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 2,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6">{complaint.title}</Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                            >
                                                Category: {complaint.category.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Submitted on: {formatDate(complaint.createdAt)}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={complaint.status.replace('_', ' ')}
                                            sx={{
                                                bgcolor: getStatusColor(complaint.status),
                                                color: 'white',
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {complaint.description}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        onClick={() => setSelectedComplaint(complaint)}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog
                open={Boolean(selectedComplaint)}
                onClose={() => setSelectedComplaint(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedComplaint && (
                    <>
                        <DialogTitle>
                            <Typography variant="h6">{selectedComplaint.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Category: {selectedComplaint.category.name}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" paragraph>
                                    {selectedComplaint.description}
                                </Typography>
                                <Chip
                                    label={selectedComplaint.status.replace('_', ' ')}
                                    sx={{
                                        bgcolor: getStatusColor(selectedComplaint.status),
                                        color: 'white',
                                    }}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>
                                Responses
                            </Typography>

                            {selectedComplaint.responses.length === 0 ? (
                                <Typography color="text.secondary">
                                    No responses yet
                                </Typography>
                            ) : (
                                selectedComplaint.responses.map((response) => (
                                    <Paper
                                        key={response.id}
                                        sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}
                                    >
                                        <Typography variant="body1" paragraph>
                                            {response.response}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Responded by {response.respondedBy.firstName}{' '}
                                            {response.respondedBy.lastName} on{' '}
                                            {formatDate(response.createdAt)}
                                        </Typography>
                                    </Paper>
                                ))
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedComplaint(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default TrackComplaints; 