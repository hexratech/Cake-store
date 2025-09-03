import React from "react";
import { useCart } from "@/hooks/useCart";
import { Trash2 } from "lucide-react";

const CartSummary: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, i) => sum + i.product.priceGHS * i.quantity,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
      {/* Header */}
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3">
        Your Cart 🛒
      </h2>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="text-slate-500 text-center py-6">
          Your cart is empty.
        </p>
      ) : (
        cart.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between py-3 border-b last:border-b-0"
          >
            <div className="flex-1">
              <p className="font-medium text-slate-800">{item.product.name}</p>
              <p className="text-sm text-slate-500">
                Qty: {item.quantity} × GHS {item.product.priceGHS}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900">
                GHS {(item.product.priceGHS * item.quantity).toFixed(2)}
              </span>
              <button
                className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                onClick={() => removeFromCart(item.product)}
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Total */}
      <div className="pt-4 flex justify-between items-center font-bold text-lg border-t">
        <span>Total:</span>
        <span className="text-rose-600">GHS {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
