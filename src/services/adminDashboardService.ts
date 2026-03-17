// services/dashboardService.ts
import {
  getAccessToken,
  getRefreshToken,
  isRefreshTokenExpired,
  setAccessToken,
  clearAuth,
} from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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

// Token refresh response (matches your RefreshResponse interface)
interface TokenRefreshResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refresh: {
    token: string;
    expiresAt: string;
  };
}




/**
 * Attempts to refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken || isRefreshTokenExpired()) {
    console.error("Refresh token expired or not available");
    clearAuth();
    window.location.href = "/login";
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/token/get-access-token`, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data: TokenRefreshResponse = await response.json();
    setAccessToken(data.accessToken);
    localStorage.setItem("refreshToken", data.refresh.token);
    localStorage.setItem("refreshExpiresAt", data.refresh.expiresAt);
    return data.accessToken;

  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearAuth();
    window.location.href = "/login";
    return null;
  }
}




/**
 * Makes an authenticated API request with automatic token refresh
 */
async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = getAccessToken();

  // If no token, try to refresh
  if (!token) {
    token = await refreshAccessToken();
    if (!token) {
      throw new Error("No valid authentication token");
    }
  }

  // Make request with current token
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // If unauthorized, try to refresh token once
  if (response.status === 401) {
    console.log("Access token expired, attempting refresh...");
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new Error("Session expired. Please login again.");
    }

    // Retry request with new token
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  return response;
}




export const dashboardService = {
  async getBusinessAnalyticsSummary(): Promise<SummaryResponse> {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/v1/admin-dashboard/summary`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch dashboard summary: ${errorText}`);
    }

    return response.json();
  },

  // Add more dashboard endpoints here as needed
  async getDetailedReports(startDate: string, endDate: string): Promise<any> {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/ap1/v1/admin-dashboard/reports?start=${startDate}&end=${endDate}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }

    return response.json();
  },
};
