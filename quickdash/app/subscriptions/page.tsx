"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import SubscriptionManager from "@/components/subscriptions/SubscriptionManager";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F8] text-gray-900 pb-20">
      <BlinkitHeader />

      <div className="px-4 pt-3 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#0C831F]">
            <RefreshCw size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900">
              Module 1: Recurring Subscriptions
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Auto-order routine staples. Every renewal includes mandatory pre-charge touchpoints for category discovery.
            </p>
          </div>
        </div>

        <SubscriptionManager />
      </div>
    </div>
  );
}
