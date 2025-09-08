import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

type Props = {
  customer: Customer;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  onNext?: () => void; // Optional, won't throw error if not passed
};

const CustomerForm: React.FC<Props> = ({ customer, setCustomer, onNext }) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!customer.name || !customer.phone || !customer.email || !customer.address) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    onNext?.(); // Safe optional call
  };

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
        Customer Information
      </h2>

      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Full Name */}
      <div className="space-y-1">
        <Label htmlFor="name" className="block text-sm font-medium text-slate-600">
          Full Name *
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={customer.name}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <Label htmlFor="phone" className="block text-sm font-medium text-slate-600">
          Phone Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          name="phone"
          placeholder="+233 555 123 456"
          value={customer.phone}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email" className="block text-sm font-medium text-slate-600">
          Email Address * (required for payment)
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          value={customer.email}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          required
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <Label htmlFor="address" className="block text-sm font-medium text-slate-600">
          Delivery Address *
        </Label>
        <Input
          id="address"
          type="text"
          name="address"
          placeholder="123 Cake Street, Accra"
          value={customer.address}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          required
        />
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        className="w-full py-3 rounded-xl font-medium shadow bg-rose-600 hover:bg-rose-700 text-white transition"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default CustomerForm;
