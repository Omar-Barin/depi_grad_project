import React, { type ReactNode } from 'react';
import NavBar from '@/components/navbar/NavBar';
import { Box } from '@mui/material';
import Footer from './components/footer/Footer';

interface LayoutProps {
    children?: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <NavBar />
            <Box sx={{flexGrow: 1, margin: '1.5rem'}}>{children}</Box>
            <Footer />
        </Box>
    );
}

export default Layout;
