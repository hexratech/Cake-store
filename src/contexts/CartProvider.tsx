// src/contexts/CartProvider.tsx
import React, { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { CartContext, type CartItem, type CustomCakeItem } from "./CartContext";
import type { Product } from "@/api/index";

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add standard product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.type === "product" && item.product._id === product._id);
      if (existing) {
        return prevCart.map(item =>
          item.type === "product" && item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { type: "product", product, quantity: 1 }];
    });
  };

  // Remove standard product from cart
  const removeFromCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.type === "product" && item.product._id === product._id);
      if (existing && existing.quantity > 1) {
        return prevCart.map(item =>
          item.type === "product" && item.product._id === product._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => !(item.type === "product" && item.product._id === product._id));
    });
  };

  // Add custom cake to cart (increment if exists)
  const addCustomCakeToCart = (customCakeData: Omit<CustomCakeItem, 'quantity'>) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.type === "custom" && item.customCake.id === customCakeData.id);
      if (existing) {
        return prevCart.map(item =>
          item.type === "custom" && item.customCake.id === customCakeData.id
            ? { ...item, quantity: item.quantity + 1, customCake: { ...item.customCake, quantity: item.quantity + 1 } }
            : item
        );
      }
      const newCustomCake: CustomCakeItem = { ...customCakeData, quantity: 1 };
      return [...prevCart, { type: "custom", customCake: newCustomCake, quantity: 1 }];
    });
  };

  // Remove custom cake from cart
  const removeCustomCakeFromCart = (id: string) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.type === "custom" && item.customCake.id === id);
      if (existing && existing.quantity > 1) {
        return prevCart.map(item =>
          item.type === "custom" && item.customCake.id === id
            ? { ...item, quantity: item.quantity - 1, customCake: { ...item.customCake, quantity: item.quantity - 1 } }
            : item
        );
      }
      return prevCart.filter(item => !(item.type === "custom" && item.customCake.id === id));
    });
  };

  // Clear cart
  const clearCart = () => setCart([]);

  const value = useMemo(() => {
    const cartTotal = cart.reduce((total, item) => {
      if (item.type === "product") return total + (item.product.price || 0) * item.quantity;
      if (item.type === "custom") return total + item.customCake.totalPrice * item.quantity;
      return total;
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return {
      cart,
      addToCart,
      removeFromCart,
      addCustomCakeToCart,
      removeCustomCakeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
