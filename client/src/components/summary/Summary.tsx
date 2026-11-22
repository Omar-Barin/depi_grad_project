import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearForm, getProducts } from '@/store/product.slice';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

interface SummaryProps {
    onRefresh?: () => void;
}

function Summary({ onRefresh }: SummaryProps) {
    const { productList } = useAppSelector((state) => state?.products);
    const dispatch = useAppDispatch();

    const handleRefresh = () => {
        dispatch(getProducts());
        dispatch(clearForm());
        if (onRefresh) {
            onRefresh();
        }
    };

    const totalProducts = productList.length;
    const totalUnits = productList.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
    const totalValue = productList.reduce(
        (acc, p) => acc + (Number(p.price) || 0) * (Number(p.quantity) || 0),
        0
    );
    const lowStockCount = productList.filter((p) => Number(p.quantity) <= 10).length;

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Inventory Executive Overview & Reports
                </Typography>
                <Button variant="contained" onClick={handleRefresh}>
                    Refresh Data
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: 2,
                }}
            >
                <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Inventory2Icon color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Total Products
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {totalProducts}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderLeft: 4, borderColor: 'info.main' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ProductionQuantityLimitsIcon color="info" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Total Stock Units
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {totalUnits.toLocaleString()}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AttachMoneyIcon color="success" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Total Inventory Value
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderLeft: 4, borderColor: lowStockCount > 0 ? 'warning.main' : 'grey.300' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <WarningAmberIcon
                            color={lowStockCount > 0 ? 'warning' : 'disabled'}
                            sx={{ fontSize: 40 }}
                        />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Low / Out of Stock
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: lowStockCount > 0 ? 'warning.dark' : 'text.primary',
                                }}
                            >
                                {lowStockCount}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default Summary;
