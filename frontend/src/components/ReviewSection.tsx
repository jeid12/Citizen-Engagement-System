import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Rating,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Alert,
    Stack,
    alpha
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Review {
    id: string;
    name: string;
    comment: string;
    rating: number;
    createdAt: string;
}

const RWANDA_COLORS = {
    blue: '#00A0DC',
    yellow: '#FAD201',
    green: '#00B140'
};

const ReviewSection = () => {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState<number | null>(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim() || !comment.trim() || !rating) {
            setError(t('reviews.errors.allFieldsRequired'));
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/reviews/submit', {
                name,
                comment,
                rating
            });

            setSuccess(t('reviews.messages.submitSuccess'));
            setName('');
            setComment('');
            setRating(0);
            fetchReviews();
        } catch (error: any) {
            setError(error.response?.data?.message || t('reviews.errors.submitError'));
        }
    };

    return (        <Box sx={{             py: 6,             backgroundColor: alpha(RWANDA_COLORS.blue, 0.05),            borderTop: `4px solid ${RWANDA_COLORS.blue}`        }}>            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{ color: RWANDA_COLORS.blue, mb: 4 }}
            >
                {t('reviews.title')}
            </Typography>

            {/* Submit Review Form */}
                        <Paper                 elevation={3}                 sx={{                     maxWidth: 600,                     mx: 'auto',                     p: 4,                     mb: 6,                    backgroundColor: 'white',                    border: `1px solid ${alpha(RWANDA_COLORS.blue, 0.1)}`,                    '&:hover': {                        borderColor: alpha(RWANDA_COLORS.blue, 0.2)                    }                }}            >                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                                                    <TextField                                fullWidth                                label={t('reviews.form.name')}                                value={name}                                onChange={(e) => setName(e.target.value)}                                required                                sx={{                                    '& .MuiOutlinedInput-root': {                                        '&.Mui-focused fieldset': {                                            borderColor: RWANDA_COLORS.blue                                        }                                    },                                    '& .MuiInputLabel-root.Mui-focused': {                                        color: RWANDA_COLORS.blue                                    }                                }}                            />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label={t('reviews.form.comment')}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />

                        <Box>
                            <Typography component="legend">{t('reviews.form.rating')}</Typography>
                                                        <Rating                                value={rating}                                onChange={(_, newValue) => setRating(newValue)}                                size="large"                                sx={{                                    '& .MuiRating-iconFilled': {                                        color: RWANDA_COLORS.yellow                                    },                                    '& .MuiRating-iconHover': {                                        color: alpha(RWANDA_COLORS.yellow, 0.7)                                    }                                }}                            />
                        </Box>

                                                    <Button                                type="submit"                                variant="contained"                                sx={{                                    backgroundColor: RWANDA_COLORS.green,                                    '&:hover': {                                        backgroundColor: alpha(RWANDA_COLORS.green, 0.9)                                    },                                    transition: 'background-color 0.3s ease'                                }}                            >
                            {t('reviews.form.submit')}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Display Reviews */}
            <Grid container spacing={3} sx={{ px: 3 }}>
                {reviews.map((review) => (
                    <Grid item xs={12} md={6} lg={4} key={review.id}>
                                                <Card sx={{                             height: '100%',                            display: 'flex',                            flexDirection: 'column',                            backgroundColor: 'white',                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',                            '&:hover': {                                transform: 'translateY(-4px)',                                boxShadow: `0 6px 12px ${alpha(RWANDA_COLORS.blue, 0.1)}`                            }                        }}>                            <CardContent>                                <Box sx={{                                     display: 'flex',                                     justifyContent: 'space-between',                                     mb: 2,                                    pb: 2,                                    borderBottom: `2px solid ${alpha(RWANDA_COLORS.yellow, 0.3)}`                                }}>                                    <Typography                                         variant="h6"                                         component="div"                                        sx={{ color: RWANDA_COLORS.blue }}                                    >                                        {review.name}                                    </Typography>                                    <Rating                                         value={review.rating}                                         readOnly                                         sx={{                                            '& .MuiRating-iconFilled': {                                                color: RWANDA_COLORS.yellow                                            }                                        }}                                    />                                </Box>                                <Typography                                     variant="body1"                                     sx={{                                         color: 'text.secondary',                                        mb: 2                                    }}                                >                                    {review.comment}                                </Typography>                                <Typography                                     variant="caption"                                     sx={{                                         color: alpha(RWANDA_COLORS.blue, 0.6),                                        display: 'block',                                        textAlign: 'right'                                    }}                                >                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ReviewSection; 