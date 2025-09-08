// src/pages/menu/components/CakeCustomizer.tsx
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/api/index";

export type CustomCakeData = {
  flavor: string;
  size: string;
  layers: string;
  icing: string;
  toppings: string[];
  notes?: string;
};

type CakeCustomizerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customCake: CustomCakeData) => void | Promise<void>;
};

export const CakeCustomizer: React.FC<CakeCustomizerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { addToCart } = useCart();
  const [flavor, setFlavor] = useState("Chocolate");
  const [size, setSize] = useState("6-inch");
  const [layers, setLayers] = useState("Single");
  const [icing, setIcing] = useState("Buttercream");
  const [toppings, setToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showToast, setShowToast] = useState(false);

  const toggleTopping = (t: string) => {
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((i) => i !== t) : [...prev, t]
    );
  };

  const handleAddToCart = async () => {
    const customCake: CustomCakeData = {
      flavor,
      size,
      layers,
      icing,
      toppings,
      notes,
    };

    // Create a pseudo Product that satisfies the type
    const product: Product = {
      _id: `custom-${Date.now()}`,
      name: `${flavor} Cake (${size}, ${layers} layers)`,
      description: `Icing: ${icing}. Extra Toppings: ${
        toppings.join(", ") || "None"
      }. ${notes || ""}`,
      price: 50 + toppings.length * 5, // example pricing
      image: "", // optional placeholder
      isPublished: true, // required
      isFeatured: false, // required
      slug: `custom-${Date.now()}`, // required
      customized: true, // optional, marks as custom cake
    };

    addToCart(product); // Add to cart for user preview
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // Submit to backend
    await onSubmit(customCake);

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-lg mx-4 rounded-3xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh] hide-scrollbar"
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
              aria-label="close customizer"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Customize Your Cake 🎂
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              Choose your favorite flavor, size, layers, icing, and toppings. Add any special instructions below.
            </p>

            {/* Customization Options */}
            <div className="space-y-5">
              {/* Flavor */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Flavor</label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  {["Chocolate", "Vanilla", "Red Velvet", "Strawberry", "Lemon"].map(
                    (f) => <option key={f}>{f}</option>
                  )}
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  {["6-inch", "8-inch", "10-inch", "12-inch"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Layers */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Layers</label>
                <select
                  value={layers}
                  onChange={(e) => setLayers(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  {["Single", "Double", "Triple"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Icing */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Icing</label>
                <select
                  value={icing}
                  onChange={(e) => setIcing(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  {["Buttercream", "Fondant", "Whipped Cream", "Ganache"].map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>

              {/* Toppings */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Extra Toppings</label>
                <div className="flex flex-wrap gap-2">
                  {["Berries", "Oreos", "Sprinkles", "Nuts", "Chocolate Chips", "Candies"].map(
                    (t) => (
                      <label
                        key={t}
                        className={`flex items-center gap-2 px-4 py-3 border rounded-full cursor-pointer transition-colors
                        ${toppings.includes(t)
                          ? "bg-rose-500 text-white border-rose-500"
                          : "border-slate-200 hover:bg-rose-50"}`}
                      >
                        <input
                          type="checkbox"
                          checked={toppings.includes(t)}
                          onChange={() => toggleTopping(t)}
                          className="hidden"
                        />
                        {t}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Write a message, gluten-free, less sugar..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors resize-none h-24"
                />
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-8 relative">
              <button
                className="w-full py-4 rounded-full bg-rose-600 text-white font-bold text-lg shadow-md hover:bg-rose-700 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>

          {/* Top-right Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed top-6 right-6 z-50 bg-rose-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
              >
                <Check size={16} /> Custom cake added!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
