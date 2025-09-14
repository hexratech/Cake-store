import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "@/hooks/useCart"; // ✅ Ensure this path is correct

// Define cart item types
type CartProductItem = {
  type: "product";
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

type CartCustomCakeItem = {
  type: "customCake";
  customCake: {
    id: string;
    flavor: string;
    totalPrice: number;
    base?: string;
    frosting?: string;
    filling?: string;
    size?: string;
    toppings?: string[];
    note?: string;
    design?: string;
    designImage?: string;
  };
  quantity: number;
};

export type CartItem = CartProductItem | CartCustomCakeItem;

interface PaymentVerificationResponse {
  message: string;
  payment: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  order: {
    items: CartItem[];
  };
}

const API_URL = "https://cake-store-60hq.onrender.com";

// ✅ SVG Icons
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-500 mx-auto">
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-blue-500 mx-auto animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const TimesCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-red-500 mx-auto">
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-2.78 2.78a.75.75 0 1 0 1.06 1.06L12 13.06l2.78 2.78a.75.75 0 1 0 1.06-1.06L13.06 12l2.78-2.78a.75.75 0 0 0-1.06-1.06L12 10.94l-2.78-2.78Z"
      clipRule="evenodd"
    />
  </svg>
);

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [paymentDetails, setPaymentDetails] = useState<PaymentVerificationResponse["payment"] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { clearCart } = useCart();

  useEffect(() => {
    if (!reference) {
      setVerificationStatus("failed");
      return;
    }

    const verifyPaymentAndSaveOrder = async () => {
      try {
        const res = await axios.get<PaymentVerificationResponse>(`${API_URL}/api/payments/complete-order/${reference}`);

        if (res.data.payment.status !== "success") {
          setVerificationStatus("failed");
          console.error("Payment status is not 'success'. Status:", res.data.payment.status);
          setErrorMessage(res.data.message);
          return;
        }

        setPaymentDetails(res.data.payment);
        setVerificationStatus("success");
        clearCart();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || "Payment verification failed. Please try again.";
          console.error("Payment verification or order save failed:", error.response?.data || error.message);
          setErrorMessage(message);
        } else {
          console.error("An unexpected error occurred:", error);
          setErrorMessage("An unexpected error occurred.");
        }
        setVerificationStatus("failed");
      }
    };

    verifyPaymentAndSaveOrder();
  }, [reference, clearCart]);

  useEffect(() => {
    if (verificationStatus === "success") {
      const timer = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <>
            <SpinnerIcon />
            <h2 className="mt-4 text-2xl font-bold text-slate-700">Verifying Payment...</h2>
            <p className="text-slate-500">Please do not close this page.</p>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircleIcon />
            <h2 className="mt-4 text-2xl font-bold text-green-700">Payment Successful!</h2>
            <p className="text-slate-600 mt-2">Your order has been placed successfully.</p>
            {paymentDetails && (
              <div className="mt-4 text-sm text-slate-500 space-y-1">
                <p>
                  <span className="font-medium">Amount Paid:</span>{" "}
                  {paymentDetails.currency} {paymentDetails.amount.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Transaction Reference:</span>{" "}
                  {paymentDetails.reference}
                </p>
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {paymentDetails.customer?.name ||
                    paymentDetails.customer?.email ||
                    "N/A"}
                </p>
              </div>
            )}
            <p className="mt-4 text-sm text-slate-500">Redirecting to the store in 5 seconds...</p>
            <Link
              to="/"
              className="mt-6 inline-block bg-rose-600 text-white font-medium py-2 px-6 rounded-full shadow hover:bg-rose-700 transition"
            >
              Back to Store
            </Link>
          </>
        );
      case "failed":
        return (
          <>
            <TimesCircleIcon />
            <h2 className="mt-4 text-2xl font-bold text-red-700">Payment Failed</h2>
            <p className="text-slate-600 mt-2">
              {errorMessage || "There was an issue verifying your payment. Please try again."}
            </p>
            <Link
              to="/checkout"
              className="mt-6 inline-block bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-full shadow hover:bg-slate-300 transition"
            >
              Back to Checkout
            </Link>
          </>
        );
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-rose-50 text-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccess;
