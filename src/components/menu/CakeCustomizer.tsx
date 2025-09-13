// src/components/menu/CakeCustomizer.tsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import {
  flavorPrices,
  sizePrices,
  layerPrices,
  icingPrices,
  toppingPrices,
} from "@/components/cake/cakeConstants";

// Exported type for external use
export type CustomCakeData = {
  id: string;
  flavor: string;
  size: string;
  layers: string;
  icing: string;
  toppings: string[];
  designImage?: string;
  totalPrice: number;
};

// Props type
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customCake: CustomCakeData) => void;
};

export const CakeCustomizer: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [flavor, setFlavor] = useState("Chocolate");
  const [size, setSize] = useState("6-inch");
  const [layers, setLayers] = useState("Single");
  const [icing, setIcing] = useState("Buttercream");
  const [toppings, setToppings] = useState<string[]>([]);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);

  const designImageUrl = useMemo(
    () => (designImage ? URL.createObjectURL(designImage) : undefined),
    [designImage]
  );

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const totalPrice = useMemo(() => {
    const toppingsTotal = toppings.reduce(
      (acc, t) => acc + (toppingPrices[t] || 0),
      0
    );
    return (
      (flavorPrices[flavor] || 0) +
      (sizePrices[size] || 0) +
      (layerPrices[layers] || 0) +
      (icingPrices[icing] || 0) +
      toppingsTotal
    );
  }, [flavor, size, layers, icing, toppings]);

  const toggleTopping = (t: string) => {
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((i) => i !== t) : [...prev, t]
    );
  };

  const handleAddToCart = () => {
    const customCake: CustomCakeData = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      flavor,
      size,
      layers,
      icing,
      toppings,
      totalPrice,
      designImage: designImageUrl,
    };

    onSubmit(customCake);
    setShowToast(true);
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
            className="bg-white w-full max-w-lg mx-4 rounded-3xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close customizer"
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Customize Your Cake 🎂
            </h2>
            <p className="text-slate-500 mb-4 text-sm">
              Select options below. Total updates dynamically.
            </p>

            <div className="space-y-4">
              {/* Flavor */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Flavor
                </label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {Object.keys(flavorPrices).map((f) => (
                    <option key={f} value={f}>
                      {f} (+GHS {flavorPrices[f]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {Object.keys(sizePrices).map((s) => (
                    <option key={s} value={s}>
                      {s} (+GHS {sizePrices[s]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Layers */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Layers
                </label>
                <select
                  value={layers}
                  onChange={(e) => setLayers(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {Object.keys(layerPrices).map((l) => (
                    <option key={l} value={l}>
                      {l} (+GHS {layerPrices[l]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Icing */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Icing
                </label>
                <select
                  value={icing}
                  onChange={(e) => setIcing(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {Object.keys(icingPrices).map((i) => (
                    <option key={i} value={i}>
                      {i} (+GHS {icingPrices[i]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Toppings */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Extra Toppings
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(toppingPrices).map((t) => (
                    <label
                      key={t}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer ${
                        toppings.includes(t)
                          ? "bg-rose-500 text-white"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={toppings.includes(t)}
                        onChange={() => toggleTopping(t)}
                        className="hidden"
                      />
                      {t} (+GHS {toppingPrices[t]})
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional Image Upload */}
              <div>
                <label
                  htmlFor="designImage"
                  className="font-semibold text-slate-700 block mb-1"
                >
                  Upload a Design Image (Optional)
                </label>
                <input
                  type="file"
                  id="designImage"
                  accept="image/*"
                  onChange={(e) =>
                    setDesignImage(e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-2 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
              </div>

              <div className="text-right font-bold text-lg">
                Total: GHS {totalPrice}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full mt-6 py-3 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700"
            >
              Add to Cart
            </button>
          </motion.div>

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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
