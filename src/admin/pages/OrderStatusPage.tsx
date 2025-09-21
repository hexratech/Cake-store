// src/admin/pages/OrderStatusPage.tsx
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
  Clipboard,
  XCircle,
} from "lucide-react";

// Status type
type Status = "Pending" | "In Progress" | "Ready" | "Completed" | "Cancelled";

// Backend response type for order items
interface BackendOrderItem {
  productId?: string;
  name: string;
  qty: number;
  price: number;
  isCustom: boolean;
  customDetails?: {
    base?: string;
    size?: string;
    layers?: number;
    frosting?: string;
    toppings?: string[];
    design?: string;
    designImage?: string;
    note?: string;
    estimatedPrice?: number;
  };
}

// Backend response type for orders
interface BackendOrder {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  items: BackendOrderItem[];
  status: Status;
  createdAt: string;
}

// Frontend type for mapped order item
interface OrderItem {
  name: string;
  qty: number;
  price: number;
  isCustom: boolean;
  customDetails?: BackendOrderItem["customDetails"];
}

// Frontend type for mapped order
interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  status: Status;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_OPTIONS: Status[] = ["Pending", "In Progress", "Ready", "Completed", "Cancelled"];

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const API_URL = import.meta.env.VITE_API_URL as string;
  const token = localStorage.getItem("adminToken") ?? "";

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data: BackendOrder[] = await res.json();

      const mappedOrders: Order[] = data.map((order) => ({
        _id: order._id,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          name: item.isCustom ? item.customDetails?.base || "Custom Cake" : item.name,
          qty: item.qty,
          price: item.isCustom ? item.customDetails?.estimatedPrice || 0 : item.price,
          isCustom: item.isCustom,
          customDetails: item.customDetails,
        })),
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const updateStatus = async (orderId: string, status: Status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated: BackendOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) =>
          order._id === updated._id
            ? {
                ...order,
                status: updated.status,
                items: updated.items.map((item) => ({
                  name: item.isCustom ? item.customDetails?.base || "Custom Cake" : item.name,
                  qty: item.qty,
                  price: item.isCustom ? item.customDetails?.estimatedPrice || 0 : item.price,
                  isCustom: item.isCustom,
                  customDetails: item.customDetails,
                })),
              }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "Pending":
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

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "In Progress":
        return <Cake className="w-5 h-5 text-blue-500" />;
      case "Ready":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  // Filter orders by search term and status
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      order.customerName.toLowerCase().includes(search) ||
      order.items.some((item) => item.name.toLowerCase().includes(search));

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading orders...</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clipboard className="w-8 h-8 text-rose-600" />
          Order Status
        </h1>
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
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
            <div key={status} className="bg-gray-50 rounded-2xl shadow-inner p-4 flex flex-col">
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                {getStatusIcon(status)}
                {status}
              </h2>
              <div className="flex-1 space-y-4">
                {filteredOrders
                  .filter((order) => order.status === status)
                  .map((order) => (
                    <div
                      key={order._id}
                      className="bg-white p-4 rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">{order.customerName}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {order.items.map((item) => (
                          <p key={item.name}>
                            {item.name} x {item.qty} — ${item.price}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {order.status !== "Completed" && order.status !== "Cancelled" && (
                          <div className="relative group">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value as Status)}
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
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-sm text-gray-600 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 transition"
                        >
                          <Info className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                {filteredOrders.filter((o) => o.status === status).length === 0 && (
                  <div className="text-center text-gray-400 p-4 text-sm italic">No orders in this status.</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setSelectedOrder(null)}
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Details</h2>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Customer:</span> {selectedOrder.customerName}</p>
                <p><span className="font-semibold">Email:</span> {selectedOrder.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedOrder.phone}</p>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="list-disc list-inside">
                    {selectedOrder.items.map((item) => (
                      <li key={item.name}>
                        {item.name} x {item.qty} — ${item.price}
                        {item.isCustom && item.customDetails && (
                          <div className="ml-4 text-sm text-gray-600">
                            Base: {item.customDetails.base || "N/A"}, Size: {item.customDetails.size || "N/A"}, Design: {item.customDetails.design || "N/A"}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
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

export default OrderStatusPage;
