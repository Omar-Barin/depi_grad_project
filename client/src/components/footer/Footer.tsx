import { Paper } from '@mui/material';

function Footer() {
    return (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem 0',
            }}
        >
            &copy; Subhakanta Roul | All Rights Reserved
        </Paper>
    );
}

export default Footer;
