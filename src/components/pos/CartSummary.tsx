import React from "react";
import { CartSummaryProps } from "../../types/pos";

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  total,
  hasItems,
  hasUnavailableItems,
  onCheckout,
}) => {
  const getButtonText = () => {
    if (hasUnavailableItems) return "Remove unavailable items";
    if (!hasItems) return "Add items to checkout";
    return "Process Payment";
  };

  return (
    <div className="border-t p-4 bg-gray-50 flex-shrink-0">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-gray-600">Tax (10%)</span>
        <span className="font-medium">${tax.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-300">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-blue-600">
          ${total.toFixed(2)}
        </span>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={!hasItems || hasUnavailableItems}
        className="w-full mb-5 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-600/20"
      >
        {getButtonText()}
      </button>
    </div>
  );
};