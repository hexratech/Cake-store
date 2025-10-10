import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:8080";

interface FiltersProps {
  onApply: (query: string) => void;
}

interface FilterState {
  category: string;
  flavor: string;
  priceRange: string;
  sort: string;
}

export const Filters: React.FC<FiltersProps> = ({ onApply }) => {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    flavor: "All",
    priceRange: "All",
    sort: "Newest",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[] | null>(null);

  // Fetch categories and flavors dynamically from backend
  useEffect(() => {
    fetch(`${API_URL}/api/products/categories`)
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));

    fetch(`${API_URL}/api/products/flavors`)
      .then((res) => res.json())
      .then((data: string[]) =>
        setFlavors(data && Array.isArray(data) ? data : null)
      )
      .catch(() => setFlavors(null));
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    const { category, flavor, priceRange, sort } = filters;

    if (category !== "All") params.append("category", category.toLowerCase());
    if (flavor !== "All") params.append("flavor", flavor.toLowerCase());

    const priceMap: Record<string, { minPrice?: string; maxPrice?: string }> = {
      "Below GHS 200": { maxPrice: "200" },
      "GHS 200 – 350": { minPrice: "200", maxPrice: "350" },
      "GHS 350 – 500": { minPrice: "350", maxPrice: "500" },
      "GHS 500 – 700": { minPrice: "500", maxPrice: "700" },
      "GHS 700 – 1000": { minPrice: "700", maxPrice: "1000" },
      "Above GHS 1000": { minPrice: "1000" },
    };
    if (priceRange !== "All" && priceMap[priceRange]) {
      const { minPrice, maxPrice } = priceMap[priceRange];
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
    }

    const sortMap: Record<string, string> = {
      "Price: Low to High": "priceAsc",
      "Price: High to Low": "priceDesc",
      Newest: "newest",
      Popular: "popular",
    };
    params.append("sort", sortMap[sort]);

    return params.toString();
  };

  const handleApplyFilters = () => {
    const query = buildQuery();
    onApply(query);
    setOpen(false);
  };

  // SVG pattern from heropatterns.com (e.g. "topography")
  const patternSVG = encodeURIComponent(`
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 50 Q25 0 50 50 T100 50" stroke="#f9c2c2" stroke-width="2" fill="none"/>
      <path d="M0 75 Q25 25 50 75 T100 75" stroke="#f9c2c2" stroke-width="2" fill="none"/>
    </svg>
  `);

  return (
    <div
      className="mb-6 relative rounded-xl overflow-hidden border border-rose-100 shadow-lg"
      style={{
        backgroundColor: "#fff4f0",
        backgroundImage: `url("data:image/svg+xml,${patternSVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "100px 100px",
      }}
    >
      <div className="relative p-6">
        <h2 className="text-xl font-bold mb-4 text-rose-700">Filters</h2>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="font-medium text-slate-700"
                >
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  {categories.map((cat) => (
                    <option key={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Flavor */}
              <div>
                <label htmlFor="flavor" className="font-medium text-slate-700">
                  Flavor
                </label>
                <select
                  name="flavor"
                  value={filters.flavor}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                  disabled={!flavors || flavors.length === 0}
                >
                  <option>All</option>
                  {flavors && flavors.length > 0 ? (
                    flavors.map((flav) => (
                      <option key={flav}>
                        {flav.charAt(0).toUpperCase() + flav.slice(1)}
                      </option>
                    ))
                  ) : (
                    <option disabled>No flavors available</option>
                  )}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label
                  htmlFor="priceRange"
                  className="font-medium text-slate-700"
                >
                  Price Range
                </label>
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  <option>Below GHS 200</option>
                  <option>GHS 200 – 350</option>
                  <option>GHS 350 – 500</option>
                  <option>GHS 500 – 700</option>
                  <option>GHS 700 – 1000</option>
                  <option>Above GHS 1000</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort" className="font-medium text-slate-700">
                  Sort By
                </label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popular</option>
                </select>
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full py-3 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition"
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
