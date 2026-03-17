//hooks/useOrders.ts
import { useState, useEffect, useCallback } from "react";
import { Order, APIOrder } from "../types/order";
import { transformOrder } from "../utils/orderHelpers";
import {
  authFetch,
  getAccessToken,
  isRefreshTokenExpired,
} from "../services/authService";

import { useOrderWebSocket } from "./useOrderWebSocket";
import { PerformanceMetricsPayload } from "@/types/metrics";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const METRICS_ENDPOINT = `${API_BASE_URL}/api/v1/order/today`;

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  isSessionExpired: boolean;
  lastUpdated: Date;
  loadOrders: (showLoading?: boolean) => Promise<void>;
  updateOrders: (updater: (prev: Order[]) => Order[]) => void;
}

interface UseOrdersOptions {
  onMetricsUpdate?: (payload: PerformanceMetricsPayload) => void;
}

export const useOrders = (options?: UseOrdersOptions): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // --- Orders REST ---
  const fetchOrders = async (): Promise<APIOrder[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/v1/order/get-orders`);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("SESSION_EXPIRED");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch orders: ${response.statusText}`,
      );
    }

    return response.json();
  };

  const loadOrders = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    setIsSessionExpired(false);

    // Add timeout protection
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Request timed out. Please try again.");
    }, 10000); // 10 second timeout

    try {
      const apiOrders = await fetchOrders();
      const transformedOrders = apiOrders.map(transformOrder);
      setOrders(transformedOrders);
      setLastUpdated(new Date());
      clearTimeout(timeoutId); // Clear timeout on success
    } catch (err) {
      clearTimeout(timeoutId); // Clear timeout on error
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load orders";

      if (errorMessage === "SESSION_EXPIRED") {
        setIsSessionExpired(true);
        setError("Your session has expired. Please login again.");
      } else {
        setError(errorMessage);
      }

      console.error("Error fetching orders:", err);
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is cleared
      if (showLoading) setLoading(false);
    }
  }, []);

  const updateOrders = useCallback((updater: (prev: Order[]) => Order[]) => {
    setOrders((prev) => updater(prev));
  }, []);

  // --- Initial Metrics fetch
  const onMetricsUpdate = options?.onMetricsUpdate;

  const loadInitialMetrics = useCallback(async () => {
    if (!onMetricsUpdate) return;

    try {
      const response = await authFetch(METRICS_ENDPOINT, { method: "GET" });
      if (!response.ok) {
        // Don't throw, footer will update when WS pushes
        return;
      }
      const data = await response.json();

      onMetricsUpdate({
        avg_prep_time: data.avg_prep_time ?? null,
        completed_today:
          typeof data.completed_today === "number"
            ? data.completed_today
            : undefined,
        efficiency_percentage:
          typeof data.efficiency_percentage === "number"
            ? data.efficiency_percentage
            : undefined,
      });
    } catch (e) {
      // Silent fail - WebSocket will eventually update metrics
      console.warn("Initial metrics fetch failed: ", e);
    }
  }, [onMetricsUpdate]);

  // WebSocket
  useOrderWebSocket(
    getAccessToken() || undefined,
    updateOrders,
    options?.onMetricsUpdate,
  );

  useEffect(() => {
    const token = getAccessToken();
    if (!token || isRefreshTokenExpired()) {
      setIsSessionExpired(true);
      setError("Your session has expired. Please login again.");
      setLoading(false);
      return;
    }

    loadOrders();
    loadInitialMetrics();

    // Pull Orders every 30s
    const interval = setInterval(() => {
      loadOrders(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadOrders, loadInitialMetrics]);

  return {
    orders,
    loading,
    error,
    isSessionExpired,
    lastUpdated,
    loadOrders,
    updateOrders,
  };
};
