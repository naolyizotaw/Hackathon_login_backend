import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DashboardPage = () => {
    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
                <Typography variant="h4" component="h1">
                    Welcome to the Dashboard
                </Typography>
            </Box>
            <Typography>
                This is a simple dashboard. Only login, signup, and email verification features are available.
            </Typography>
        </Container>
    );
};

export default DashboardPage;
