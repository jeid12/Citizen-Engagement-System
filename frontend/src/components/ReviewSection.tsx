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
    Stack
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

    return (
        <Box sx={{ py: 6, backgroundColor: '#f5f5f5' }}>
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{ color: RWANDA_COLORS.blue, mb: 4 }}
            >
                {t('reviews.title')}
            </Typography>

            {/* Submit Review Form */}
            <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 3, mb: 6 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <TextField
                            fullWidth
                            label={t('reviews.form.name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

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
                            <Rating
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                                size="large"
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: RWANDA_COLORS.green,
                                '&:hover': {
                                    backgroundColor: RWANDA_COLORS.green + 'dd'
                                }
                            }}
                        >
                            {t('reviews.form.submit')}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Display Reviews */}
            <Grid container spacing={3} sx={{ px: 3 }}>
                {reviews.map((review) => (
                    <Grid item xs={12} md={6} lg={4} key={review.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" component="div">
                                        {review.name}
                                    </Typography>
                                    <Rating value={review.rating} readOnly />
                                </Box>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {review.comment}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(review.createdAt).toLocaleDateString()}
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