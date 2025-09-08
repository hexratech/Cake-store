// src/api/index.ts

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Product type
 */
export type Product = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  isPublished: boolean;
  isFeatured: boolean;
  slug: string;
  customized?: boolean; // used for cakes with custom options
};

/**
 * Cart types
 */
export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

/**
 * Customer type
 */
export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

/**
 * Payment
 */
export type PaymentMethod = "card" | "mobile-money" ; // ✅ allow all three

/**
 * Custom Cake request type
 */
export type CustomCakeData = {
  flavor: string;
  size: string;
  layers: string;
  icing: string;
  toppings: string[];
  notes?: string;
};

/**
 * API calls
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const addFavorite = async (productId: string, email?: string) => {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, customerEmail: email }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
};

export const removeFavorite = async (favoriteId: string) => {
  const res = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
};

export const requestCustomCake = async (
  data: CustomCakeData
): Promise<{ id: string }> => {
  const res = await fetch(`${API_URL}/api/custom-cakes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to request custom cake");
  return res.json();
};
