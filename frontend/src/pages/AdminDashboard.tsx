import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
   
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { complaintAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import {
    People as PeopleIcon,
    Business as BusinessIcon,
    Report as ReportIcon,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';

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
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
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
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await complaintAPI.getAllAdmin();
            
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
            setError(error.response?.data?.message || t('errors.fetchingComplaints'));
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async () => {
        if (!selectedComplaint) return;

        try {
            await complaintAPI.respond(selectedComplaint.id, {
                response: responseText,
                status: selectedComplaint.status,
            });
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
                    {t('errors.noPermission')}
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

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('dashboard.adminDashboard')}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card 
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
                        }}
                        onClick={() => navigate('/admin/users')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <PeopleIcon fontSize="large" color="primary" />
                                <Box>
                                    <Typography variant="h6">{t('navigation.manageUsers')}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('dashboard.manageUsersDesc')}
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
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
                        }}
                        onClick={() => navigate('/admin/agencies')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <BusinessIcon fontSize="large" color="primary" />
                                <Box>
                                    <Typography variant="h6">{t('navigation.manageAgencies')}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('dashboard.manageAgenciesDesc')}
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
                            '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
                        }}
                        onClick={() => navigate('/admin/complaints')}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <ReportIcon fontSize="large" color="primary" />
                                <Box>
                                    <Typography variant="h6">{t('navigation.allComplaints')}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('dashboard.manageComplaintsDesc')}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <DashboardIcon fontSize="large" color="primary" />
                                <Box>
                                    <Typography variant="h6">{t('dashboard.overview')}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('dashboard.systemOverview')}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Statistics */}
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

            {/* Recent Complaints Table */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                    {t('dashboard.recentComplaints')}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/admin/complaints')}
                >
                    {t('actions.viewAll')}
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('table.title')}</TableCell>
                            <TableCell>{t('table.category')}</TableCell>
                            <TableCell>{t('table.citizen')}</TableCell>
                            <TableCell>{t('table.dateSubmitted')}</TableCell>
                            <TableCell>{t('table.status')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.slice(0, 5).map((complaint) => (
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
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={t(`status.${complaint.status}`)}
                                        color={
                                            complaint.status === 'resolved' ? 'success' :
                                            complaint.status === 'in_progress' ? 'info' :
                                            complaint.status === 'pending' ? 'warning' : 'error'
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminDashboard; 