// services/adminDashboardService.ts
import api from "./api";
import type { TopProductsRange, TopSellingProductsResponse, ProductsStatusesResponse } from "../components/admin/tabs/dashboard/types";
import type {
  StaffProfilesResponse,
  CreateEmployeeRequest,
  CreateEmployeeResponse,
} from "../components/admin/tabs/staff/types";

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string;
  category_type: string;
  category_name: string;
  cost_price: number;
  stock_status: string;
}

export interface Pagination {
  page: number;
  size: number;
  total_pages: number;
  total_items: number;
}

export interface AllProductsResponse {
  pagination: Pagination;
  product_items: ProductItem[];
}


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

  async getStaffProfiles(
    page: number = 1,
    size: number = 10,
  ): Promise<StaffProfilesResponse> {
    const response = await api.get<StaffProfilesResponse>(
      `/api/v1/admin-dashboard/staff-profiles?page=${page}&size=${size}`,
    );
    return response.data;
  },

  async createEmployee(
    payload: CreateEmployeeRequest,
  ): Promise<CreateEmployeeResponse> {
    const response = await api.post<CreateEmployeeResponse>(
      '/api/v1/admin-dashboard/create-employee-account',
      payload,
    );
    return response.data;
  },

  async getAllProducts(
    page: number = 1,
    size: number = 10,
  ): Promise<AllProductsResponse> {
    const response = await api.get<AllProductsResponse>(
      `/api/v1/admin-dashboard/get-all-products?page=${page}&size=${size}`,
    );
    return response.data;
  },

  async updateProductStockStatus(
    productId: string,
    status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK',
  ): Promise<void> {
    await api.put(
      `/api/v1/admin-dashboard/product/${productId}/stock-status?status=${status}`,
    );
  },

  async updateProduct(productId: string, payload: any): Promise<void> {
    const formData = new FormData();
    
    // Add fields to FormData only if they are present in the payload
    if (payload.name) formData.append('name', payload.name);
    if (payload.category_name) formData.append('category_name', payload.category_name);
    if (payload.price) formData.append('selling_price', payload.price.toString());
    if (payload.cost_price) formData.append('cost_price', payload.cost_price.toString());
    if (payload.description !== undefined) formData.append('description', payload.description || '');
    
    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }

    await api.patch(`/api/v1/admin-dashboard/product/${productId}/patch-product`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  async addProduct(payload: any): Promise<ProductItem> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('price', payload.price.toString());
    formData.append('cost', payload.cost.toString());
    formData.append('category_name', payload.category_name);
    formData.append('stock_status', payload.stock_status);
    
    if (payload.description) {
      formData.append('description', payload.description);
    }
    
    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }

    const response = await api.post<ProductItem>(
      '/api/v1/admin-dashboard/add-product',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/api/v1/admin-dashboard/get-all-categories');
    return response.data;
  },
};
