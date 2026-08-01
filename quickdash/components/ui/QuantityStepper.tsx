"use client";

import { useApp } from "@/lib/store";
import { Plus, Minus } from "lucide-react";

export default function QuantityStepper({
  productId,
  compact = false,
}: {
  productId: string;
  compact?: boolean;
}) {
  const { state, dispatch } = useApp();

  const cartItem = state.cart.find((c) => c.productId === productId);
  const qty = cartItem ? cartItem.quantity : 0;

  if (qty === 0) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "ADD_TO_CART", productId });
          dispatch({
            type: "SHOW_TOAST",
            message: "Item added to cart",
          });
        }}
        className={`bg-white text-[#0C831F] border border-[#0C831F] font-extrabold rounded-lg hover:bg-green-50 transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1 ${
          compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs"
        }`}
      >
        <Plus size={compact ? 10 : 12} /> ADD
      </button>
    );
  }

  return (
    <div
      className={`bg-[#0C831F] text-white font-extrabold rounded-lg flex items-center justify-between shadow-xs ${
        compact ? "px-1.5 py-0.5 text-[10px] gap-1" : "px-2 py-1 text-xs gap-2"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (qty === 1) {
            dispatch({
              type: "SHOW_TOAST",
              message: "Item removed from cart",
              toastType: "info",
            });
          }
          dispatch({ type: "DECREMENT_CART", productId });
        }}
        className="hover:opacity-80 transition-opacity p-0.5"
        title="Decrease quantity"
      >
        <Minus size={compact ? 10 : 12} />
      </button>

      <span className="font-extrabold tracking-tight px-1">{qty}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "ADD_TO_CART", productId });
        }}
        className="hover:opacity-80 transition-opacity p-0.5"
        title="Increase quantity"
      >
        <Plus size={compact ? 10 : 12} />
      </button>
    </div>
  );
}
