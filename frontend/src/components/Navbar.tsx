import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    useTheme,
    useMediaQuery,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const isAdmin = user?.role === 'admin';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

    const handleMenu = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget as HTMLElement);
    };

    const handleMobileMenu = (event: SyntheticEvent) => {
        setMobileMenuAnchor(event.currentTarget as HTMLElement);
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

    const menuItems = isAuthenticated ? (
        <>
            <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                Dashboard
            </MenuItem>
            <MenuItem onClick={() => { navigate('/submit-complaint'); handleClose(); }}>
                Submit Complaint
            </MenuItem>
            <MenuItem onClick={() => { navigate('/track-complaints'); handleClose(); }}>
                Track Complaints
            </MenuItem>
            {isAdmin && (
                <>
                    <Divider />
                    <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>
                        Admin Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/users'); handleClose(); }}>
                        Manage Users
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/complaints'); handleClose(); }}>
                        All Complaints
                    </MenuItem>
                </>
            )}
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
    ) : (
        <>
            <MenuItem onClick={() => { navigate('/login'); handleClose(); }}>
                Login
            </MenuItem>
            <MenuItem onClick={() => { navigate('/register'); handleClose(); }}>
                Register
            </MenuItem>
        </>
    );

    return (
        <AppBar position="static">
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

                {isMobile ? (
                    <>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMobileMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={mobileMenuAnchor}
                            open={Boolean(mobileMenuAnchor)}
                            onClose={handleClose}
                        >
                            {menuItems}
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/dashboard"
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/submit-complaint"
                                >
                                    Submit Complaint
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/track-complaints"
                                >
                                    Track Complaints
                                </Button>
                                {isAdmin && (
                                    <IconButton
                                        color="inherit"
                                        onClick={() => navigate('/admin')}
                                        sx={{ ml: 1 }}
                                        title="Admin Dashboard"
                                    >
                                        <AdminPanelSettingsIcon />
                                    </IconButton>
                                )}
                                <IconButton
                                    color="inherit"
                                    onClick={handleMenu}
                                    sx={{ ml: 1 }}
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                        Profile
                                    </MenuItem>
                                    {isAdmin && (
                                        <>
                                            <MenuItem onClick={() => { navigate('/admin/users'); handleClose(); }}>
                                                Manage Users
                                            </MenuItem>
                                            <MenuItem onClick={() => { navigate('/admin/complaints'); handleClose(); }}>
                                                All Complaints
                                            </MenuItem>
                                            <Divider />
                                        </>
                                    )}
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/login"
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/register"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 