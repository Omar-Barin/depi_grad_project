import { useEffect, useState } from 'react';
import { getAlertsApi } from '@/api/alerts.api';
import type { InventoryAlert } from '@/types/alert';
import { Alert, AlertTitle, Box, Button, Chip, Stack, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface AlertsBannerProps {
    refreshKey?: number;
}

export default function AlertsBanner({ refreshKey }: AlertsBannerProps) {
    const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastChecked, setLastChecked] = useState<string>('');

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const data = await getAlertsApi();
            setAlerts(data.alerts || []);
            setLastChecked(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Poll alerts every 15 seconds to match alert-service interval
        const interval = setInterval(fetchAlerts, 15000);
        return () => clearInterval(interval);
    }, [refreshKey]);

    const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;

    if (alerts.length === 0) {
        return (
            <Alert
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                severity="success"
                sx={{ mb: 3 }}
                action={
                    <Button color="inherit" size="small" onClick={fetchAlerts} disabled={loading}>
                        Check
                    </Button>
                }
            >
                All stock levels are optimal. No low-stock or critical alerts.
            </Alert>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Alert
                icon={<WarningAmberIcon fontSize="inherit" />}
                severity={criticalCount > 0 ? 'error' : 'warning'}
                action={
                    <Button color="inherit" size="small" onClick={fetchAlerts} disabled={loading}>
                        Refresh
                    </Button>
                }
            >
                <AlertTitle sx={{ fontWeight: 'bold' }}>
                    Inventory Alerts ({alerts.length} item{alerts.length > 1 ? 's' : ''} require attention)
                    {lastChecked && (
                        <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.8 }}>
                            Last checked: {lastChecked}
                        </Typography>
                    )}
                </AlertTitle>

                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {alerts.map((alert) => (
                        <Chip
                            key={alert.product_id}
                            label={`${alert.name}: ${alert.quantity} in stock`}
                            color={alert.severity === 'CRITICAL' ? 'error' : 'warning'}
                            variant="filled"
                            size="small"
                        />
                    ))}
                </Stack>
            </Alert>
        </Box>
    );
}
