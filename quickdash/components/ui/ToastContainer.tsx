"use client";

import { useApp } from "@/lib/store";
import { useEffect } from "react";

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", id: state.toasts[0].id });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toasts, dispatch]);

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2 w-[90%] max-w-[360px] pointer-events-none">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up bg-black text-white border border-[#F8CB46]/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl pointer-events-auto cursor-pointer"
          onClick={() => dispatch({ type: "DISMISS_TOAST", id: toast.id })}
        >
          <span className="text-base flex-shrink-0">
            {toast.type === "success" ? "⚡" : "ℹ️"}
          </span>
          <p className="text-xs text-white font-medium flex-1">
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
}

