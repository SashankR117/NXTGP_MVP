"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import HyperlocalWidget from "@/components/trending/HyperlocalWidget";
import { TrendingUp, Flame } from "lucide-react";

export default function TrendingPage() {
  return (
    <div className="bg-[#F4F5F8] text-gray-900 pb-8">
      <BlinkitHeader />

      <div className="px-3 pt-3 space-y-3.5">
        <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Flame size={18} />
          </div>
          <div>
            <h1 className="text-xs font-extrabold text-gray-900">
              Module 2: Hyperlocal Demand Engine
            </h1>
            <p className="text-[10px] text-gray-500 font-medium leading-snug">
              Rate-of-change trend velocity in your dark-store catchment. Promo orders excluded. Categories you already buy are filtered out!
            </p>
          </div>
        </div>

        <HyperlocalWidget isStandalone={true} />
      </div>
    </div>
  );
}

