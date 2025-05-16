import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
            setError(error.response?.data?.message || 'Failed to fetch profile');
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

            setSuccess('Profile updated successfully');
            dispatch(updateUser(response.data.user));

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile');
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
            setSuccess('Profile photo updated successfully');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error uploading photo:', error);
            setError(error.response?.data?.message || 'Failed to upload photo');
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
                    My Profile
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
                        />
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
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
                                label="Verified"
                                color="success"
                            />
                        )}
                    </Box>
                </Box>

                {profile && (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={profile.email}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={profile.phoneNumber || ''}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    multiline
                                    rows={4}
                                    helperText="Tell us about yourself"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={profile.address || ''}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={profile.city || ''}
                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={profile.country || ''}
                                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Paper>
        </Container>
    );
};

export default Profile; 