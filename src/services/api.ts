// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  clearAuth,
  setAccessToken,
  setRefreshToken,
  isRefreshTokenExpired,
} from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken || isRefreshTokenExpired()) {
        isRefreshing = false;
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // FIXED: Correct endpoint and request body
        const res = await axios.post<{
          accessToken: string;
          tokenType: string;
          expiresIn: number;
          refresh: {
            token: string;
            expiresAt: string;
          };
        }>(
          `${API_BASE_URL}/api/v1/token/get-access-token`, // Your endpoint
          { token: refreshToken }, // Your backend expects { "token": "..." }
          { headers: { "Content-Type": "application/json" } },
        );

        // FIXED: Update BOTH access AND refresh tokens
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refresh.token, res.data.refresh.expiresAt);

        onTokenRefreshed(res.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
