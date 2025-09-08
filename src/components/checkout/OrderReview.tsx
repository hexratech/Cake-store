import React, { useState } from "react";
import axios from "axios";
import CartSummary from "./CartSummary";
import type { Cart, PaymentMethod } from "@/api/index";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type Props = {
  customer: Customer;
  paymentMethod: Extract<PaymentMethod, "card" | "mobile-money">;
  cart: Cart;
};

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackOptions) => PaystackHandler;
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  onClose?: () => void;
  callback: (response: PaystackCallback) => void;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackCallback {
  reference: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

// 🔹 FIX: Updated this type to match the backend's response structure
interface PaymentInitResponse {
  message: string;
  payment: {
    reference: string;
    authorization_url: string;
  };
}

const OrderReview: React.FC<Props> = ({ customer, paymentMethod, cart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    try {
      if (!customer.email || !cart.total || cart.total <= 0) {
        setError("Email and total price are required to place the order.");
        return;
      }

      setLoading(true);
      setError(null);

      // Initialize payment on backend
      const res = await axios.post<PaymentInitResponse>(`${API_URL}/api/payments/initiate`, {
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        paymentMethod,
        totalPrice: cart.total, // backend converts to amount
        items: cart.items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });

      const data = res.data;
      // 🔹 FIX: Correctly check for the nested reference
      if (!data.payment || !data.payment.reference) throw new Error("Payment initialization failed.");
      if (!window.PaystackPop) throw new Error("Paystack script not loaded.");

      // Launch Paystack modal
      const handler: PaystackHandler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_KEY!,
        email: customer.email,
        amount: Math.round(cart.total * 100), // kobo/pesewa
        currency: "GHS",
        // 🔹 FIX: Use the correct nested reference
        ref: data.payment.reference,
        onClose: () => console.log("Payment cancelled."),
        callback: (response: PaystackCallback) => {
          window.location.href = `/checkout/payment-success?reference=${response.reference}`;
        },
      });

      handler.openIframe();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Payment failed:", err);
      } else {
        setError("Payment failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Review & Confirm</h2>

      {/* Customer Info */}
      <div className="space-y-1 text-slate-700">
        <p><span className="font-medium">Name:</span> {customer.name}</p>
        <p><span className="font-medium">Email:</span> {customer.email}</p>
        <p><span className="font-medium">Phone:</span> {customer.phone}</p>
        <p><span className="font-medium">Address:</span> {customer.address}</p>
      </div>

      {/* Payment Method */}
      <p className="text-slate-700">
        <span className="font-medium">Payment Method:</span>{" "}
        {paymentMethod === "card" ? "Debit/Credit Card (Paystack)" : "Mobile Money (Paystack)"}
      </p>

      {/* Cart Summary */}
      <CartSummary cart={cart} onProceed={handlePlaceOrder} />

      {/* Error */}
      {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full py-3 rounded-xl font-medium shadow bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order & Pay"}
      </button>
    </div>
  );
};

export default OrderReview;
