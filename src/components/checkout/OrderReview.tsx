// src/components/checkout/OrderReview.tsx
import React from "react";
import { useCart } from "@/hooks/useCart";
import type { CartItem } from "@/contexts/CartContext";

export const OrderReview: React.FC = () => {
  const { cart, cartTotal } = useCart();

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Review Your Order</h2>

      <div className="space-y-2">
        {cart.length === 0 ? (
          <p className="text-slate-500 text-center py-4">Your cart is empty.</p>
        ) : (
          cart.map((item: CartItem) => {
            const key = item.type === "product" ? item.product._id : item.customCake.id;
            const name = item.type === "product" ? item.product.name : `Custom Cake`;
            const price = item.type === "product" ? item.product.price : item.customCake.totalPrice;
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-slate-700">{name} x{item.quantity}</span>
                <span className="font-medium text-slate-800">GHS { (price * item.quantity).toFixed(2) }</span>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-4 flex justify-between items-center font-bold text-lg border-t">
        <span>Total:</span>
        <span className="text-rose-600">GHS {cartTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};
