// src/pages/checkout/CheckoutPage.tsx
import React, { useState } from "react";
import CartSummary from "../components/checkout/CartSummary";
import CustomerForm from "../components/checkout/CustomerForm";
import PaymentOptions from "../components/checkout/PaymentOptions";
import OrderReview from "../components/checkout/OrderReview";
import { useCart } from "@/hooks/useCart";

import type { PaymentMethod } from "@/api/index";

type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

type Step = "cart" | "customer" | "payment" | "review";

const CheckoutPage: React.FC = () => {
  const { cart: cartItems, total } = useCart(); // get cart items from context

  // Build a cart object compatible with OrderReview & CartSummary
  const cart = {
    items: cartItems,
    total: total,
  };

  const [step, setStep] = useState<Step>("cart");
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Proceed to the next step
  const handleNext = (nextStep: Step) => setStep(nextStep);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Checkout</h1>

      {/* Step 1: Cart Summary (interactive) */}
      {step === "cart" && (
        <CartSummary
          onProceed={() => handleNext("customer")}
        />
      )}

      {/* Step 2: Customer Info */}
      {step === "customer" && (
        <CustomerForm
          customer={customer}
          setCustomer={setCustomer}
          onNext={() => handleNext("payment")}
        />
      )}

      {/* Step 3: Payment Options */}
      {step === "payment" && (
        <PaymentOptions
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onNext={() => handleNext("review")}
        />
      )}

      {/* Step 4: Order Review (read-only CartSummary) */}
      {step === "review" && (
        <OrderReview
          cart={cart} // read-only CartSummary inside
          customer={customer}
          paymentMethod={paymentMethod}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
