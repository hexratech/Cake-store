import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const PaymentSuccess: React.FC = () => {
  const { clearCart } = useCart();

  // Clear cart on success
  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <CheckCircle size={64} className="text-green-600 mb-6" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
      <p className="text-green-800 text-center mb-6">
        Thank you for your order. Your payment has been received successfully.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default PaymentSuccess;
