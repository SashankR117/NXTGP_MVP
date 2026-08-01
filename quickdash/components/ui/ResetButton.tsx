"use client";

import { useApp } from "@/lib/store";
import { RotateCcw } from "lucide-react";

export default function ResetButton() {
  const { dispatch } = useApp();

  return (
    <button
      onClick={() => {
        dispatch({ type: "RESET" });
        dispatch({ type: "SHOW_TOAST", message: "Demo data restored to initial state", toastType: "info" });
      }}
      className="fixed bottom-24 right-4 z-50 bg-dash-card-hover border border-dash-border rounded-full p-3 shadow-xl hover:bg-dash-border transition-all group max-w-[430px]"
      title="Reset Demo Data"
    >
      <RotateCcw
        size={18}
        className="text-dash-text-secondary group-hover:text-dash-accent-green transition-colors group-hover:rotate-[-360deg] duration-500"
      />
    </button>
  );
}
