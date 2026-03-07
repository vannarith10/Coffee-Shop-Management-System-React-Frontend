//hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { Order, APIOrder } from '../types/order';
import { transformOrder } from '../utils/orderHelpers';
import { authFetch, getAccessToken, isRefreshTokenExpired } from '../services/authService';

import { useOrderWebSocket } from './useOrderWebSocket';


const API_BASE_URL = 'http://localhost:8080/api/v1';


interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  isSessionExpired: boolean;
  lastUpdated: Date;
  loadOrders: (showLoading?: boolean) => Promise<void>;
  updateOrders: (updater: (prev: Order[]) => Order[]) => void
}


export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());


  const fetchOrders = async (): Promise<APIOrder[]> => {
    const response = await authFetch(`${API_BASE_URL}/order/get-orders`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  };



  const loadOrders = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    setIsSessionExpired(false);
    
    try {
      const apiOrders = await fetchOrders();
      const transformedOrders = apiOrders.map(transformOrder);
      setOrders(transformedOrders);
      setLastUpdated(new Date());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      
      if (errorMessage === 'SESSION_EXPIRED') {
        setIsSessionExpired(true);
        setError('Your session has expired. Please login again.');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error fetching orders:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);


  const updateOrders = useCallback((updater: (prev: Order[]) => Order[]) => {
    setOrders(prev => updater(prev));
  }, []);


  // WebSocket
  useOrderWebSocket(getAccessToken() || undefined , updateOrders);



  useEffect(() => {
    const token = getAccessToken();
    if (!token || isRefreshTokenExpired()) {
      setIsSessionExpired(true);
      setError('Your session has expired. Please login again.');
      setLoading(false);
      return;
    }
    
    loadOrders();
    
    const interval = setInterval(() => {
      loadOrders(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadOrders]);

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