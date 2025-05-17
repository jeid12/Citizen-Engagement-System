import React from 'react';
import { Container, Typography, Grid, Button, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';

const RWANDA_COLORS = {
    blue: '#00A0DC',   // Blue
    yellow: '#FAD201', // Yellow
    green: '#00B140'   // Green
};

const Home = () => {
    const { t } = useTranslation();

    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{ 
                backgroundColor: RWANDA_COLORS.blue + '10',
                py: 8
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        align="center"
                        gutterBottom
                        sx={{ color: RWANDA_COLORS.blue }}
                    >
                        {t('home.title')}
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        color="text.secondary"
                        paragraph
                        sx={{ mb: 6 }}
                    >
                        {t('home.subtitle')}
                    </Typography>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {/* Submit Complaints */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', backgroundColor: 'white' }}>
                            <Typography variant="h5" gutterBottom color={RWANDA_COLORS.blue}>
                                {t('home.submitComplaints.title')}
                            </Typography>
                            <Typography paragraph>
                                {t('home.submitComplaints.description')}
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/submit-complaint"
                                variant="contained"
                                sx={{
                                    backgroundColor: RWANDA_COLORS.green,
                                    '&:hover': {
                                        backgroundColor: RWANDA_COLORS.green + 'dd'
                                    }
                                }}
                            >
                                {t('home.submitComplaints.button')}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Track Progress */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', backgroundColor: 'white' }}>
                            <Typography variant="h5" gutterBottom color={RWANDA_COLORS.blue}>
                                {t('home.trackProgress.title')}
                            </Typography>
                            <Typography paragraph>
                                {t('home.trackProgress.description')}
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/track-complaints"
                                variant="contained"
                                sx={{
                                    backgroundColor: RWANDA_COLORS.green,
                                    '&:hover': {
                                        backgroundColor: RWANDA_COLORS.green + 'dd'
                                    }
                                }}
                            >
                                {t('home.trackProgress.button')}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Get Involved */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', backgroundColor: 'white' }}>
                            <Typography variant="h5" gutterBottom color={RWANDA_COLORS.blue}>
                                {t('home.getInvolved.title')}
                            </Typography>
                            <Typography paragraph>
                                {t('home.getInvolved.description')}
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                sx={{
                                    backgroundColor: RWANDA_COLORS.green,
                                    '&:hover': {
                                        backgroundColor: RWANDA_COLORS.green + 'dd'
                                    }
                                }}
                            >
                                {t('home.getInvolved.button')}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Reviews Section */}
            <ReviewSection />
        </Box>
    );
};

export default Home;