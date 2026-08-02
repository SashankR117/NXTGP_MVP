"use client";

import { useState, useEffect } from "react";
import { Wifi, Signal, Battery } from "lucide-react";

export default function PhoneFrame({
  children,
  bottomNav,
  controls,
}: {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  controls?: React.ReactNode;
}) {
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
    <div className="h-screen w-screen phone-ambient-backdrop flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
      {/* Phone outer container (Aspect-ratio locked 9:19.5 so it stays perfectly proportioned on laptops & monitors) */}
      <div className="relative h-[93vh] max-h-[830px] aspect-[9/19.5] w-auto max-w-[390px] phone-shell bg-black flex flex-col overflow-hidden select-none shadow-2xl">

        
        {/* Phone Glass Shine Effect */}
        <div className="absolute top-0 right-0 w-32 h-60 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none z-50 rounded-tr-[42px]" />


        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 shadow-md pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0d0d0d] border border-white/10 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/60" />
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10" />
        </div>

        {/* Status Bar */}
        <div className="relative z-40 bg-[#F8CB46] text-black pt-2.5 pb-1 px-5 flex items-center justify-between font-semibold text-xs tracking-tight select-none flex-shrink-0">
          <span className="font-extrabold text-[12px]">{timeStr}</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal size={11} className="stroke-[2.5]" />
            <Wifi size={11} className="stroke-[2.5]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">98%</span>
              <Battery size={14} className="stroke-[2.2] fill-black/20" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Canvas Container */}
        <div className="relative flex-1 flex flex-col overflow-hidden bg-[#F4F5F8] min-h-0">
          {/* Scrollable Viewport (Main app content ONLY!) */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pb-16">
            {children}
          </div>

          {/* Locked Bottom Navigation Bar */}
          {bottomNav}

          {/* Floating Controls & Overlays */}
          {controls}
        </div>

        {/* Home Indicator Bar */}
        <div className="relative z-40 bg-[#FFFFFF] py-1 flex justify-center items-center border-t border-gray-100 flex-shrink-0">
          <div className="w-28 h-1 bg-black/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}


