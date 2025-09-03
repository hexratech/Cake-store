import React from "react";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

type Props = {
  paymentMethod: "cash" | "card" | "mobile-money";
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<"cash" | "card" | "mobile-money">
  >;
};

const PaymentOptions: React.FC<Props> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  const options = [
    { id: "cash", label: "Cash on Delivery", icon: Wallet },
    { id: "card", label: "Card Payment", icon: CreditCard },
    { id: "mobile-money", label: "Mobile Money", icon: Smartphone },
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Payment Method</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPaymentMethod(id)}
            className={`flex flex-col items-center gap-2 border rounded-xl p-4 text-sm font-medium transition-all ${
              paymentMethod === id
                ? "border-rose-500 bg-rose-50 text-rose-600 shadow"
                : "border-gray-300 hover:border-rose-400 hover:bg-gray-50"
            }`}
          >
            <Icon
              size={22}
              className={`${
                paymentMethod === id ? "text-rose-500" : "text-gray-500"
              }`}
            />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;
