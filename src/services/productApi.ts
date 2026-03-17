// src/services/productApi.ts
import { BackendError, Product } from "../types";
import api from './api';  // Uses the interceptor-enabled axios instance

export class ProductApiError extends Error {
  constructor(public backendError: BackendError) {
    super(backendError.message);
  }
}

export async function fetchMenuItems() {
  try {
    const res = await api.get('/api/v1/product/menu'); 
    return res.data;
  } catch (err: any) {
    throw new ProductApiError({
      message: err.response?.data?.message || 'Failed to fetch products',
      status: err.response?.status || 500,
      timestamp: new Date().toISOString(),
      detail: err.response?.data?.detail,
    });
  }
}