import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardService, ShopProfileResponse } from '../services/adminDashboardService';
import { getAccessToken, getRefreshToken } from '../services/authService';



interface ShopContextType {
  shopName: string;
  shopLogo: string | null;
  shopAddress: string;
  shopContact: string;
  shopDescription: string;
  shopRegion: string;
  isLoading: boolean;
  refreshShopProfile: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopProfile, setShopProfile] = useState<ShopProfileResponse | null>(null);
  const [branding, setBranding] = useState<{ name: string; image_url: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShopData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch public branding (Always)
      const brandingData = await dashboardService.getShopBranding();
      setBranding(brandingData);

      // 2. Fetch full profile (Only if authenticated)
      if (getAccessToken() || getRefreshToken()) {
        const fullProfile = await dashboardService.getShopProfile();
        setShopProfile(fullProfile);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  // Prioritize branding data, fallback to full profile
  const finalName = branding?.name || shopProfile?.name || 'A5 Coffee';
  const rawLogo = branding?.image_url || shopProfile?.image_url;
  
  // Format logo URL: handle absolute URLs (S3, blobs) vs relative paths
  const finalLogo = rawLogo 
    ? (rawLogo.startsWith('http') || rawLogo.startsWith('blob:') 
        ? rawLogo 
        : `${API_BASE_URL}${rawLogo}`)
    : null;

  const value: ShopContextType = {
    shopName: finalName,
    shopLogo: finalLogo,
    shopAddress: shopProfile?.address || '',
    shopContact: shopProfile?.contact || '',
    shopDescription: shopProfile?.description || '',
    shopRegion: shopProfile?.region || '',
    isLoading,
    refreshShopProfile: fetchShopData,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
