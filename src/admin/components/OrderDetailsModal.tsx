import React from "react";
import { X } from "lucide-react";

interface CustomDetails {
  flavor?: string;
  icing?: string;
  layers?: string;
  size?: string;
  filling?: string;
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
  createdAt: string;
  deliveryMethod: "Delivery" | "Pickup";
  address?: string;
  deliveryDate?: string; // Display as-is
  deliveryTime?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        {/* Customer Info */}
        <div className="mb-4 space-y-1">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
          {order.deliveryMethod === "Delivery" && (
            <>
              <p><strong>Address:</strong> {order.address}</p>
              {order.deliveryDate && <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>}
              {order.deliveryTime && <p><strong>Delivery Time:</strong> {order.deliveryTime}</p>}
            </>
          )}
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items:</h3>
          <ul className="space-y-3">
            {order.items.map((item, idx) => (
              <li key={idx} className="border-b pb-2">
                <p>
                  {item.name} x {item.qty} —{" "}
                  <span className="font-semibold">GHS {item.price.toFixed(2)}</span>
                </p>

                {/* Show Custom Details if it's a custom cake */}
                {item.isCustom && item.customDetails && (
                  <div className="ml-4 text-sm text-gray-600 space-y-1">
                    {item.customDetails.flavor && <p><strong>Flavor:</strong> {item.customDetails.flavor}</p>}
                    {item.customDetails.icing && <p><strong>Icing:</strong> {item.customDetails.icing}</p>}
                    {item.customDetails.layers && <p><strong>Layers:</strong> {item.customDetails.layers}</p>}
                    {item.customDetails.size && <p><strong>Size:</strong> {item.customDetails.size}</p>}
                    {item.customDetails.filling && <p><strong>Filling:</strong> {item.customDetails.filling}</p>}
                    {item.customDetails.toppings?.length && <p><strong>Toppings:</strong> {item.customDetails.toppings.join(", ")}</p>}
                    {item.customDetails.note && <p><strong>Note:</strong> {item.customDetails.note}</p>}
                    {item.customDetails.design && <p><strong>Design:</strong> {item.customDetails.design}</p>}
                    {item.customDetails.designImage && (
                      <img
                        src={item.customDetails.designImage}
                        alt="Design"
                        className="w-24 h-24 rounded-md object-cover mt-1"
                      />
                    )}
                    {item.customDetails.estimatedPrice !== undefined && (
                      <p><strong>Estimated Price:</strong> GHS {item.customDetails.estimatedPrice.toFixed(2)}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="mt-4 space-y-1">
          <p><strong>Total Price:</strong> GHS {order.totalPrice.toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
          <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          {order.estimatedDelivery && (
            <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
