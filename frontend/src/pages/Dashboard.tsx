import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardActionArea,
    Button,
    useTheme,
    Divider,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { styled } from '@mui/material/styles';
import { dashboardAPI } from '../services/api';

// Custom styled components using Rwanda flag colors
const RwandaCard = styled(Paper)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #00A0DC 30%, #0077BE 90%)', // Blue from Rwanda flag
    color: 'white',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(4),
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(5),
    padding: theme.spacing(1.5, 4),
    fontWeight: 'bold',
    textTransform: 'none',
}));

interface DashboardStats {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    responseRate: number;
    recentComplaints: Array<{
        id: string;
        title: string;
        status: string;
        createdAt: string;
        category: {
            name: string;
        };
        agency: {
            name: string;
        };
    }>;
}

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const { user } = useSelector((state: any) => state.auth);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalComplaints: 0,
        pendingComplaints: 0,
        resolvedComplaints: 0,
        responseRate: 0,
        recentComplaints: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await dashboardAPI.getStats();
                setStats(response.data);
            } catch (error: any) {
                setError('Failed to load dashboard statistics');
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'in_progress':
                return 'info';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <WelcomeSection>
                <Typography variant="h4" gutterBottom>
                    {t('welcome.greeting')}, {user?.firstName}!
                </Typography>
                <Typography variant="subtitle1">
                    {t('welcome.message')}
                </Typography>
            </WelcomeSection>

            <Grid container spacing={4}>
                {/* Quick Actions */}
                <Grid item xs={12} md={8}>
                    <RwandaCard elevation={3} sx={{ bgcolor: '#FEDD00' }}> {/* Yellow from Rwanda flag */}
                        <Typography variant="h6" gutterBottom>
                            {t('quickActions.title')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardActionArea onClick={() => navigate('/submit-complaint')}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <AddIcon sx={{ fontSize: 40, color: '#00A0DC' }} />
                                            <Typography variant="h6" sx={{ mt: 1 }}>
                                                {t('quickActions.submitComplaint.title')}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardActionArea onClick={() => navigate('/track-complaints')}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <TrackChangesIcon sx={{ fontSize: 40, color: '#00A0DC' }} />
                                            <Typography variant="h6" sx={{ mt: 1 }}>
                                                {t('quickActions.trackComplaints.title')}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </Grid>
                    </RwandaCard>
                </Grid>

                {/* Statistics */}
                <Grid item xs={12} md={4}>
                    <RwandaCard elevation={3} sx={{ bgcolor: '#1EB53A' }}> {/* Green from Rwanda flag */}
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            {t('statistics.title')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <StatsCard>
                                    <AnnouncementIcon sx={{ fontSize: 40, color: '#00A0DC' }} />
                                    <Typography variant="h4">{stats.totalComplaints}</Typography>
                                    <Typography variant="body2">{t('statistics.total')}</Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6}>
                                <StatsCard>
                                    <AccessTimeIcon sx={{ fontSize: 40, color: '#FFC107' }} />
                                    <Typography variant="h4">{stats.pendingComplaints}</Typography>
                                    <Typography variant="body2">{t('statistics.pending')}</Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6}>
                                <StatsCard>
                                    <CheckCircleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
                                    <Typography variant="h4">{stats.resolvedComplaints}</Typography>
                                    <Typography variant="body2">{t('statistics.resolved')}</Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6}>
                                <StatsCard>
                                    <AutorenewIcon sx={{ fontSize: 40, color: '#FF5722' }} />
                                    <Typography variant="h4">{stats.responseRate}%</Typography>
                                    <Typography variant="body2">{t('statistics.responseRate')}</Typography>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    </RwandaCard>
                </Grid>

                {/* Recent Complaints */}
                <Grid item xs={12}>
                    <RwandaCard elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            {t('recentComplaints.title')}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        {stats.recentComplaints.length > 0 ? (
                            <List>
                                {stats.recentComplaints.map((complaint) => (
                                    <ListItem
                                        key={complaint.id}
                                        sx={{
                                            mb: 1,
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <ListItemText
                                            primary={complaint.title}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {complaint.agency.name}
                                                    </Typography>
                                                    {" — "}
                                                    {complaint.category.name}
                                                    <Box sx={{ mt: 1 }}>
                                                        <Chip
                                                            size="small"
                                                            label={complaint.status}
                                                            color={getStatusColor(complaint.status) as any}
                                                            sx={{ mr: 1 }}
                                                        />
                                                        <Typography component="span" variant="caption" color="text.secondary">
                                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body1" color="text.secondary" align="center">
                                {t('recentComplaints.noComplaints')}
                            </Typography>
                        )}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <ActionButton
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/submit-complaint')}
                                startIcon={<AddIcon />}
                            >
                                {t('quickActions.submitComplaint.button')}
                            </ActionButton>
                        </Box>
                    </RwandaCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 