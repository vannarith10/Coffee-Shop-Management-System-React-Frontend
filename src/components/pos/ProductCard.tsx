
//src/components/pos/ProductCard.tsx
import React from "react";
import { ProductCardProps } from "../../types/pos";

const glassCard = (isDrink:boolean, inStock:boolean|null) => `
  relative flex flex-col
  w-[300px] h-[380px]
  rounded-[14px] p-4
  text-left overflow-hidden
  cursor-pointer
  transition-all duration-[800ms]
  ease-[cubic-bezier(0.175,0.885,0.32,2.2)]
  border border-white/30
  bg-gradient-to-br from-white/20 via-white/[0.08] to-white/[0.03]
  backdrop-blur-md
  shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
  hover:scale-102
  ${isDrink ? "ring-blue-400/50" : "ring-orange-400/50"}
  ${!inStock
    ? "opacity-50 cursor-not-allowed grayscale"
    : "hover:-translate-y-1 active:scale-95"
  }
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
}) => {
  const isDrink = product.category_type === "DRINK";

  return (
    <button
      onClick={onClick}
      disabled={!product.in_stock}
      className={glassCard(isDrink, product.in_stock)}
    >
      <div className="relative w-full h-[260px] shrink-0 mb-3">
        <img
          src={
            product.image_url || "https://placehold.co/200x140?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs px-2 py-1 bg-red-600 rounded">
              OUT OF STOCK
            </span>
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${
            isDrink
              ? "bg-blue-100 text-blue-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {product.category_type}
        </span>
      </div>


      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div>
          <h3 className="font-semibold text-[#EBBF58] text-md line-clamp-2 leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#B1CBFA] truncate">
            {product.category_name}
          </p>
        </div>
        <p className="text-2xl font-bold text-white mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>


    </button>
  );


};
