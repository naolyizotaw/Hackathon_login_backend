import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AuthProvider>
                    <Navbar />
                    <main>
                        <AppRoutes />
                    </main>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
