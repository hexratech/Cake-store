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

// Interface for the expected response from our backend API
interface PaymentInitResponse {
  message: string;
  payment: {
    reference: string;
    authorization_url: string; // The URL to redirect the user to
  };
}

const OrderReview: React.FC<Props> = ({ customer, paymentMethod, cart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !customer.email ||
        !emailRegex.test(customer.email) ||
        typeof cart.total !== "number" ||
        cart.total <= 0
      ) {
        setError("A valid email and a positive total price are required to place the order.");
        return;
      }

      setLoading(true);
      setError(null);

      // Make the API call to your backend to initiate the payment
      const res = await axios.post<PaymentInitResponse>(`${API_URL}/api/payments/initiate`, {
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        paymentMethod,
        totalPrice: cart.total,
        items: cart.items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });

      const data = res?.data;

      // Check if the authorization URL was returned from the backend
      if (!data?.payment?.authorization_url) {
        throw new Error("Payment initialization failed: No authorization URL received.");
      }

      // Redirect the user to the authorization URL to complete the payment.
      // This is the correct way to handle a backend-initiated Paystack transaction.
      window.location.href = data.payment.authorization_url;

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Payment failed (Axios error):", err.response?.data || err.message);
        setError(err.response?.data?.message || "Payment initiation failed.");
      } else if (err instanceof Error) {
        setError(err.message);
        console.error("Payment failed:", err);
      } else {
        setError("Payment failed due to an unknown error.");
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
      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}

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
