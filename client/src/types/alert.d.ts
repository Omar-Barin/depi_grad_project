export interface InventoryAlert {
    product_id: number;
    name: string;
    quantity: number;
    threshold: number;
    severity: 'WARNING' | 'CRITICAL';
    timestamp: string;
}

export interface AlertsResponse {
    count: number;
    threshold: number;
    alerts: InventoryAlert[];
}
