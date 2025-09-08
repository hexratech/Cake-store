import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { SuccessAnimation } from "@/animation/success-animation";
import { CakeCookiesLoader } from "@/animation/order_loader";
import CartSummary from "./CartSummary";
import type { Cart, PaymentMethod } from "@/api/index";

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type Props = {
  customer: Customer;
  paymentMethod: Extract<PaymentMethod, "card" | "mobile-money" | "cash">;
  cart: Cart;
  onPlaceOrder?: () => void;
};

const OrderReview: React.FC<Props> = ({
  customer,
  paymentMethod,
  cart,
  onPlaceOrder,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);

      // If Paystack integration needed
      if (paymentMethod === "card" || paymentMethod === "mobile-money") {
        if (!window.PaystackPop) {
          throw new Error("Paystack script not loaded.");
        }

        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: customer.email,
          amount: Math.round(cart.total * 100), // in kobo
          currency: "GHS",
          ref: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          onClose: () => {
            setIsLoading(false);
            console.log("Payment cancelled.");
          },
          callback: (response: { reference: string }) => {
            console.log("Payment successful:", response);
            setIsSuccess(true);
            onPlaceOrder?.();
            setTimeout(() => window.location.reload(), 2000);
          },
        });

        handler.openIframe();
      } else {
        // Cash on delivery
        setTimeout(() => {
          setIsSuccess(true);
          onPlaceOrder?.();
          setTimeout(() => window.location.reload(), 2000);
        }, 1500);
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      setIsLoading(false);
      alert(err instanceof Error ? err.message : "Payment failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
      {/* Header */}
      <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
        <CheckCircle2 className="text-rose-500" size={22} />
        Review Your Order
      </h2>

      {/* Customer Info */}
      <div className="space-y-2 text-slate-700">
        <div>
          <span className="font-medium text-slate-900">Name:</span> {customer.name || "—"}
        </div>
        <div>
          <span className="font-medium text-slate-900">Phone:</span> {customer.phone || "—"}
        </div>
        <div>
          <span className="font-medium text-slate-900">Email:</span> {customer.email || "—"}
        </div>
        <div>
          <span className="font-medium text-slate-900">Address:</span> {customer.address || "—"}
        </div>
        <div>
          <span className="font-medium text-slate-900">Payment:</span>{" "}
          <span className="capitalize">{paymentMethod}</span>
        </div>
      </div>

      {/* Cart Summary */}
      <CartSummary cart={cart} />

      {/* Action Button */}
      <div className="w-full">
        {isLoading ? (
          <Button disabled className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium shadow">
            <CakeCookiesLoader />
          </Button>
        ) : isSuccess ? (
          <div className="w-full py-3 rounded-xl bg-green-100 text-center">
            <SuccessAnimation />
          </div>
        ) : (
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium shadow hover:bg-rose-700 transition-colors"
          >
            Place Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderReview;
