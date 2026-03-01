import { useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import { CartItem } from "../types/pos";

export function useCart(products: Product[]) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync cart with WebSocket updates
  useEffect(() => {
    setCart((prevCart) => {
      if (prevCart.length === 0) return prevCart;

      const updatedCart = prevCart
        .map((cartItem) => {
          const updatedProduct = products.find((p) => p.id === cartItem.id);
          if (!updatedProduct) return cartItem;
          return {
            ...cartItem,
            ...updatedProduct,
            cartQuantity: cartItem.cartQuantity,
          };
        })
        .filter((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          return product?.in_stock !== false;
        });

      return updatedCart;
    });
  }, [products]);

  const addToCart = useCallback((product: Product) => {
    if (!product.in_stock) {
      alert("This item is currently out of stock!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = Math.max(0, item.cartQuantity + delta);
            return { ...item, cartQuantity: newQty };
          }
          return item;
        })
        .filter((item) => item.cartQuantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const outOfStockInCart = cart.filter((item) => item.in_stock === false);

  return {
    cart,
    cartTotal,
    cartItemCount,
    outOfStockInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}