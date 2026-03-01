import React from "react";
import { CartItemProps } from "../../types/pos";

export const CartItemRow: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const isOutOfStock = item.in_stock === false;
  const isDrink = item.category_type === "DRINK";

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg border ${
        isOutOfStock
          ? "bg-red-50 border-red-200 opacity-60"
          : isDrink
          ? "bg-blue-50 border-blue-100"
          : "bg-orange-50 border-orange-100"
      }`}
    >
      <div className="flex-1 min-w-0">
        <h4
          className={`font-medium text-sm truncate ${
            isOutOfStock ? "line-through text-red-600" : ""
          }`}
        >
          {item.name}
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>${item.price.toFixed(2)}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              isDrink
                ? "bg-blue-200 text-blue-800"
                : "bg-orange-200 text-orange-800"
            }`}
          >
            {item.category_type}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          disabled={isOutOfStock}
          className="w-6 h-6 bg-white border rounded hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 text-sm"
        >
          −
        </button>
        <span className="w-6 text-center font-medium text-sm">
          {item.cartQuantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          disabled={isOutOfStock}
          className="w-6 h-6 bg-white border rounded hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 text-sm"
        >
          +
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="ml-4 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 cursor-pointer transition-colors"
        >
          <i className="fa-solid fa-xmark transform translate-y-[1px]"></i>
        </button>
      </div>
    </div>
  );
};