// src/components/checkout/CartSummary.tsx
import React from "react";
import type { CartItem } from "@/contexts/CartContext";

type CartSummaryProps = {
  cart: CartItem[];
  cartTotal: number;
};

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, cartTotal }) => (
  <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
    <h3 className="text-2xl font-bold text-slate-800 mb-4">Order Summary</h3>

    {cart.length === 0 ? (
      <p className="text-slate-500 text-center py-4">Your cart is empty.</p>
    ) : (
      <>
        <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {cart.map((item) => {
            const price = item.type === "product" ? item.product.price : item.customCake.totalPrice;
            const name = item.type === "product" ? item.product.name : `${item.customCake.flavor} Cake`;
            return (
              <li key={item.type === "product" ? item.product._id : item.customCake.id} className="flex items-start gap-4">
                <img
                  src={item.type === "product" ? item.product.image || "/placeholder.png" : "/custom-cake-placeholder.png"}
                  alt={name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <span className="block font-medium text-slate-700">{name}</span>
                  <span className="block text-sm text-slate-500">
                    {item.type === "custom" ? `${item.customCake.size}, ${item.customCake.layers} layers` : "Standard"}
                  </span>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-semibold text-slate-800">{item.quantity} x GHS {price.toFixed(2)}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center font-bold text-lg">
          <span>Total:</span>
          <span>GHS {cartTotal.toFixed(2)}</span>
        </div>
      </>
    )}
  </div>
);

export default CartSummary;
