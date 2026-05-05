// src/hooks/useTopProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/adminDashboardService';
import type { TopProductAPI, TopProductsRange } from '../components/admin/tabs/dashboard/types';

interface UseTopProductsResult {
  products: TopProductAPI[];
  unitsTarget: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTopProducts(
  range: TopProductsRange,
  size: number = 10,
): UseTopProductsResult {
  const [products, setProducts] = useState<TopProductAPI[]>([]);
  const [unitsTarget, setUnitsTarget] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getTopSellingProducts(range, 0, size);
      setProducts(data.top_products);
      setUnitsTarget(data.units_target);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load top products');
    } finally {
      setLoading(false);
    }
  }, [range, size]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, unitsTarget, loading, error, refetch: fetchData };
}
