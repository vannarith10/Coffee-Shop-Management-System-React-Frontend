import { useState, useEffect, useCallback } from "react";
import { Product, BackendError, toBackendError } from "../types";
import { fetchMenuItems, ProductApiError } from "../services/productApi";
import { normalizeProduct } from "../utils/productUtils";
import { getAccessToken, getRefreshToken, isRefreshTokenExpired, setAccessToken, setRefreshToken } from "../services/authService";

import { useProductWebSocket } from "./useProductWebSocket";


export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  isRefreshing: boolean;
  error: BackendError | null;
  refetch: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<BackendError | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  



  const getAccessTokenFromRefreshToken = useCallback(async () : Promise<boolean> => {
    const refresh = getRefreshToken();


    
    if (!refresh) {
      console.warn("[REFRESH] No valid refresh token");
      return false;
    }


    try{
      setIsRefreshing(true);

      const response = await 
        fetch("http://localhost:8080/api/v1/token/get-access-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refresh }),
        },
      );

      
      if (!response.ok) {
          console.warn("[REFRESH] Failed with status:", response.status);
          return false;
      }


      const data = await response.json();

      
      if (!data?.accessToken || !data?.refresh?.token || !data?.refresh?.expiresAt) {
        console.error("[REFRESH] Unexpected response shape", data);
        return false;
      }


      setAccessToken(data.accessToken);
      setRefreshToken(data.refresh.token, data.refresh.expiresAt);
      
      await delay(5000);
      
      
      console.info("[REFRESH] Success - new tokens saved");
      return true;

    }catch(err){
      
      console.error("[REFRESH] Error:", err);
      return false;

    } finally {
      setIsRefreshing(false);
    }

  }, []);

  


  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  const fetchData = useCallback(async () => {


    if(!accessToken && !refreshToken) {
      setError({
        message: "Not authenticated",
        status: 401,
        timestamp: new Date().toISOString(),
        detail: "Please login first",
      });
      setLoading(false);
      return;
    }


    if(isRefreshTokenExpired()){
      setError({
        message: "No Valid Refresh Token",
        status: 401,
        timestamp: new Date().toISOString(),
        detail: "Please login again",
      });
      setLoading(false);
      return;
    }



    if (!accessToken) {
      console.info("[AUTH] No access token, attempting refresh...");
      const ok = await getAccessTokenFromRefreshToken();
      if (!ok) {
        setError({
          message: "Unable to refresh session",
          status: 401,
          timestamp: new Date().toISOString(),
          detail: "Please login again",
        });
        setLoading(false);
        return;
      }
    }



    let cancelled = false;
    setLoading(true);
    setError(null);



    try {
      const data = await fetchMenuItems();
      if (cancelled) return;

      const normalized = Array.isArray(data) ? data.map(normalizeProduct) : [];
      setProducts(normalized);

    } catch (err) {

      if (cancelled) return;

      const backendError = err instanceof ProductApiError ? err.backendError : toBackendError(err);

      if(backendError.status === 401 && !isRefreshing){
        console.warn("[AUTH] 401 from API, trying to refresh then retry...");
        const ok = await getAccessTokenFromRefreshToken();

        if(!ok){
          try{
            const data2 = await fetchMenuItems();
            if(!cancelled){
              const normalized = Array.isArray(data2) ? data2.map(normalizeProduct) : [];
              setProducts(normalized);
              return;
            }
          } catch (retryErr) {
            if(!cancelled){
              setError(retryErr instanceof ProductApiError ? retryErr.backendError : toBackendError(retryErr));
            }
            return;
          }
        }
      }

      setError(backendError);

    } finally {

      if (!cancelled) setLoading(false);

    }
  }, [accessToken]);




  // Connect WebSocket for real-time updates
  useProductWebSocket(getAccessToken() || undefined, setProducts);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    products, 
    loading, 
    isRefreshing,
    error, 
    refetch: fetchData, 
    setProducts 
  };
}