import React from "react";
import { CheckCircle2 } from "lucide-react";

type Props = {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  paymentMethod: "cash" | "card" | "mobile-money";
  onPlaceOrder: () => void;
};

const OrderReview: React.FC<Props> = ({
  customer,
  paymentMethod,
  onPlaceOrder,
}) => {
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

      {/* Confirm Button */}
      <button
        onClick={onPlaceOrder}
        className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium shadow hover:bg-rose-700 transition-colors"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderReview;
