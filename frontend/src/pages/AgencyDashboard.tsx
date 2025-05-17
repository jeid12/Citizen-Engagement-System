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
    IconButton,
    Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { complaintAPI } from '../services/api';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Error as ErrorIcon,
    Timeline as TimelineIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
} from '@mui/icons-material';

interface Complaint {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    category: {
        name: string;
    };
    agency: {
        id: string;
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

const AgencyDashboard = () => {
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
            const response = await complaintAPI.getAgencyComplaints();
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <PendingIcon />;
            case 'in_progress':
                return <TimelineIcon />;
            case 'resolved':
                return <CheckCircleIcon />;
            case 'rejected':
                return <ErrorIcon />;
            default:
                return <AssignmentIcon />;
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
        const matchesSearch = 
            complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${complaint.user.firstName} ${complaint.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (!user?.role || user.role !== 'agency_staff') {
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
                {t('dashboard.agencyDashboard')}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card 
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' },
                            bgcolor: theme.palette.warning.light,
                        }}
                        onClick={() => setFilterStatus('pending')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <PendingIcon fontSize="large" color="warning" />
                                <Box>
                                    <Typography variant="h6">{t('status.pending')}</Typography>
                                    <Typography variant="h4" color="warning.dark">
                                        {statistics.pending}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card 
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' },
                            bgcolor: theme.palette.info.light,
                        }}
                        onClick={() => setFilterStatus('in_progress')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TimelineIcon fontSize="large" color="info" />
                                <Box>
                                    <Typography variant="h6">{t('status.inProgress')}</Typography>
                                    <Typography variant="h4" color="info.dark">
                                        {statistics.in_progress}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card 
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' },
                            bgcolor: theme.palette.success.light,
                        }}
                        onClick={() => setFilterStatus('resolved')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <CheckCircleIcon fontSize="large" color="success" />
                                <Box>
                                    <Typography variant="h6">{t('status.resolved')}</Typography>
                                    <Typography variant="h4" color="success.dark">
                                        {statistics.resolved}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card 
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' },
                            bgcolor: theme.palette.error.light,
                        }}
                        onClick={() => setFilterStatus('rejected')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <ErrorIcon fontSize="large" color="error" />
                                <Box>
                                    <Typography variant="h6">{t('status.rejected')}</Typography>
                                    <Typography variant="h4" color="error.dark">
                                        {statistics.rejected}
                                    </Typography>
                                </Box>
                            </Stack>
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
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label={t('filter.filterByStatus')}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        InputProps={{
                            startAdornment: <FilterListIcon color="action" sx={{ mr: 1 }} />,
                        }}
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
                                        icon={getStatusIcon(complaint.status)}
                                        label={t(`status.${complaint.status}`)}
                                        sx={{
                                            bgcolor: getStatusColor(complaint.status),
                                            color: 'white',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={t('actions.manage')}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetails(complaint)}
                                            startIcon={getStatusIcon(complaint.status)}
                                        >
                                            {t('actions.manage')}
                                        </Button>
                                    </Tooltip>
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

export default AgencyDashboard; 