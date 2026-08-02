"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import SubscriptionManager from "@/components/subscriptions/SubscriptionManager";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="bg-[#F4F5F8] text-gray-900 pb-8">
      <BlinkitHeader />

      <div className="px-3 pt-3 space-y-3.5">
        <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-[#0C831F] flex-shrink-0">
            <RefreshCw size={18} />
          </div>
          <div>
            <h1 className="text-xs font-extrabold text-gray-900">
              Module 1: Recurring Subscriptions
            </h1>
            <p className="text-[10px] text-gray-500 font-medium leading-snug">
              Auto-order routine staples. Every renewal includes mandatory pre-charge touchpoints for category discovery.
            </p>
          </div>
        </div>

        <SubscriptionManager />
      </div>
    </div>
  );
}

