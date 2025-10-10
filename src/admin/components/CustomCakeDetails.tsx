import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/admin/components/dialog";
import { Button } from "@/components/ui/button";
import type { CustomCakeOrder, CustomCakeItem } from "@/types/CustomOrder";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cake: CustomCakeOrder;
}

export default function CustomCakeDetails({ open, onOpenChange, cake }: Props) {
  const [copyMessage, setCopyMessage] = useState<string>("");

  const handleCopyAddress = (): void => {
    if (cake.deliveryAddress) {
      navigator.clipboard.writeText(cake.deliveryAddress);
      setCopyMessage("Delivery address copied!");
      setTimeout(() => setCopyMessage(""), 3000);
    }
  };

  const hasCustomItems =
    Array.isArray(cake.customItems) && cake.customItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom Cake Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="border-b pb-3 mb-3 text-sm">
            <p>
              <strong>Customer:</strong> {cake.customerName}
            </p>
            <p>
              <strong>Email:</strong> {cake.email}
            </p>
            <p>
              <strong>Phone:</strong> {cake.phone}
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span>
                <strong>Delivery Address:</strong>{" "}
                {cake.deliveryAddress ?? "N/A"}
              </span>
              {cake.deliveryAddress && (
                <>
                  <Button size="sm" onClick={handleCopyAddress}>
                    Copy
                  </Button>
                  {copyMessage && (
                    <span className="text-xs text-green-500">
                      {copyMessage}
                    </span>
                  )}
                </>
              )}
            </p>
            <p>
              <strong>Status:</strong> {cake.status ?? "N/A"}
            </p>
            <p>
              <strong>Total Price:</strong> GHS {cake.totalPrice ?? "N/A"}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {cake.createdAt
                ? new Date(cake.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Custom Cake Items */}
          {hasCustomItems ? (
            cake.customItems!.map((item: CustomCakeItem, idx: number) => (
              <div
                key={idx}
                className="border rounded-md p-3 bg-gray-50 shadow-sm text-sm"
              >
                <h3 className="font-semibold mb-2">Cake #{idx + 1}</h3>
                <div className="space-y-1">
                  <p>
                    <strong>Flavor:</strong> {item.flavor ?? "N/A"}
                  </p>
                  <p>
                    <strong>Icing:</strong> {item.icing ?? "N/A"}
                  </p>
                  <p>
                    <strong>Layers:</strong> {item.layers ?? "N/A"}
                  </p>
                  <p>
                    <strong>Size:</strong> {item.size ?? "N/A"}
                  </p>
                  <p>
                    <strong>Toppings:</strong>{" "}
                    {item.toppings && item.toppings.length > 0
                      ? item.toppings.join(", ")
                      : "N/A"}
                  </p>
                  {item.note && item.note.trim() !== "" && (
                    <p>
                      <strong>Note:</strong> {item.note}
                    </p>
                  )}
                  {item.design && item.design.trim() !== "" && (
                    <p>
                      <strong>Design:</strong> {item.design}
                    </p>
                  )}
                  {item.designImage && item.designImage.trim() !== "" && (
                    <img
                      src={item.designImage}
                      alt={`Cake #${idx + 1} Design`}
                      className="w-full rounded-md shadow mt-2"
                    />
                  )}
                  <p>
                    <strong>Estimated Price:</strong> GHS{" "}
                    {item.estimatedPrice ?? "N/A"}
                  </p>
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
