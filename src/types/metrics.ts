


export type PerformanceMetricsPayload = {
    avg_prep_time?: string;
    completed_today?: number;
    efficiency_percentage?: number;
}


export type MetricsEventEnvelope = {
    event: 'performance.metrics.updated';
    payload: PerformanceMetricsPayload;
}