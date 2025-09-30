// src/api/index.ts

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
  customized?: boolean;
  customCakeData?: CustomCakeData;
};

/**
 * Custom Cake data for the custom cake request
 */
export type CustomCakeData = {
  flavor: string;
  size: string;
  layers: string;
  icing: string;
  toppings: string[];
  notes?: string;
  totalPrice: number;
};

/**
 * Frontend Cart Item types
 * This is what your frontend state should hold
 */
export type RegularProductCartItem = {
  type: "product";
  product: Product;
  quantity: number;
};

export type CustomCakeCartItem = {
  type: "customCake";
  customCakeData: CustomCakeData;
  id: string; // Temporary ID from the backend
  quantity: number;
};

export type CartItem = RegularProductCartItem | CustomCakeCartItem;

/**
 * Order Item types for the backend payload
 * This uses a discriminated union for clarity
 */
export type OrderProductItem = {
  type: "product";
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderCustomCakeItem = {
  type: "customCake";
  customCakeData: CustomCakeData;
  quantity: number;
};

export type OrderItem = OrderProductItem | OrderCustomCakeItem;

/**
 * Customer & Order types
 */
export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type PaymentMethod = "card" | "mobile-money";

export type Order = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentId?: string;
};

/**
 * API calls
 */
export const fetchProducts = async (query?: string): Promise<Product[]> => {
  const url = query
    ? `${API_URL}/api/products?${query}`
    : `${API_URL}/api/products`;

  const res = await fetch(url);

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

export const submitOrder = async (order: Order) => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Failed to submit order");
  return res.json();
};
