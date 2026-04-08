// src/hooks/usePublicMenu.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "../types";
import { normalizeProduct } from "../utils/productUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const PAGE_SIZE = 20;

interface PublicMenuPage {
  content: unknown[];
  totalPages: number;
  totalElements: number;
  number: number;
  last: boolean;
}

export interface UsePublicMenuResult {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalElements: number;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function usePublicMenu(): UsePublicMenuResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false); // false until first page resolves
  const [totalElements, setTotalElements] = useState(0);

  // Track the "reset" signal so refetch() restarts from page 0
  const resetRef = useRef(0);

  const fetchPage = useCallback(async (page: number, reset: boolean) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const url = `${API_BASE_URL}/api/v1/product/user-menu?page=${page}&size=${PAGE_SIZE}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to load menu (${res.status})`);
      }

      const data: PublicMenuPage = await res.json();
      const normalized = Array.isArray(data.content)
        ? data.content.map(normalizeProduct)
        : [];

      if (reset) {
        setProducts(normalized);
      } else {
        setProducts((prev) => [...prev, ...normalized]);
      }

      setTotalElements(data.totalElements ?? 0);
      setHasMore(!data.last);
      setCurrentPage(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial fetch + refetch
  useEffect(() => {
    fetchPage(0, true);
  }, [fetchPage, resetRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNextPage = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPage(currentPage + 1, false);
    }
  }, [fetchPage, currentPage, loadingMore, hasMore]);

  const refetch = useCallback(() => {
    resetRef.current += 1;
    // Trigger re-run of the effect by bumping the ref
    fetchPage(0, true);
  }, [fetchPage]);

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    totalElements,
    fetchNextPage,
    refetch,
  };
}
