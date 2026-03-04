import React from "react";
import { CartSidebarProps } from "../../types/pos";
import { CartItemRow } from "./CartItem";
import { CartSummary } from "./CartSummary";

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout,
}) => {
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const outOfStockInCart = cart.filter((item) => item.in_stock === false);

  return (
    <aside className="w-96 bg-white/95 backdrop-blur-sm shadow-2xl border-l flex flex-col h-screen flex-shrink-0 ">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50/80 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold">Current Order</h2>
          <p className="text-sm text-gray-500">{cartItemCount} items</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm bg-red-500 text-white cursor-pointer font-medium px-2 py-1 rounded hover:bg-red-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Out of Stock Warning */}
      {outOfStockInCart.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 p-3 flex-shrink-0">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ {outOfStockInCart.length} item(s) unavailable
          </p>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 bg-[linear-gradient(-225deg,#69EACB_0%,#EACCF8_48%,#6654F1_100%)] overflow-hidden flex flex-col min-h-0">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <p className="text-6xl mb-2">🛒</p>
            <p>Cart is empty</p>
            <p className="text-xs mt-1 text-gray-500">Click items to add</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden">
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <CartSummary
        subtotal={cartTotal}
        tax={cartTotal * 0.1}
        total={cartTotal * 1.1}
        itemCount={cartItemCount}
        hasItems={cart.length > 0}
        hasUnavailableItems={outOfStockInCart.length > 0}
        onCheckout={onCheckout}
      />
    </aside>
  );
};