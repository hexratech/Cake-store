import React from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailure: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
      <AlertCircle size={64} className="text-red-600 mb-6" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Failed</h1>
      <p className="text-red-800 text-center mb-6">
        Oops! Something went wrong with your payment. Please try again.
      </p>
      <Link
        to="/checkout"
        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
      >
        Retry Checkout
      </Link>
    </div>
  );
};

export default PaymentFailure;
