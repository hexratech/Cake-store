// src/pages/menu/components/CakeCustomizer.tsx
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/api/index";

export type CustomCakeData = {
  flavor: string;
  size: string;
  layers: string;
  icing: string;
  toppings: string[];
  notes?: string;
  totalPrice: number; // Include calculated price
};

type CakeCustomizerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customCake: CustomCakeData) => void;
};

export const CakeCustomizer: React.FC<CakeCustomizerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { addToCart } = useCart();

  // Option selections
  const [flavor, setFlavor] = useState("Chocolate");
  const [size, setSize] = useState("6-inch");
  const [layers, setLayers] = useState("Single");
  const [icing, setIcing] = useState("Buttercream");
  const [toppings, setToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Pricing map (future-proof)
  const flavorPrices: Record<string, number> = {
    Chocolate: 0,
    Vanilla: 0,
    "Red Velvet": 5,
    Strawberry: 5,
    Lemon: 5,
  };
  const sizePrices: Record<string, number> = {
    "6-inch": 20,
    "8-inch": 30,
    "10-inch": 40,
    "12-inch": 50,
  };
  const layerPrices: Record<string, number> = {
    Single: 0,
    Double: 10,
    Triple: 20,
  };
  const icingPrices: Record<string, number> = {
    Buttercream: 0,
    Fondant: 10,
    "Whipped Cream": 5,
    Ganache: 10,
  };
  const toppingPrices: Record<string, number> = {
    Berries: 5,
    Oreos: 3,
    Sprinkles: 2,
    Nuts: 4,
    "Chocolate Chips": 3,
    Candies: 2,
  };

  // Compute total dynamically
  const totalPrice = useMemo(() => {
    const toppingsTotal = toppings.reduce((acc, t) => acc + (toppingPrices[t] || 0), 0);
    return (
      50 + // base price
      (flavorPrices[flavor] || 0) +
      (sizePrices[size] || 0) +
      (layerPrices[layers] || 0) +
      (icingPrices[icing] || 0) +
      toppingsTotal
    );
  }, [flavorPrices, sizePrices, layerPrices, icingPrices, toppingPrices, ]);

  const toggleTopping = (t: string) => {
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((i) => i !== t) : [...prev, t]
    );
  };

  const handleAddToCart = () => {
    const customCake: CustomCakeData = {
      flavor,
      size,
      layers,
      icing,
      toppings,
      notes,
      totalPrice,
    };

    const product: Product & { customCakeData?: CustomCakeData } = {
      _id: `custom-${Date.now()}`,
      name: `${flavor} Cake (${size}, ${layers} layers)`,
      description: `Icing: ${icing}. Extra Toppings: ${
        toppings.join(", ") || "None"
      }. ${notes || ""}`,
      price: totalPrice,
      image: "",
      isPublished: true,
      isFeatured: false,
      slug: `custom-${Date.now()}`,
      customized: true,
      customCakeData: customCake,
    };

    addToCart(product);
    onSubmit(customCake);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
            <p className="text-slate-500 mb-4 text-sm">
              Select options below. Total updates dynamically.
            </p>

            <div className="space-y-4">
              {/* Flavor */}
              <div>
                <label htmlFor="flavour" className="font-semibold text-slate-700 block mb-1">Flavor</label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 transition"
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
                <label  htmlFor="size" className="font-semibold text-slate-700 block mb-1">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 transition"
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
                <label htmlFor="layers"  className="font-semibold text-slate-700 block mb-1">Layers</label>
                <select
                  value={layers}
                  onChange={(e) => setLayers(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 transition"
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
                <label htmlFor="icing" className="font-semibold text-slate-700 block mb-1">Icing</label>
                <select
                  value={icing}
                  onChange={(e) => setIcing(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 transition"
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
                <label htmlFor="Extra Toppings" className="font-semibold text-slate-700 block mb-1">Extra Toppings</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(toppingPrices).map((t) => (
                    <label
                      key={t}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer transition-colors ${
                        toppings.includes(t)
                          ? "bg-rose-500 text-white border-rose-500"
                          : "border-slate-200 hover:bg-rose-50"
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

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="font-semibold text-slate-700 block mb-1">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Write a message, gluten-free, less sugar..."
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 transition resize-none h-20"
                />
              </div>

              {/* Total */}
              <div className="text-right font-bold text-lg">
                Total: GHS {totalPrice}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              className="w-full mt-6 py-3 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </motion.div>

          {/* Toast */}
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
