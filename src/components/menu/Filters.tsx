// src/pages/menu/components/Filters.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

export const Filters: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      {/* Toggle Button (Mobile Friendly) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-3 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition lg:hidden"
      >
        <SlidersHorizontal size={20} />
        Filters
      </button>

      {/* Desktop Filters (always visible) */}
      <div className="hidden lg:grid grid-cols-4 gap-6 mt-4">
        <FilterOptions />
      </div>

      {/* Mobile Filters (collapsible) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 bg-white rounded-xl shadow-md p-4 space-y-4"
          >
            <FilterOptions />
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterOptions = () => {
  return (
    <>
      {/* Category */}
      <div>
        <label className="font-medium text-slate-700">Category</label>
        <select className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors">
          <option>All</option>
          <option>Cakes</option>
          <option>Cupcakes</option>
          <option>Pastries</option>
        </select>
      </div>

      {/* Flavor */}
      <div>
        <label className="font-medium text-slate-700">Flavor</label>
        <select className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors">
          <option>All</option>
          <option>Chocolate</option>
          <option>Vanilla</option>
          <option>Red Velvet</option>
          <option>Strawberry</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="font-medium text-slate-700">Price Range</label>
        <select className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors">
          <option>All</option>
          <option>Under GHS 100</option>
          <option>GHS 100 – 200</option>
          <option>Above GHS 200</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="font-medium text-slate-700">Sort By</label>
        <select className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors">
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Popular</option>
        </select>
      </div>
    </>
  );
};