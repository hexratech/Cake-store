// src/components/CustomCakesPage.tsx
import AdminLayout from "../components/AdminLayout";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronDown,
  Info,
  Clock,
  Cake,
  CheckCircle,
  X,
  Package,
  XCircle,
} from "lucide-react";

export type CustomCake = {
  _id: string;
  customerName?: string;
  email?: string;
  phone?: string;
  flavor?: string;
  size?: string;
  design?: string;
  note?: string;
  status: "Requested" | "In Progress" | "Ready" | "Completed" | "Cancelled";
  createdAt: string;
};

const STATUS_OPTIONS: CustomCake["status"][] = [
  "Requested",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
];

const CustomCakesPage = () => {
  const [customCakes, setCustomCakes] = useState<CustomCake[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCake, setSelectedCake] = useState<CustomCake | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  const fetchCustomCakes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/custom-cakes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch custom cakes");
      const data: CustomCake[] = await res.json();
      setCustomCakes(data);
    } catch (err) {
      console.error("Failed to load custom cakes", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchCustomCakes();
  }, [fetchCustomCakes]);

  const updateStatus = async (id: string, status: CustomCake["status"]) => {
    try {
      const res = await fetch(`${API_URL}/api/custom-cakes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated: CustomCake = await res.json();
      setCustomCakes((prev) =>
        prev.map((cake) => (cake._id === id ? updated : cake))
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status: CustomCake["status"]) => {
    switch (status) {
      case "Requested":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Ready":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  // ✅ Safe filtering (prevents crashes)
  const filteredCakes = customCakes.filter((cake) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (cake.customerName &&
        cake.customerName.toLowerCase().includes(search)) ||
      (cake.flavor && cake.flavor.toLowerCase().includes(search)) ||
      (cake.design && cake.design.toLowerCase().includes(search)) ||
      false;

    const matchesStatus =
      statusFilter === "All" || cake.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: CustomCake["status"]) => {
    switch (status) {
      case "Requested":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "In Progress":
        return <Cake className="w-5 h-5 text-blue-500" />;
      case "Ready":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading custom cakes...</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Custom Cake Requests
          </h1>
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, flavor or design..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 appearance-none bg-white px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {STATUS_OPTIONS.map((status) => (
            <div
              key={status}
              className="bg-gray-50 rounded-2xl shadow-inner p-4 flex flex-col"
            >
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                {getStatusIcon(status)}
                {status}
              </h2>
              <div className="flex-1 space-y-4">
                {filteredCakes
                  .filter((cake) => cake.status === status)
                  .map((cake) => (
                    <div
                      key={cake._id}
                      className="bg-white p-4 rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">
                          {cake.customerName || "Unnamed Customer"}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(
                            cake.status
                          )}`}
                        >
                          {cake.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Details:</span>{" "}
                        {cake.flavor || "Unknown Flavor"},{" "}
                        {cake.size || "Unknown Size"},{" "}
                        {cake.design || "No Design"}
                      </p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {cake.status !== "Completed" &&
                          cake.status !== "Cancelled" && (
                            <div className="relative group">
                              <select
                                value={cake.status}
                                onChange={(e) =>
                                  updateStatus(
                                    cake._id,
                                    e.target.value as CustomCake["status"]
                                  )
                                }
                                className="w-full appearance-none bg-white px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                          )}
                        <button
                          onClick={() => setSelectedCake(cake)}
                          className="flex items-center gap-1 text-sm text-gray-600 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 transition"
                        >
                          <Info className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                {filteredCakes.filter((c) => c.status === status).length ===
                  0 && (
                  <div className="text-center text-gray-400 p-4 text-sm italic">
                    No requests in this status.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedCake && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setSelectedCake(null)}
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Custom Cake Details
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {selectedCake.customerName || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedCake.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {selectedCake.phone || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Flavor:</span>{" "}
                  {selectedCake.flavor || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Size:</span>{" "}
                  {selectedCake.size || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Design:</span>{" "}
                  {selectedCake.design || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Note:</span>{" "}
                  {selectedCake.note || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedCake.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusBadge(
                      selectedCake.status
                    )}`}
                  >
                    {selectedCake.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomCakesPage;
