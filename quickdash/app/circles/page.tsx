"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import CirclesModule from "@/components/circles/CirclesModule";
import { Users, Shield } from "lucide-react";

export default function CirclesPage() {
  return (
    <div className="bg-[#F4F5F8] text-gray-900 pb-8">
      <BlinkitHeader />

      <div className="px-3 pt-3 space-y-3.5">
        <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0C831F] flex-shrink-0">
            <Users size={18} />
          </div>
          <div>
            <h1 className="text-xs font-extrabold text-gray-900">
              Module 3: Circles (Friends Connect)
            </h1>
            <p className="text-[10px] text-gray-500 font-medium leading-snug">
              Mutual double opt-in peer recommendations. No raw order history or timestamps. Discovery-biased display highlighting unpurchased categories.
            </p>
          </div>
        </div>

        <CirclesModule />
      </div>
    </div>
  );
}

