import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                    test#
                </Typography>
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 2 }}>
                            Welcome, {user?.username}!
                        </Typography>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={RouterLink} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/signup">
                            Sign Up
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
