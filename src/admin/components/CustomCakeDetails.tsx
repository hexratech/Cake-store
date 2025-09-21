import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/admin/components/dialog";
import { Button } from "@/components/ui/button";
import { type CustomCakeOrder } from "@/types/CustomOrder";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cake: CustomCakeOrder;
}

export default function CustomCakeDetails({ open, onOpenChange, cake }: Props) {
  const [copyMessage, setCopyMessage] = useState("");

  const handleCopyAddress = () => {
    if (cake.deliveryAddress) {
      navigator.clipboard.writeText(cake.deliveryAddress);
      setCopyMessage("Delivery address copied!");
      setTimeout(() => setCopyMessage(""), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom Cake Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="border-b pb-3 mb-3">
            <p><strong>Customer:</strong> {cake.customerName}</p>
            <p><strong>Email:</strong> {cake.email}</p>
            <p><strong>Phone:</strong> {cake.phone}</p>
            <p>
              <strong>Delivery Address:</strong> {cake.deliveryAddress ?? "N/A"}
              {cake.deliveryAddress && (
                <>
                  <Button size="sm" onClick={handleCopyAddress} className="ml-2">Copy</Button>
                  {copyMessage && <span className="ml-2 text-sm text-green-500">{copyMessage}</span>}
                </>
              )}
            </p>
            <p><strong>Status:</strong> {cake.status}</p>
            <p><strong>Total Price:</strong> GHS {cake.totalPrice}</p>
            <p><strong>Order Date:</strong> {cake.createdAt ? new Date(cake.createdAt).toLocaleString() : "N/A"}</p>
          </div>

          {/* Custom Cake Items */}
          {cake.customItems && cake.customItems.length > 0 ? (
            cake.customItems.map((item, idx) => (
              <div key={idx} className="border rounded-md p-3 bg-gray-50 shadow-sm">
                <h3 className="font-semibold mb-2">Cake #{idx + 1}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Flavor:</strong> {item.flavor ?? "N/A"}</p>
                  <p><strong>Icing:</strong> {item.icing ?? "N/A"}</p>
                  <p><strong>Layers:</strong> {item.layers ?? "N/A"}</p>
                  <p><strong>Size:</strong> {item.size ?? "N/A"}</p>
                  <p><strong>Toppings:</strong> {item.toppings?.length ? item.toppings.join(", ") : "N/A"}</p>
                  <p><strong>Note:</strong> {item.note ?? "N/A"}</p>
                  <p><strong>Design:</strong> {item.design ?? "N/A"}</p>
                  {item.designImage && <img src={item.designImage} alt={`Cake #${idx + 1} Design`} className="w-full rounded-md shadow mt-2"/>}
                  <p><strong>Estimated Price:</strong> GHS {item.estimatedPrice?? "N/A"}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No custom items available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
