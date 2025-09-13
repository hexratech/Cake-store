// src/components/checkout/DeliveryOptions.tsx
import React from "react";

export type DeliveryMethod = "Delivery" | "Pickup";

type DeliveryOptionsProps = {
  selectedMethod: DeliveryMethod | null;
  onSelect: (method: DeliveryMethod) => void;
};

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ selectedMethod, onSelect }) => {
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Delivery Options</h2>

      <div className="space-y-3">
        {/* Delivery */}
        <label
          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
            selectedMethod === "Delivery" ? "border-rose-500 bg-rose-50" : "hover:border-rose-400"
          }`}
        >
          <input
            type="radio"
            name="delivery"
            value="Delivery"
            checked={selectedMethod === "Delivery"}
            onChange={(e) => onSelect(e.target.value as DeliveryMethod)}
            className="accent-rose-600"
          />
          <span className="text-slate-700 font-medium">Delivery</span>
        </label>

        {/* Pickup */}
        <label
          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
            selectedMethod === "Pickup" ? "border-rose-500 bg-rose-50" : "hover:border-rose-400"
          }`}
        >
          <input
            type="radio"
            name="delivery"
            value="Pickup"
            checked={selectedMethod === "Pickup"}
            onChange={(e) => onSelect(e.target.value as DeliveryMethod)}
            className="accent-rose-600"
          />
          <span className="text-slate-700 font-medium">Pickup</span>
        </label>
      </div>
    </div>
  );
};
