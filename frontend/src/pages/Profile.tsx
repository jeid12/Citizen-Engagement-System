import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    Chip,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VerifiedIcon from '@mui/icons-material/Verified';
import { profileAPI } from '../services/api';
import { updateUser } from '../store/slices/authSlice';

interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
    profilePhoto?: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
}

const Profile = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: any) => state.auth.user);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (currentUser) {
            // Initialize profile with current user data
            setProfile({
                ...currentUser,
                bio: '',
                address: '',
                city: '',
                country: '',
                phoneNumber: '',
                ...profile // Keep any existing profile data
            });
        }
        fetchProfile();
    }, [currentUser]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await profileAPI.getProfile();
            setProfile(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            setError(t('profile.messages.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        try {
            setSaving(true);
            setError(null);
            const response = await profileAPI.updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber,
                bio: profile.bio,
                address: profile.address,
                city: profile.city,
                country: profile.country,
            });

            setSuccess(t('profile.messages.updateSuccess'));
            dispatch(updateUser(response.data.user));

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(t('profile.messages.updateError'));
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);
            const response = await profileAPI.uploadPhoto(file);
            setProfile(prev => prev ? { ...prev, profilePhoto: response.data.profilePhoto } : null);
            dispatch(updateUser({ ...currentUser, profilePhoto: response.data.profilePhoto }));
            setSuccess(t('profile.messages.photoSuccess'));

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error uploading photo:', error);
            setError(t('profile.messages.photoError'));
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (loading && !profile) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" align="center">
                    {t('profile.title')}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Avatar
                            src={profile?.profilePhoto}
                            alt={profile?.firstName}
                            sx={{ width: 150, height: 150 }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            aria-label={t('profile.uploadPhoto')}
                        />
                        <IconButton
                            color="primary"
                            aria-label={t('profile.uploadPhoto')}
                            component="span"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'background.paper',
                                '&:hover': { backgroundColor: 'background.paper' },
                            }}
                        >
                            {uploading ? <CircularProgress size={24} /> : <PhotoCamera />}
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                            label={profile?.role.toUpperCase()} 
                            color={profile?.role === 'admin' ? 'error' : profile?.role === 'agency_staff' ? 'warning' : 'default'}
                        />
                        {profile?.isEmailVerified && (
                            <Chip
                                icon={<VerifiedIcon />}
                                label={t('profile.verified')}
                                color="success"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>

                {profile && (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.firstName')}
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.lastName')}
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.email')}
                                    value={profile.email}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.phoneNumber')}
                                    value={profile.phoneNumber || ''}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label={t('profile.labels.bio')}
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder={t('profile.placeholders.bio')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.address')}
                                    value={profile.address || ''}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    placeholder={t('profile.placeholders.address')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.city')}
                                    value={profile.city || ''}
                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    placeholder={t('profile.placeholders.city')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={t('profile.labels.country')}
                                    value={profile.country || ''}
                                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                    placeholder={t('profile.placeholders.country')}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={saving}
                            >
                                {saving ? t('profile.buttons.saving') : t('profile.buttons.save')}
                            </Button>
                        </Box>
                    </form>
                )}
            </Paper>
        </Container>
    );
};

export default Profile; 