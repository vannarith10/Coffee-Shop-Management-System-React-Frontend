// services/dashboardService.ts
import api from "./api";

export interface MetricData {
  value: number;
  growth_pct: number;
}

export interface BusinessAnalyticsSummary {
  today_revenue: MetricData;
  today_total_orders: MetricData;
  today_average_order_value: MetricData;
}

export interface SummaryResponse {
  summary: BusinessAnalyticsSummary;
}


export const dashboardService = {
  async getBusinessAnalyticsSummary(): Promise<SummaryResponse> {
    // The axios `api` instance automatically injects the Bearer token
    // and retries with a refreshed token on 401 (see api.ts interceptor)
    const response = await api.get<SummaryResponse>("/api/v1/admin-dashboard/summary");
    return response.data;
  },

  async getDetailedReports(startDate: string, endDate: string): Promise<any> {
    const response = await api.get(
      `/api/v1/admin-dashboard/reports?start=${startDate}&end=${endDate}`,
    );
    return response.data;
  },
};
