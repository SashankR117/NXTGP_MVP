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
      className="absolute bottom-16 right-3 z-40 bg-white border border-gray-200 rounded-full p-2.5 shadow-lg hover:bg-gray-100 transition-all group"
      title="Reset Demo Data"
    >
      <RotateCcw
        size={16}
        className="text-gray-600 group-hover:text-[#0C831F] transition-colors group-hover:rotate-[-360deg] duration-500"
      />
    </button>
  );
}

