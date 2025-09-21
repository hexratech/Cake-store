// src/components/checkout/CustomerForm.tsx
import React, { useState } from "react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export type CustomerData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate?: string;
  deliveryTime?: string;
};

type CustomerFormProps = {
  onComplete: (data: CustomerData) => void;
  initialValues?: CustomerData;
};

export const CustomerForm: React.FC<CustomerFormProps> = ({ onComplete, initialValues }) => {
  const [formData, setFormData] = useState<CustomerData>(
    initialValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
      deliveryDate: "",
      deliveryTime: "",
    }
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "deliveryDate") {
      const today = new Date();
      const selectedDate = new Date(value);
      const diffDays = Math.floor((selectedDate.getTime() - today.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
      if (diffDays === 0 || diffDays === 1) {
        toast("Extra fee will be paid for quick service");
      }
    }
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
      <h2 className="text-xl font-serif font-semibold text-slate-800 border-b pb-2">Customer Information</h2>
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
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="text-sm px-2 py-1 h-8" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Delivery Address <span className="text-rose-500">*</span></Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} className="text-sm px-2 py-1 h-8" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="deliveryDate">Delivery Date <span className="text-rose-500">*</span></Label>
  <Input id="deliveryDate" name="deliveryDate" type="date" className="text-sm px-2 py-1 h-8" value={formData.deliveryDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="deliveryTime">Delivery Time <span className="text-rose-500">*</span></Label>
        <Input id="deliveryTime" name="deliveryTime" type="time" min="08:00" max="17:00" className="text-sm px-2 py-1 h-8" value={formData.deliveryTime} onChange={handleChange}/>
        <span className="text-xs text-slate-500">Get your deliveries between 8:00am and 5:00pm</span>
      </div>

      <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors">
        Continue to Review
      </button>
    </form>
  );
};

export default CustomerForm;
