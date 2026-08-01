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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 max-w-[400px] w-full px-4">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up bg-dash-card border border-dash-border-accent rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl"
          onClick={() => dispatch({ type: "DISMISS_TOAST", id: toast.id })}
        >
          <span className="text-lg">
            {toast.type === "success" ? "✅" : "ℹ️"}
          </span>
          <p className="text-sm text-dash-text-primary font-medium flex-1">
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
}
