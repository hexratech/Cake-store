import React, { useState } from "react";
import { toast } from "sonner";
import type { FormEvent } from "react";

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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const todayISO = new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "deliveryDate") {
      const today = new Date();
      const selectedDate = new Date(value);
      const diffDays = Math.floor(
        (selectedDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 0 || diffDays === 1) {
        toast("Extra fee will be paid for quick service");
      }
    }

    if (name === "email") {
      validateEmail(value);
    }

    if (name === "phone") {
      validatePhone(value);
    }
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/i;
    if (!emailRegex.test(email)) {
      setEmailError("Email must be a valid address ending with .com (e.g., user@domain.com).");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneError("Phone number is required.");
      return false;
    }
    const phoneRegex = /^0\d{9}$/; // Starts with 0 and exactly 10 digits
    if (!phoneRegex.test(phone)) {
      setPhoneError("Phone must start with 0 and be 10 digits long.");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(formData.email) || !validatePhone(formData.phone)) return;

    setError(null);
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-serif font-semibold text-slate-800 border-b pb-2">
        Customer Information
      </h2>

      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

      {/* Full Name */}
      <div className="relative">
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="peer w-full rounded-xl border px-4 pt-5 pb-2 text-base text-slate-900 placeholder-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          placeholder="Full Name"
          required
        />
        <label
          htmlFor="name"
          className="absolute left-4 top-2 text-xs text-slate-500 transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400
          peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs
          peer-focus:text-rose-600"
        >
          Full Name <span className="text-rose-500">*</span>
        </label>
      </div>

      {/* Phone Number */}
      <div className="relative">
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="peer w-full rounded-xl border px-4 pt-5 pb-2 text-base text-slate-900 placeholder-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          placeholder="Phone Number"
          required
        />
        <label
          htmlFor="phone"
          className="absolute left-4 top-2 text-xs text-slate-500 transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400
          peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs
          peer-focus:text-rose-600"
        >
          Phone Number <span className="text-rose-500">*</span>
        </label>
        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
      </div>

      {/* Email */}
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="peer w-full rounded-xl border px-4 pt-5 pb-2 text-base text-slate-900 placeholder-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          placeholder="Email"
          required
        />
        <label
          htmlFor="email"
          className="absolute left-4 top-2 text-xs text-slate-500 transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400
          peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs
          peer-focus:text-rose-600"
        >
          Email <span className="text-rose-500">*</span>
        </label>
        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
      </div>

      {/* Address */}
      <div className="relative">
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="peer w-full rounded-xl border px-4 pt-5 pb-2 text-base text-slate-900 placeholder-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          placeholder="Delivery Address"
          required
        />
        <label
          htmlFor="address"
          className="absolute left-4 top-2 text-xs text-slate-500 transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400
          peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs
          peer-focus:text-rose-600"
        >
          Delivery Address <span className="text-rose-500">*</span>
        </label>
      </div>

      {/* Delivery Date (modern UI) */}
      <div>
  <label
    htmlFor="deliveryDate"
    className="block text-sm font-medium text-slate-700 mb-1 whitespace-nowrap"
  >
    Delivery Date <span className="text-rose-500">*</span>
  </label>
  <input
    id="deliveryDate"
    name="deliveryDate"
    type="date"
    value={formData.deliveryDate}
    onChange={handleChange}
    min={todayISO}
    className="w-52 rounded-xl border px-4 py-2 text-base text-slate-900 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
  />
</div>


      {/* Delivery Time (modern UI) */}
      <div>
        <label htmlFor="deliveryTime" className="block text-sm font-medium text-slate-700 mb-1">
          Delivery Time <span className="text-rose-500">*</span>
        </label>
        <input
          id="deliveryTime"
          name="deliveryTime"
          type="time"
          min="08:00"
          max="17:00"
          value={formData.deliveryTime}
          onChange={handleChange}
          className="w-52 rounded-xl border px-4 py-2 text-base text-slate-900 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
        />
        <span className="text-xs text-slate-500 block mt-1">
          Deliveries are available between 8:00am and 5:00pm
        </span>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
      >
        Continue to Review
      </button>
    </form>
  );
};

export default CustomerForm;
