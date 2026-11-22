import axios from 'axios';
import type { AlertsResponse } from '@/types/alert';

const ALERT_URL = import.meta.env.VITE_ALERT_API_URL || 'http://localhost:8001';

export async function getAlertsApi(): Promise<AlertsResponse> {
    const res = await axios.get<AlertsResponse>(`${ALERT_URL}/alerts`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.data;
}
