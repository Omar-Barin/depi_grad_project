import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearForm, getProducts } from '@/store/product.slice';
import { Box, Button, Paper, Typography } from '@mui/material';

function Summary() {
    const { productList } = useAppSelector((state) => state?.products);
    const dispatch = useAppDispatch();
    const handleRefresh = () => {
        dispatch(getProducts());
        dispatch(clearForm());
    };
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <Paper sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                    Total: <span>{productList.length}</span>
                </Typography>
            </Paper>
            <Button variant="contained" sx={{ gridColumn: '4' }} onClick={() => handleRefresh()}>
                Refresh
            </Button>
        </Box>
    );
}

export default Summary;
