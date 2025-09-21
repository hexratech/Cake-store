import React from "react";
import { X } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  items: OrderItem[];
  address?: string; // changed from deliveryOption
  type?: "Normal" | "CustomCake"; // optional, for delivery estimate
}

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  // Calculate estimated delivery
  const calculateDelivery = () => {
    const createdDate = new Date(order.createdAt);
    let minDays = 2;
    let maxDays = 3;

    if (order.type === "CustomCake") {
      minDays = 3;
      maxDays = 5;
    }

    const minDelivery = new Date(createdDate);
    minDelivery.setDate(minDelivery.getDate() + minDays);

    const maxDelivery = new Date(createdDate);
    maxDelivery.setDate(maxDelivery.getDate() + maxDays);

    return `${minDelivery.toLocaleDateString()} - ${maxDelivery.toLocaleDateString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        <div className="mb-4">
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items:</h3>
          <ul className="list-disc list-inside space-y-1">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} x {item.quantity} - GHS {item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <p className="mb-2"><strong>Total Price:</strong> GHS {order.totalPrice.toFixed(2)}</p>
        <p className="mb-2"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="mb-2"><strong>Expected Delivery:</strong> {calculateDelivery()}</p>
        {order.address && <p><strong>Delivery Address:</strong> {order.address}</p>}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
