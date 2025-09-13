// src/contexts/CartContext.ts

import { createContext } from "react";
import type { Product } from "@/api/index";

// Define the shape of a custom cake item
export interface CustomCakeItem {
  id: string;
  flavor: string;
  size: string;
  layers: string;
  icing: string;
  toppings: string[];
  totalPrice: number;
  quantity: number;
}

// Define the shape of a cart item
export type CartItem =
  | { type: "product"; product: Product; quantity: number }
  | { type: "custom"; customCake: CustomCakeItem; quantity: number };

// Define the context value shape
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  addCustomCakeToCart: (customCake: Omit<CustomCakeItem, 'quantity'>) => void;
  removeCustomCakeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

// Create and export the context
export const CartContext = createContext<CartContextType | undefined>(undefined);