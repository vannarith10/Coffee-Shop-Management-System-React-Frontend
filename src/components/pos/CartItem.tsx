import React from "react";
import { CartItemProps } from "../../types/pos";


const glassListItem = (isOutOfStock:boolean|null, isDrink:boolean) => `
  flex justify-between items-center p-3 rounded-lg 
  backdrop-blur-md
  border border-white/30
  shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
  transition-all duration-300 ease-out
  hover:scale-[1.02] cursor-pointer
  ${isOutOfStock
    ? "bg-red-500/10 border-red-200/50 opacity-60 cursor-not-allowed"
    : isDrink
    ? "hover:bg-blue-500/20"
    : "hover:bg-orange-500/20"
  }
`;

export const CartItemRow: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const isOutOfStock = item.in_stock === false;
  const isDrink = item.category_type === "DRINK";

  return (
    <div
      className={glassListItem(isOutOfStock, isDrink)}
    >

      {/* This Cart Item at Current Order side */}
      <div className="flex items-start gap-3 ">
        {/* Image on the left */}
        <img
          src={item.image_url || "https://placehold.co/200x140?text=No+Image"}
          alt={item.name}
          className="w-14 h-14 rounded object-cover"
        />

        {/* Existing content */}
        <div className="flex flex-col h-14 justify-center gap-2 min-w-0 ">
          <h4
            className={`font-medium text-sm truncate ${
              isOutOfStock ? "line-through text-red-600" : ""
            }`}
          >
            {item.name}
          </h4>

          <div className="flex items-center gap-2 text-sm text-gray-800">
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
      </div>

      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          disabled={isOutOfStock}
          className="w-6 h-6 cursor-pointer bg-white border rounded hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 text-sm"
        >
          −
        </button>
        <span className="w-6 text-center font-medium text-sm">
          {item.cartQuantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          disabled={isOutOfStock}
          className="w-6 h-6 bg-white cursor-pointer border rounded hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 text-sm"
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