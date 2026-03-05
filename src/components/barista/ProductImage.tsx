import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import { getFallbackImage } from '../../utils/orderHelpers';
import { OrderStatus } from '../../types/order';

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
  const [imgSrc, setImgSrc] = useState<string>(src || getFallbackImage(alt));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || getFallbackImage(alt));
    setHasError(false);
  }, [src, alt]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(getFallbackImage(alt));
      setHasError(true);
    }
  };

  return (
    <div className="relative shrink-0">
      <img 
        src={imgSrc}
        alt={alt}
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