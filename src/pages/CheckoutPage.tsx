import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import { useCart } from "@/hooks/useCart";
import type { CartItem } from "@/contexts/CartContext";

import { CustomerForm, type CustomerData } from "@/components/checkout/CustomerForm";
import { OrderReview } from "@/components/checkout/OrderReview";
import { CartSummary } from "@/components/checkout/CartSummary";
import { DeliveryOptions, type DeliveryMethod } from "@/components/checkout/DeliveryOptions";

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();

  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSection, setActiveSection] = useState<"details" | "delivery" | "review">("details");
  const [message, setMessage] = useState<string | null>(null);

  const [currentStepMessage, setCurrentStepMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const isFormComplete = !!customerData;
  const isCartEmpty = cart.length === 0;
  const isDeliverySelected = !!deliveryMethod;

  const handlePlaceOrder = async () => {
    if (!customerData || !deliveryMethod || isCartEmpty) {
      setMessage("Please complete all sections before placing your order.");
      return;
    }

    setIsProcessing(true);
    setMessage(null);
    setProgress(0);

    const totalSteps = 4;
    const progressPerStep = 100 / totalSteps;

    try {
      // Step 1: Validate details
      setCurrentStepMessage("Validating your order details...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(progressPerStep);

      // Step 2: Create order in backend
      setCurrentStepMessage("Placing your order with the bakery...");
      const mappedItems = cart.map((item: CartItem) => {
        if (item.type === "product") {
          return {
            productId: item.product._id,
            name: item.product.name,
            qty: item.quantity,
            price: item.product.price,
            isCustom: false,
          };
        } else {
          return {
            name: `${item.customCake.flavor} Cake`,
            qty: item.quantity,
            price: item.customCake.totalPrice,
            isCustom: true,
            customDetails: {
              ...item.customCake,
              estimatedPrice: item.customCake.totalPrice,
            },
          };
        }
      });
      const totalPrice =
        cart.reduce((acc, item) => {
          if (item.type === "product") {
            return acc + item.product.price * item.quantity;
          }
          return acc + item.customCake.totalPrice * item.quantity;
        }, 0) || cartTotal;

      const orderResponse = await axios.post(`${API_URL}/api/orders`, {
        customerName: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        deliveryMethod,
        items: mappedItems,
        totalPrice,
      });

      const orderId = orderResponse.data._id;
      if (!orderId) throw new Error("Order creation failed: no ID returned");
      setProgress(progressPerStep * 2);

      // Step 3: Initiate payment with orderId
      setCurrentStepMessage("Initiating secure payment...");
      const paymentResponse = await axios.post(`${API_URL}/api/payments/initiate`, {
        email: customerData.email,
        totalPrice,
        orderId,
      });
      const { authorization_url } = paymentResponse.data.payment;
      setProgress(progressPerStep * 3);

      // Step 4: Finalize and redirect
      setCurrentStepMessage("Finalizing your receipt and redirecting...");
      setProgress(100);
      clearCart();

      setTimeout(() => {
        window.location.href = authorization_url;
      }, 500);

    } catch (error: unknown) {
      let errorMessage = "Payment initiation failed.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? errorMessage;
      }
      console.error(error);
      setMessage(errorMessage);
      setIsProcessing(false);
      setProgress(0);
      setCurrentStepMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 md:flex md:gap-10">
        <div className="md:w-2/3 space-y-8">
          <h1 className="text-4xl font-extrabold text-rose-600 mb-8">Checkout</h1>

          {message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6"
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <div className="bg-slate-50 p-6 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">1. Customer Details</h2>
              {activeSection !== "details" && isFormComplete && (
                <button
                  onClick={() => setActiveSection("details")}
                  className="text-sm text-rose-500 font-semibold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {activeSection === "details" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CustomerForm
                    initialValues={customerData ?? undefined}
                    onComplete={(data) => {
                      setCustomerData(data);
                      setActiveSection("delivery");
                    }}
                  />
                </motion.div>
              ) : (
                isFormComplete && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-slate-600">Name: {customerData?.name}</p>
                    <p className="text-slate-600">Email: {customerData?.email}</p>
                    <p className="text-slate-600">Phone: {customerData?.phone}</p>
                    <p className="text-slate-600">Address: {customerData?.address}</p>
                    {customerData?.deliveryDate && (
                      <p className="text-slate-600">Delivery Date: {customerData.deliveryDate}</p>
                    )}
                    {customerData?.deliveryTime && (
                      <p className="text-slate-600">Delivery Time: {customerData.deliveryTime}</p>
                    )}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">2. Delivery Options</h2>
              {activeSection !== "delivery" && isDeliverySelected && (
                <button
                  onClick={() => setActiveSection("delivery")}
                  className="text-sm text-rose-500 font-semibold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {activeSection === "delivery" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DeliveryOptions selectedMethod={deliveryMethod} onSelect={setDeliveryMethod} />
                  <button
                    onClick={() => setActiveSection("review")}
                    className="w-full mt-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 disabled:bg-gray-400"
                    disabled={!isDeliverySelected}
                  >
                    Proceed to Review
                  </button>
                </motion.div>
              ) : (
                isDeliverySelected && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-slate-600">Delivery Method: {deliveryMethod}</p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">3. Order Review</h2>
              {activeSection !== "review" && (
                <button
                  onClick={() => setActiveSection("review")}
                  className="text-sm text-rose-500 font-semibold hover:underline"
                  disabled={!isFormComplete || !isDeliverySelected}
                >
                  Edit
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {activeSection === "review" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <OrderReview />
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full mt-4 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 disabled:bg-gray-400"
                    disabled={!isFormComplete || !isDeliverySelected || isCartEmpty || isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-sm text-slate-500">Order ready for review.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="md:w-1/3 mt-10 md:mt-0">
          <div className="sticky top-28 bg-rose-100 p-6 rounded-3xl shadow-xl">
            <CartSummary cart={cart} cartTotal={cartTotal} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Placing Your Order...</h2>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-rose-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                {currentStepMessage || "Preparing to process..."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};