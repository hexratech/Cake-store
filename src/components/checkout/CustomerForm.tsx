import React from "react";

type Props = {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  setCustomer: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      email: string;
      address: string;
    }>
  >;
};

const CustomerForm: React.FC<Props> = ({ customer, setCustomer }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
        Customer Information
      </h2>

      {/* Full Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-600"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={customer.name}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-600"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="+233 555 123 456"
          value={customer.phone}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-600"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          value={customer.email}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-slate-600"
        >
          Delivery Address
        </label>
        <input
          id="address"
          type="text"
          name="address"
          placeholder="123 Cake Street, Accra"
          value={customer.address}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
        />
      </div>
    </div>
  );
};

export default CustomerForm;
