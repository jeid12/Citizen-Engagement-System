import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FeedbackIcon from '@mui/icons-material/Feedback';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <ReportProblemIcon sx={{ fontSize: 40 }} />,
            title: 'Report Issues',
            description: 'Easily report community issues and concerns to relevant government agencies.',
        },
        {
            icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
            title: 'Track Progress',
            description: 'Monitor the status and progress of your reported issues in real-time.',
        },
        {
            icon: <FeedbackIcon sx={{ fontSize: 40 }} />,
            title: 'Get Feedback',
            description: 'Receive updates and feedback from government agencies on your reports.',
        },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Welcome to CES Rwanda
                    </Typography>
                    <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                        Empowering citizens to engage with their government and improve their communities
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{ mr: 2 }}
                    >
                        Get Started
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() => navigate('/about')}
                    >
                        Learn More
                    </Button>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{ mb: 6 }}
                >
                    Key Features
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 3,
                                }}
                            >
                                <Box sx={{ color: 'primary.main', mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h3"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Call to Action Section */}
            <Box
                sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h4" component="h2" gutterBottom>
                        Ready to Make a Difference?
                    </Typography>
                    <Typography variant="h6" paragraph sx={{ mb: 4 }}>
                        Join CES Rwanda today and help build a better community for everyone.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/register')}
                    >
                        Sign Up Now
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default Home; 