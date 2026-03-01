import React from "react";
import { ProductCardProps } from "../../types/pos";

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isDrink = product.category_type === "DRINK";

  return (
    <button
      onClick={onClick}
      disabled={!product.in_stock}
      className={`w-[300px] h-[380px] cursor-pointer bg-white rounded-[14px] shadow p-4 text-left transition-all hover:shadow-lg relative flex flex-col ${
        !product.in_stock
          ? "opacity-50 cursor-not-allowed grayscale"
          : "hover:-translate-y-1 active:scale-95"
      } ${
        isDrink
          ? "border-2 border-blue-500"
          : "border-2 border-orange-500"
      }`}
    >
      <div className="relative w-full h-[260px] shrink-0 mb-3">
        <img
          src={product.image_url || "https://placehold.co/200x140?text=No+Image"}
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
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {product.category_name}
          </p>
        </div>
        <p className="text-lg font-bold text-blue-600 mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </button>
  );
};