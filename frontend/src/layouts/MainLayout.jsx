// frontend/src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppBar, Box, CssBaseline, Drawer, IconButton,
    List, ListItem, ListItemIcon, ListItemText,
    Toolbar, Typography, Avatar, Menu, MenuItem,
    Divider, Badge
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    People,
    CalendarToday,
    Payment,
    Settings,
    Logout,
    Notifications,
    ChevronLeft,
    DarkMode,
    LightMode
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Clients', icon: <People />, path: '/clients' },
        { text: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
        { text: 'Payments', icon: <Payment />, path: '/payments' },
        { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const drawer = (
        <Box>
            <Toolbar sx={{ bgcolor: 'primary.dark', color: 'accent.cream' }}>
                <Typography variant="h6" noWrap>
                    TailorCraft
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={{
                            '&:hover': { bgcolor: 'primary.light', color: 'white' }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'primary.dark'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {user?.firstName}!
                    </Typography>

                    {/* Trial Status Badge */}
                    {user?.subscription === 'free_trial' && (
                        <Badge badgeContent="Trial" color="warning" sx={{ mr: 2 }}>
                            <Typography variant="body2">Days left: {Math.ceil((new Date(user.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))}</Typography>
                        </Badge>
                    )}

                    {/* Theme Toggle */}
                    <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 2 }}>
                        {isDarkMode ? <LightMode /> : <DarkMode />}
                    </IconButton>

                    {/* Notifications */}
                    <IconButton color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent={3} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    {/* User Menu */}
                    <IconButton onClick={handleMenu} color="inherit">
                        <Avatar sx={{ bgcolor: 'accent.gold', width: 32, height: 32 }}>
                            {user?.firstName?.[0]}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => navigate('/settings')}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: 'background.paper'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: 'background.paper'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;