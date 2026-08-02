"use client";

import { useState, useEffect } from "react";
import { Wifi, Signal, Battery } from "lucide-react";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [timeStr, setTimeStr] = useState("10:19");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      setTimeStr(`${hours}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen phone-ambient-backdrop flex items-center justify-center p-2 sm:p-6 overflow-x-hidden">
      {/* Phone outer container */}
      <div className="relative w-full max-w-[420px] h-[100vh] sm:h-[880px] phone-shell bg-black flex flex-col overflow-hidden select-none">
        
        {/* Phone Glass Shine Effect */}
        <div className="absolute top-0 right-0 w-32 h-64 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none z-50 rounded-tr-[42px]" />

        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5 shadow-md pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0d0d0d] border border-white/10 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/60" />
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10" />
        </div>

        {/* Status Bar */}
        <div className="relative z-40 bg-[#F8CB46] text-black pt-3 pb-1 px-6 flex items-center justify-between font-semibold text-xs tracking-tight select-none">
          <span className="font-extrabold text-[13px]">{timeStr}</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal size={12} className="stroke-[2.5]" />
            <Wifi size={12} className="stroke-[2.5]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">98%</span>
              <Battery size={15} className="stroke-[2.2] fill-black/20" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Content Viewport */}
        <div className="flex-1 relative bg-[#F4F5F8] overflow-y-auto hide-scrollbar flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="relative z-40 bg-[#FFFFFF] py-1 flex justify-center items-center border-t border-gray-100">
          <div className="w-32 h-1 bg-black/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
