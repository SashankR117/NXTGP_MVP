"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import HyperlocalWidget from "@/components/trending/HyperlocalWidget";
import { TrendingUp, Flame } from "lucide-react";

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F8] text-gray-900 pb-20">
      <BlinkitHeader />

      <div className="px-4 pt-3 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Flame size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900">
              Module 2: Hyperlocal Demand Engine
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Rate-of-change trend velocity in your dark-store catchment. Promo orders excluded. Categories you already buy are filtered out!
            </p>
          </div>
        </div>

        <HyperlocalWidget isStandalone={true} />
      </div>
    </div>
  );
}
