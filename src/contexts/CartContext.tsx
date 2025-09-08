import React, { createContext, useState, useMemo, type ReactNode,} from "react";
import type { Product } from "@/api/index";

// Define a single item in the cart
export type CartItem = {
  product: Product;
  quantity: number;
};

// Cart context type
export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  cartCount: number; // total number of items
  total: number;     // total price of all items
};

// Create context with undefined initial value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (product: Product) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // Clear the entire cart
  const clearCart = () => setCart([]);

  // Total number of items in cart
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Total price of all items
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, clearCart, cartCount, total }),
    [cart, cartCount, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to consume CartContext


export default CartContext;
