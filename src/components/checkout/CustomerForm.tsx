// src/components/checkout/CustomerForm.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export type CustomerData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type CustomerFormProps = {
  onComplete: (data: CustomerData) => void;
};

export const CustomerForm: React.FC<CustomerFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Customer Information</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

      <div className="space-y-1">
        <Label htmlFor="name">Full Name <span className="text-rose-500">*</span></Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">Phone Number <span className="text-rose-500">*</span></Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email <span className="text-rose-500">*</span></Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Delivery Address <span className="text-rose-500">*</span></Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>

      <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors">
        Continue to Review
      </button>
    </form>
  );
};

export default CustomerForm;
