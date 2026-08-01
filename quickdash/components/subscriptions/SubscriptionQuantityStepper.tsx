"use client";

import { useApp } from "@/lib/store";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function SubscriptionQuantityStepper({
  productId,
  currentQty,
}: {
  productId: string;
  currentQty: number;
}) {
  const { dispatch } = useApp();

  return (
    <div className="bg-[#0C831F] text-white font-extrabold rounded-lg flex items-center justify-between shadow-xs px-2 py-1 text-xs gap-2">
      <button
        onClick={() => {
          if (currentQty <= 1) {
            dispatch({
              type: "REMOVE_FROM_SUBSCRIPTION",
              productId,
            });
            dispatch({
              type: "SHOW_TOAST",
              message: "Item removed from subscription box",
              toastType: "info",
            });
          } else {
            dispatch({
              type: "UPDATE_SUBSCRIPTION_ITEM_QUANTITY",
              productId,
              quantity: currentQty - 1,
            });
          }
        }}
        className="hover:opacity-80 transition-opacity p-0.5"
        title="Decrease quantity in subscription"
      >
        {currentQty === 1 ? <Trash2 size={12} className="text-red-200" /> : <Minus size={12} />}
      </button>

      <span className="font-extrabold tracking-tight px-1.5">{currentQty}</span>

      <button
        onClick={() => {
          dispatch({
            type: "UPDATE_SUBSCRIPTION_ITEM_QUANTITY",
            productId,
            quantity: currentQty + 1,
          });
        }}
        className="hover:opacity-80 transition-opacity p-0.5"
        title="Increase quantity in subscription"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
