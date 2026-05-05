// services/adminDashboardService.ts
import api from "./api";
import type { TopProductsRange, TopSellingProductsResponse, ProductsStatusesResponse } from "../components/admin/tabs/dashboard/types";

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

  async getTopSellingProducts(
    range: TopProductsRange = 'ALL',
    page: number = 0,
    size: number = 10,
  ): Promise<TopSellingProductsResponse> {
    const response = await api.post<TopSellingProductsResponse>(
      '/api/v1/admin-dashboard/top-selling-products',
      { range, page, size },
    );
    return response.data;
  },

  async getProductsStatuses(
    page: number = 1,
    size: number = 10,
  ): Promise<ProductsStatusesResponse> {
    const response = await api.get<ProductsStatusesResponse>(
      `/api/v1/admin-dashboard/products-statuses?page=${page}&size=${size}`,
    );
    return response.data;
  },
};
