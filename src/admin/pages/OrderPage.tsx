import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  Search,
  ChevronDown,
  CheckCircle,
  Package,
  ShoppingCart,
  Truck,
  XCircle,
  Info,
  Cake,
} from "lucide-react";
import OrderDetailsModal from "../components/OrderDetailsModal";

interface CustomDetails {
  flavor?: string;
  icing?: string;
  layers?: string;
  size?: string;
  toppings?: string[];
  note?: string;
  design?: string;
  designImage?: string;
  estimatedPrice?: number;
}

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  isCustom?: boolean;
  customDetails?: CustomDetails;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  totalPrice: number;
  status: "Pending" | "In Progress" | "Ready" | "Completed" | "Cancelled";
  deliveryStatus: "Pending" | "Dispatched" | "Delivered";
  deliveryMethod: "Delivery" | "Pickup";
  createdAt: string;
  items: OrderItem[];
  address?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  pickupDate?: string;      // ✅ added
  pickupTime?: string;      // ✅ added
  estimatedDelivery?: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const token = localStorage.getItem("adminToken");
  const API_URL = import.meta.env.VITE_API_URL as string;

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  // Update order status
  const updateOrderStatus = useCallback(
    async (id: string, newStatus: Order["status"]) => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Failed to update status");

        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((order) => (order._id === id ? updatedOrder : order))
        );
      } catch (err: unknown) {
        console.error(err instanceof Error ? err.message : "Failed to update order status");
      }
    },
    [token, API_URL]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order["status"]) => {
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading orders...</p>
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-rose-600" />
            Orders
          </h1>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 appearance-none bg-white px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-xl rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="text-gray-500 text-sm uppercase tracking-wider text-left">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                      {order.orderId}
                      {order.items.some((i) => i.isCustom) && (
                        <span
                          title="Custom Cake Order"
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-rose-100 text-rose-700"
                        >
                          <Cake className="w-3 h-3 mr-1" />
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-700">{order.customerName}</td>
                    <td className="p-4 font-semibold text-gray-900">
                      GHS {order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-600">{order.deliveryMethod}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === "Pending" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "In Progress")
                            }
                            className="text-sm px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Mark as In Progress"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "In Progress" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, "Ready")}
                            className="text-sm px-3 py-1 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
                            title="Mark as Ready"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "Ready" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Completed")
                            }
                            className="text-sm px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === "Pending" ||
                          order.status === "In Progress") && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Cancelled")
                            }
                            className="text-sm px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sm px-3 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                          title="View Details"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
