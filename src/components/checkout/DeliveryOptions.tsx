// src/components/checkout/DeliveryOptions.tsx
import React, { useState, useEffect } from "react";

export type DeliveryMethod = "Delivery" | "Pickup";

type DeliveryOptionsProps = {
  selectedMethod: DeliveryMethod | null;
  onSelect: (method: DeliveryMethod) => void;
  deliveryDate: string;
  deliveryTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
};

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedMethod,
  onSelect,
  deliveryDate,
  deliveryTime,
  onDateChange,
  onTimeChange,
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedMethod === "Delivery") {
      setShowModal(true);
    }
  }, [selectedMethod]);

  return (
    <>
      <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
        <h2 className="text-xl font-serif font-semibold text-slate-800 border-b pb-2">
          Delivery Options
        </h2>

        <div className="space-y-3">
          {/* Delivery */}
          <label
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedMethod === "Delivery"
                ? "border-rose-500 bg-rose-50"
                : "hover:border-rose-400"
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
              selectedMethod === "Pickup"
                ? "border-rose-500 bg-rose-50"
                : "hover:border-rose-400"
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

        {/* Show date and time inputs only for Delivery */}
        {selectedMethod === "Delivery" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                Delivery Time
              </label>
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal for Yango info */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
          <div
            className="bg-white rounded-2xl shadow-xl p-2 sm:p-8 w-[95vw] max-w-xs sm:max-w-md mx-auto text-center relative"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <h3 className="text-base sm:text-xl font-bold text-rose-600 mb-4">
              Delivery Information
            </h3>
            <p className="text-slate-700 mb-6 text-xs sm:text-base">
              We partner with Yango for all our delivery services. Delivery
              prices may vary due to factors like distance and traffic. You’ll
              pay upon arrival.
            </p>
            <button
              className="mt-2 px-3 py-2 sm:px-6 sm:py-2 rounded-lg bg-rose-600 text-white font-semibold shadow hover:bg-rose-700 transition w-full sm:w-auto"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
