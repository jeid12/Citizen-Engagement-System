import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PeopleIcon from '@mui/icons-material/People';

const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 128px)', // Account for header and footer
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            pt: 8,
            pb: 12
        }}>
            <Container>
                <Box sx={{
                    textAlign: 'center',
                    color: 'white',
                    mb: 8
                }}>
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 700,
                            color: 'white',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        Welcome to CES Rwanda
                    </Typography>
                    <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom 
                        sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            maxWidth: '800px',
                            mx: 'auto',
                            mb: 4
                        }}
                    >
                        Your voice matters in building a better Rwanda. Connect, engage, and make a difference in your community.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                }
                            }}
                        >
                            <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                                <SendIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
                                Submit Complaints
                            </Typography>
                            <Typography paragraph color="text.secondary" sx={{ mb: 3 }}>
                                Report issues in your community directly to the relevant government agencies. Your feedback helps improve public services.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/submit-complaint')}
                                fullWidth
                            >
                                Submit Now
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                }
                            }}
                        >
                            <Box sx={{ color: theme.palette.secondary.main, mb: 2 }}>
                                <TrackChangesIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.secondary.main }}>
                                Track Progress
                            </Typography>
                            <Typography paragraph color="text.secondary" sx={{ mb: 3 }}>
                                Monitor the status of your submitted complaints and receive real-time updates on actions taken by authorities.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/track-complaints')}
                                fullWidth
                            >
                                Track Complaints
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                }
                            }}
                        >
                            <Box sx={{ color: theme.palette.warning.main, mb: 2 }}>
                                <PeopleIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.warning.main }}>
                                Get Involved
                            </Typography>
                            <Typography paragraph color="text.secondary" sx={{ mb: 3 }}>
                                Join our growing community of active citizens. Together, we can make Rwanda an even better place for everyone.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: theme.palette.warning.main,
                                    color: theme.palette.warning.contrastText,
                                    '&:hover': {
                                        bgcolor: theme.palette.warning.dark,
                                    }
                                }}
                                onClick={() => navigate('/register')}
                                fullWidth
                            >
                                Join Now
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home; 