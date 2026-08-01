"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import CirclesModule from "@/components/circles/CirclesModule";
import { Users, Shield } from "lucide-react";

export default function CirclesPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F8] text-gray-900 pb-20">
      <BlinkitHeader />

      <div className="px-4 pt-3 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#0C831F]">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900">
              Module 3: Circles (Friends Connect)
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Mutual double opt-in peer recommendations. No raw order history or timestamps. Discovery-biased display highlighting unpurchased categories.
            </p>
          </div>
        </div>

        <CirclesModule />
      </div>
    </div>
  );
}
