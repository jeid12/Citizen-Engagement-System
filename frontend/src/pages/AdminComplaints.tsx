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
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { complaintAPI } from '../services/api';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

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

interface Statistics {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
}

const AdminComplaints = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState('');
    const [newStatus, setNewStatus] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statistics, setStatistics] = useState<Statistics>({
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
    });
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

            // Calculate statistics
            const stats = response.data.reduce((acc: Statistics, complaint: Complaint) => {
                acc.total++;
                acc[complaint.status]++;
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
            setError(error.response?.data?.message || t('errors.fetchingComplaints'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitResponse = async () => {
        if (!selectedComplaint || !responseText.trim() || !newStatus) return;

        try {
            await complaintAPI.respond(selectedComplaint.id, {
                response: responseText.trim(),
                status: newStatus,
            });
            setSuccess(t('messages.responseSubmitted'));
            fetchComplaints();
            handleCloseDialog();
        } catch (error: any) {
            setError(error.response?.data?.message || t('errors.failedToSubmitResponse'));
        }
    };

    const handleViewDetails = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setNewStatus(complaint.status);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedComplaint(null);
        setResponseText('');
        setNewStatus('');
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
                    {t('errors.noPermission')}
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('dashboard.manageComplaints')}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                {t('statistics.total')}
                            </Typography>
                            <Typography variant="h4">{statistics.total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                {t('statistics.pending')}
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {statistics.pending}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                {t('statistics.inProgress')}
                            </Typography>
                            <Typography variant="h4" color="info.main">
                                {statistics.in_progress}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                {t('statistics.resolved')}
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {statistics.resolved}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                {t('statistics.rejected')}
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {statistics.rejected}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filter */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('search.searchComplaints')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('search.searchPlaceholder')}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label={t('filter.filterByStatus')}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="all">{t('filter.allStatus')}</MenuItem>
                        <MenuItem value="pending">{t('status.pending')}</MenuItem>
                        <MenuItem value="in_progress">{t('status.inProgress')}</MenuItem>
                        <MenuItem value="resolved">{t('status.resolved')}</MenuItem>
                        <MenuItem value="rejected">{t('status.rejected')}</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            {/* Complaints Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('table.title')}</TableCell>
                            <TableCell>{t('table.category')}</TableCell>
                            <TableCell>{t('table.agency')}</TableCell>
                            <TableCell>{t('table.citizen')}</TableCell>
                            <TableCell>{t('table.dateSubmitted')}</TableCell>
                            <TableCell>{t('table.status')}</TableCell>
                            <TableCell>{t('table.actions')}</TableCell>
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
                                        label={t(`status.${complaint.status}`)}
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
                                        {t('actions.manage')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Complaint Management Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                {selectedComplaint && (
                    <>
                        <DialogTitle>
                            {t('dialog.manageComplaint')}
                        </DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Typography variant="h6">{selectedComplaint.title}</Typography>
                                <Typography variant="body1">{selectedComplaint.description}</Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            {t('dialog.category')}: {selectedComplaint.category.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            {t('dialog.agency')}: {selectedComplaint.agency.name}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Typography variant="subtitle2" color="textSecondary">
                                    {t('dialog.previousResponses')}
                                </Typography>
                                {selectedComplaint.responses.length > 0 ? (
                                    selectedComplaint.responses.map((response, index) => (
                                        <Paper key={index} sx={{ p: 2 }} variant="outlined">
                                            <Typography variant="body2">{response.response}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {t('dialog.respondedBy', {
                                                    name: `${response.respondedBy.firstName} ${response.respondedBy.lastName}`,
                                                    date: format(new Date(response.createdAt), 'MMM dd, yyyy HH:mm')
                                                })}
                                            </Typography>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        {t('dialog.noResponses')}
                                    </Typography>
                                )}

                                <TextField
                                    select
                                    fullWidth
                                    label={t('dialog.updateStatus')}
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <MenuItem value="pending">{t('status.pending')}</MenuItem>
                                    <MenuItem value="in_progress">{t('status.inProgress')}</MenuItem>
                                    <MenuItem value="resolved">{t('status.resolved')}</MenuItem>
                                    <MenuItem value="rejected">{t('status.rejected')}</MenuItem>
                                </TextField>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label={t('dialog.addResponse')}
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>
                                {t('actions.cancel')}
                            </Button>
                            <Button
                                onClick={handleSubmitResponse}
                                variant="contained"
                                color="primary"
                                disabled={!responseText.trim() || !newStatus}
                            >
                                {t('actions.submitResponse')}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default AdminComplaints; 