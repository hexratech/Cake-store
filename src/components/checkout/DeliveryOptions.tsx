// src/components/checkout/DeliveryOptions.tsx

import { toast } from "sonner";

export type DeliveryMethod = "Delivery" | "Pickup";

type DeliveryOptionsProps = {
  selectedMethod: DeliveryMethod | null;
  onSelect: (method: DeliveryMethod) => void;
  deliveryDate: string;
  deliveryTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  pickupDate: string;
  pickupTime: string;
  onPickupDateChange: (date: string) => void;
  onPickupTimeChange: (time: string) => void;
};

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedMethod,
  onSelect,
  deliveryDate,
  deliveryTime,
  onDateChange,
  onTimeChange,
  pickupDate,
  pickupTime,
  onPickupDateChange,
  onPickupTimeChange,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (selectedMethod === "Delivery") {
      onDateChange(dateValue);
    } else {
      onPickupDateChange(dateValue);
    }
    const selected = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || diffDays === 1) {
      toast("Extra fee wii be paid on express");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (timeValue < "08:00" || timeValue > "17:00") {
      toast.error("Time must be between 08:00 and 17:00");
      return;
    }
    if (selectedMethod === "Delivery") {
      onTimeChange(timeValue);
    } else {
      onPickupTimeChange(timeValue);
    }
  };

  return (
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
      {(selectedMethod === "Delivery" || selectedMethod === "Pickup") && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              {selectedMethod === "Delivery" ? "Delivery Date" : "Pickup Date"}
            </label>
            <input
              type="date"
              value={selectedMethod === "Delivery" ? deliveryDate : pickupDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              {selectedMethod === "Delivery" ? "Delivery Time" : "Pickup Time"}
            </label>
            <input
              type="time"
              value={selectedMethod === "Delivery" ? deliveryTime : pickupTime}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              min="08:00"
              max="17:00"
            />
          </div>
        </div>
      )}
    </div>
  );
};
