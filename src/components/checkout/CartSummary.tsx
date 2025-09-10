// src/pages/menu/components/CartSummary.tsx
import React from "react";
import { Trash2, Wand2 } from "lucide-react"; // Wand2 = customization icon
import { useCart } from "@/hooks/useCart";
import type { Cart, Product } from "@/api";

type Props = {
  cart?: Cart;             // external cart (e.g., from OrderReview) - read-only
  onProceed?: () => void;  // optional: continue checkout
};

const CartSummary: React.FC<Props> = ({ cart, onProceed }) => {
  const { cart: contextCart, addToCart, removeFromCart } = useCart();

  // If external cart passed, use it. Otherwise, use context cart
  const activeCart = cart ? cart.items : contextCart;
  const total = cart
    ? cart.total
    : contextCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3">
        Your Cart 🛒
      </h2>

      {activeCart.length === 0 ? (
        <p className="text-slate-500 text-center py-6">
          Your cart is empty.
        </p>
      ) : (
        activeCart.map((item) => {
          const product = item.product as Product;
          const isCustomized = product.customized === true;

          return (
            <div
              key={product._id}
              className={`flex items-center justify-between py-3 border-b last:border-b-0
                ${isCustomized ? "bg-yellow-50" : ""}`}
            >
              {isCustomized ? (
                <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                  <Wand2 size={28} />
                </div>
              ) : (
                <img
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `${BACKEND_URL}${product.image}`
                  }
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
              )}

              <div className="flex-1">
                <p className="font-medium text-slate-800">{product.name}</p>
                {isCustomized && (
                  <span className="text-xs text-yellow-700 font-semibold">
                    Customized
                  </span>
                )}

                {/* Only show quantity buttons if no external cart (interactive) */}
                {!cart && (
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                      onClick={() => removeFromCart(product)}
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                )}

                <p className="text-sm text-slate-500 mt-1">
                  GHS {product.price} each
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">
                  GHS {(product.price * item.quantity).toFixed(2)}
                </span>

                {/* Only show remove button if no external cart */}
                {!cart && (
                  <button
                    className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                    onClick={() => removeFromCart(product)}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Total */}
      <div className="pt-4 flex justify-between items-center font-bold text-lg border-t">
        <span>Total:</span>
        <span className="text-rose-600">GHS {total.toFixed(2)}</span>
      </div>

      {/* Only show proceed button if cart is interactive */}
      {!cart && activeCart.length > 0 && onProceed && (
        <button
          onClick={onProceed}
          className="w-full mt-4 py-3 rounded-xl font-medium shadow bg-rose-600 hover:bg-rose-700 text-white transition"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;
