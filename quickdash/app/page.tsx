"use client";

import BlinkitHeader from "@/components/ui/BlinkitHeader";
import SubscriptionHomeCard from "@/components/subscriptions/SubscriptionHomeCard";
import HyperlocalWidget from "@/components/trending/HyperlocalWidget";
import CirclesModule from "@/components/circles/CirclesModule";
import { CATEGORIES } from "@/lib/data/products";
import { Sparkles, TrendingUp, RefreshCw, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-[#F4F5F8] text-gray-900 pb-8">
      {/* Authentic Blinkit Header (showBack is false on Home) */}
      <BlinkitHeader showBack={false} />

      <div className="px-3 pt-3 space-y-3.5">
        {/* Module 1: Subscriptions Card */}
        <section>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <h2 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <RefreshCw size={12} className="text-[#0C831F]" />
              Module 1: Subscriptions
            </h2>
            <Link
              href="/subscriptions"
              className="text-[11px] font-extrabold text-[#0C831F] hover:underline flex items-center gap-0.5"
            >
              Full View <ArrowRight size={11} />
            </Link>
          </div>
          <SubscriptionHomeCard />
        </section>

        {/* Module 2: Hyperlocal Demand */}
        <section>
          <HyperlocalWidget />
        </section>

        {/* Module 3: Circles */}
        <section>
          <CirclesModule />
        </section>

        {/* Blinkit Category Grid */}
        <section className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-gray-900">
              Shop by Category
            </h3>
            <span className="text-[10px] text-gray-500 font-medium">10 Categories</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center justify-center p-1.5 bg-gray-50/90 rounded-xl border border-gray-100 hover:border-[#0C831F] transition-all cursor-pointer group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="text-[8.5px] font-bold text-gray-700 text-center leading-tight mt-0.5 truncate w-full">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center py-2">
          <p className="text-[10px] text-gray-400 font-semibold">
            Blinkit MVP • Production Clone Build
          </p>
        </div>
      </div>
    </div>
  );
}

