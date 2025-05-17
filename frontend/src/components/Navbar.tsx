import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    MenuItem,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { logout } from '../store/slices/authSlice';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const isAdmin = user?.role === 'admin';
    const isAgencyStaff = user?.role === 'agency_staff';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMobileMenuAnchor(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate('/login');
    };

    const renderMenu = () => {
        if (isAuthenticated) {
            const menuItems = [
                { text: t('navigation.home'), path: '/' },
                { text: t('navigation.submitComplaint'), path: '/submit-complaint' },
                { text: t('navigation.trackComplaints'), path: '/track-complaints' },
            ];

            if (user?.role === 'admin') {
                menuItems.push(
                    { text: t('navigation.adminDashboard'), path: '/admin-dashboard' },
                    { text: t('navigation.manageUsers'), path: '/admin/users' },
                    { text: t('navigation.manageAgencies'), path: '/admin/agencies' },
                    { text: t('navigation.manageCategories'), path: '/categories' }
                );
            }

            if (user?.role === 'agency_staff') {
                menuItems.push(
                    { text: t('navigation.agencyDashboard'), path: '/agency-dashboard' },
                    { text: t('navigation.manageCategories'), path: '/categories' }
                );
            }

            return menuItems;
        }

        return [
            { text: t('navigation.home'), path: '/' },
            { text: t('navigation.login'), path: '/login' },
            { text: t('navigation.register'), path: '/register' }
        ];
    };

    // Menu items based on user role
    const getMenuItems = () => (
        <>
            {isAuthenticated && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user?.profilePhoto ? (
                        <Avatar 
                            src={user.profilePhoto}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{ width: 40, height: 40 }}
                        />
                    ) : (
                        <AccountCircleIcon sx={{ width: 40, height: 40 }} />
                    )}
                    <Box>
                        <Typography variant="subtitle1">{`${user?.firstName} ${user?.lastName}`}</Typography>
                        <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    </Box>
                </Box>
            )}
            <Divider />
            {renderMenu().map((item, index) => (
                <MenuItem key={index} onClick={() => { navigate(item.path); handleClose(); }}>
                    {item.text}
                </MenuItem>
            ))}
            {isAuthenticated ? (
                <>
                    <Divider />
                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                        {t('navigation.profile')}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        {t('navigation.logout')}
                    </MenuItem>
                </>
            ) : (
                <>
                    <MenuItem onClick={() => { navigate('/login'); handleClose(); }}>
                        {t('navigation.login')}
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/register'); handleClose(); }}>
                        {t('navigation.register')}
                    </MenuItem>
                </>
            )}
        </>
    );

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        CES Rwanda
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LanguageSwitcher />

                        {/* Desktop Navigation */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                            {isAuthenticated && (
                                <>
                                    <Button
                                        color="inherit"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        {t('navigation.dashboard')}
                                    </Button>

                                    {isAdmin && (
                                        <>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/admin-dashboard')}
                                                startIcon={<AdminPanelSettingsIcon />}
                                            >
                                                {t('navigation.adminDashboard')}
                                            </Button>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/categories')}
                                            >
                                                {t('navigation.manageCategories')}
                                            </Button>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/admin/complaints')}
                                            >
                                                {t('navigation.allComplaints')}
                                            </Button>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/admin/users')}
                                            >
                                                {t('navigation.manageUsers')}
                                            </Button>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/admin/agencies')}
                                            >
                                                {t('navigation.manageAgencies')}
                                            </Button>
                                        </>
                                    )}

                                    {isAgencyStaff && (
                                        <>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/agency-dashboard')}
                                            >
                                                {t('navigation.agencyDashboard')}
                                            </Button>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/categories')}
                                            >
                                                {t('navigation.manageCategories')}
                                            </Button>
                                        </>
                                    )}

                                    {!isAdmin && !isAgencyStaff && (
                                        <>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/submit-complaint')}
                                            >
                                                {t('navigation.submitComplaint')}
                                            </Button>
                                            <Button
                                                color="inherit"
                                                onClick={() => navigate('/track-complaints')}
                                            >
                                                {t('navigation.trackComplaints')}
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}

                            {!isAuthenticated && (
                                <>
                                    <Button
                                        color="inherit"
                                        onClick={() => navigate('/login')}
                                    >
                                        {t('navigation.login')}
                                    </Button>
                                    <Button
                                        color="inherit"
                                        onClick={() => navigate('/register')}
                                    >
                                        {t('navigation.register')}
                                    </Button>
                                </>
                            )}
                        </Box>

                        {/* Mobile Menu Icon */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                color="inherit"
                                onClick={handleMobileMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* User Menu (Desktop) */}
                        {isAuthenticated && (
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <IconButton
                                    onClick={handleMenu}
                                    color="inherit"
                                    size="small"
                                >
                                    {user?.profilePhoto ? (
                                        <Avatar
                                            src={user.profilePhoto}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            sx={{ width: 32, height: 32, border: '2px solid white' }}
                                        />
                                    ) : (
                                        <AccountCircleIcon />
                                    )}
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                        {t('navigation.profile')}
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        {t('navigation.logout')}
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}

                        {/* Mobile Menu */}
                        <Menu
                            anchorEl={mobileMenuAnchor}
                            open={Boolean(mobileMenuAnchor)}
                            onClose={handleClose}
                            PaperProps={{
                                sx: { width: '100%', maxWidth: 320 }
                            }}
                        >
                            {getMenuItems()}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar; 