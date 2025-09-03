import React, { useState } from "react";
import CartSummary from "../components/checkout/CartSummary";
import CustomerForm from "../components/checkout/CustomerForm";
import PaymentOptions from "../components/checkout/PaymentOptions";
import OrderReview from "../components/checkout/OrderReview";
import { useCart } from "@/hooks/useCart";
import type { Order } from "@/types/data/orders";

const CheckoutPage: React.FC = () => {
  const { cart, cartCount } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile-money"
  >("cash");

  const handlePlaceOrder = () => {
    const order: Order = {
      customer,
      items: cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
      total: cart.reduce(
        (sum, i) => sum + i.product.priceGHS * i.quantity,
        0
      ),
      paymentMethod,
      status: "pending",
    };

    console.log("Placing order:", order);
    alert("Order placed successfully!");
  };

  if (!cart || cart.length === 0 || cartCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your cart is empty 🛒
        </h2>
        <p className="text-gray-600 max-w-md">
          Add some delicious cakes to your cart before proceeding to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600">
          Complete your order in just a few easy steps 🎂
        </p>
      </div>

      {/* Checkout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <CustomerForm customer={customer} setCustomer={setCustomer} />
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <PaymentOptions
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <OrderReview
              customer={customer}
              paymentMethod={paymentMethod}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        {/* Right column */}
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
