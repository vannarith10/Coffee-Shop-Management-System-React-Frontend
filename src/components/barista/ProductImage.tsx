import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import { OrderStatus } from '../../types/order';

const PLACEHOLDER_URL = "https://placehold.co/200x140?text=No+Image"

interface ProductImageProps {
  src: string | null;
  alt: string;
  isCompleted: boolean;
  orderStatus: OrderStatus;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  isCompleted, 
  orderStatus 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || PLACEHOLDER_URL);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || PLACEHOLDER_URL);
    setHasError(false);
  }, [src, alt]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(PLACEHOLDER_URL);
      setHasError(true);
    }
  };

  return (
    <div className="relative shrink-0">
      <img 
        src={imgSrc}
        alt={alt || "No Image"}
        onError={handleError}
        className={`w-12 h-12 rounded-lg object-cover border-2 transition-all ${
          isCompleted 
            ? 'border-slate-200 dark:border-slate-700 grayscale' 
            : orderStatus === 'PREPARING' 
              ? 'border-emerald-500/30' 
              : 'border-slate-200 dark:border-slate-700'
        }`}
      />
      {!src && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
          <ImageOff className="w-5 h-5 text-slate-400" />
        </div>
      )}
    </div>
  );
};