import React, { useState } from "react";
import type { PaymentMethod } from "@/api"; // ✅ use shared type

type Props = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
  onNext?: () => void; // ✅ make this optional so parent can pass or skip
};

const PaymentOptions: React.FC<Props> = ({ paymentMethod, setPaymentMethod, onNext }) => {
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    setError(null);
    onNext?.(); // ✅ safe optional call
  };

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
        Payment Method
      </h2>

      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {/* Card */}
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-rose-400 transition">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="accent-rose-600"
          />
          <span className="text-slate-700 font-medium">
            Debit/Credit Card (via Paystack)
          </span>
        </label>

        {/* Mobile Money */}
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-rose-400 transition">
          <input
            type="radio"
            name="payment"
            value="mobile-money"
            checked={paymentMethod === "mobile-money"}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="accent-rose-600"
          />
          <span className="text-slate-700 font-medium">
            Mobile Money (via Paystack)
          </span>
        </label>

        {/* Cash on Delivery (disabled) */}
        <label className="flex items-center gap-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
          <input type="radio" name="payment" value="cash" disabled />
          <span className="text-slate-700 font-medium">
            Cash on Delivery (Disabled)
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="w-full py-3 rounded-xl font-medium shadow bg-rose-600 hover:bg-rose-700 text-white transition"
      >
        Continue to Review
      </button>
    </div>
  );
};

export default PaymentOptions;
