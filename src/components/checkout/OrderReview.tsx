import React from "react";
import { useCart } from "@/hooks/useCart";
import type { CartItem } from "@/contexts/CartContext";

interface OrderReviewProps {
  deliveryMethod?: "Delivery" | "Pickup";
  deliveryDate?: string;
  deliveryTime?: string;
  pickupDate?: string;
  pickupTime?: string;
}

export const OrderReview: React.FC<OrderReviewProps> = ({
  deliveryMethod,
  deliveryDate,
  deliveryTime,
  pickupDate,
  pickupTime,
}) => {
  const { cart, cartTotal } = useCart();

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-6">
      <h2 className="text-xl font-serif font-semibold text-slate-800 border-b pb-2">
        Review Your Order
      </h2>

      {/* 🧁 Cart Items */}
      <div className="space-y-2">
        {cart.length === 0 ? (
          <p className="text-slate-500 text-center py-4">
            Your cart is empty.
          </p>
        ) : (
          cart.map((item: CartItem) => {
            const key =
              item.type === "product"
                ? item.product._id
                : item.customCake.id;
            const name =
              item.type === "product"
                ? item.product.name
                : `Custom Cake`;
            const price =
              item.type === "product"
                ? item.product.price
                : item.customCake.totalPrice;
            return (
              <div
                key={key}
                className="flex justify-between items-center text-sm sm:text-base"
              >
                <span className="text-slate-700">
                  {name} x{item.quantity}
                </span>
                <span className="font-medium text-slate-800">
                  GHS {(price * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* 🚚 Delivery / Pickup Details */}
      {deliveryMethod && (
        <div className="border-t pt-4 space-y-2 text-sm sm:text-base">
          <h3 className="font-semibold text-slate-800">
            {deliveryMethod === "Delivery"
              ? "Delivery Details"
              : "Pickup Details"}
          </h3>

          {deliveryMethod === "Delivery" ? (
            <>
              <p className="text-slate-600">
                <span className="font-medium">Date:</span>{" "}
                {deliveryDate || "Not selected"}
              </p>
              <p className="text-slate-600">
                <span className="font-medium">Time:</span>{" "}
                {deliveryTime || "Not selected"}
              </p>
            </>
          ) : (
            <>
              <p className="text-slate-600">
                <span className="font-medium">Date:</span>{" "}
                {pickupDate || "Not selected"}
              </p>
              <p className="text-slate-600">
                <span className="font-medium">Time:</span>{" "}
                {pickupTime || "Not selected"}
              </p>
            </>
          )}
        </div>
      )}

      {/* 💰 Total */}
      <div className="pt-4 flex justify-between items-center font-bold text-lg border-t">
        <span>Total:</span>
        <span className="text-rose-600">
          GHS {cartTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
