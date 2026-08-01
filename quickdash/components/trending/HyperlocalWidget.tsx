"use client";

import { useApp } from "@/lib/store";
import { getHyperlocalDemandTrends, ZONES } from "@/lib/data/locality";
import { getProductById } from "@/lib/data/products";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { Flame, MapPin, Plus, Star, TrendingUp, Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HyperlocalWidget({ isStandalone = false }: { isStandalone?: boolean }) {
  const { state, dispatch } = useApp();
  const { currentPersona } = state;
  const [showLogicInfo, setShowLogicInfo] = useState(false);

  // Purchased categories for discovery filter
  const purchasedCategoryNames = currentPersona.purchaseHistory
    .map((id) => getProductById(id)?.category)
    .filter(Boolean) as string[];

  // Get trends calculated by rate of change, promo-excluded, discovery filtered
  const trends = getHyperlocalDemandTrends(
    currentPersona.localityZoneId,
    purchasedCategoryNames
  );

  const currentZone = ZONES.find((z) => z.id === currentPersona.localityZoneId) || ZONES[0];

  return (
    <div className={isStandalone ? "space-y-3" : ""}>
      {/* Widget Header */}
      {!isStandalone && (
        <div className="flex items-center justify-between mb-2.5 px-1">
          <Link href="/trending" className="flex items-center gap-1.5 group flex-1">
            <TrendingUp size={16} className="text-[#0C831F]" />
            <div>
              <h3 className="text-xs font-extrabold text-gray-900 group-hover:text-[#0C831F] transition-colors tracking-tight flex items-center gap-1">
                Trending Near You ({currentZone.name.split(",")[0]})
                <ChevronRight size={14} className="text-gray-400 group-hover:text-[#0C831F] transition-colors" />
              </h3>
              <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                <MapPin size={9} className="text-gray-400" />
                Dark-store catchment zone • Rate-of-change velocity
              </p>
            </div>
          </Link>

          <button
            onClick={() => setShowLogicInfo(!showLogicInfo)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="How trend is computed"
          >
            <Info size={13} />
          </button>
        </div>
      )}

      {/* Logic Explainer Tooltip */}
      {showLogicInfo && (
        <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1 animate-fade-in">
          <p className="font-bold text-[11px]">
            ⚡ Hyperlocal Trend Rules (Prompt v2):
          </p>
          <ul className="list-disc pl-4 text-[10px] space-y-0.5 text-blue-800">
            <li><b>Rate of Change:</b> Calculated by 14d rolling vs prior 14d velocity (excludes staple volume).</li>
            <li><b>Promo Excluded:</b> Bulk promotional discount spikes are filtered out.</li>
            <li><b>Discovery Filter:</b> Categories you already buy are excluded.</li>
          </ul>
        </div>
      )}

      {/* Layout Option: Horizontal Scroll (Home) vs Vertical 2-Column Grid (Full Screen) */}
      {isStandalone ? (
        /* Requirement 3: Full screen /trending is Vertical Scrollable 2-Column Grid */
        <div className="grid grid-cols-2 gap-3 pb-8">
          {trends.map(({ product, trend, growthTag, buyerCountText }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#0C831F]/40 transition-all group p-3"
            >
              <div>
                {/* Surge Tag */}
                <div className="bg-[#FFF9E6] px-2 py-1 rounded-md mb-2 text-center">
                  <span className="text-[10px] font-extrabold text-amber-900 flex items-center justify-center gap-0.5 truncate">
                    <Flame size={11} className="text-amber-600 fill-amber-600 flex-shrink-0" />
                    {growthTag}
                  </span>
                </div>

                {/* Real Product Image */}
                <div className="w-full h-28 rounded-xl overflow-hidden my-1 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <p className="text-xs font-extrabold text-gray-900 line-clamp-2 leading-tight mt-1.5 min-h-[32px]">
                  {product.name}
                </p>

                <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                  {product.category} {product.weight ? `• ${product.weight}` : ""}
                </p>

                {/* Trust Badges */}
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-800 flex items-center gap-0.5">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    {product.rating}
                  </span>
                  <span className="text-[9px] font-bold text-[#0C831F] bg-green-50 px-1.5 py-0.5 rounded">
                    {product.reorderRate}% reorder
                  </span>
                  {product.shelfLife && (
                    <span className="text-[9px] font-semibold text-gray-500">
                      {product.shelfLife}
                    </span>
                  )}
                </div>

                {/* Aggregate Buyer Count */}
                <p className="text-[9px] text-gray-500 font-semibold mt-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 truncate">
                  👥 {buyerCountText}
                </p>
              </div>

              {/* Pricing & Stepper UI */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {product.trialPrice ? (
                    <div>
                      <span className="text-[10px] text-gray-400 line-through block leading-none">
                        ₹{product.price}
                      </span>
                      <span className="text-xs font-extrabold text-[#0C831F] leading-tight">
                        ₹{product.trialPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-extrabold text-gray-900">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                {/* Stepper UI (- 1 +) */}
                <QuantityStepper productId={product.id} compact={true} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Home Widget Compact Horizontal Scroll */
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
          {trends.slice(0, 8).map(({ product, trend, growthTag, buyerCountText }) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-36 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#0C831F]/40 transition-all group p-2.5"
            >
              <div>
                <div className="bg-[#FFF9E6] px-1.5 py-0.5 rounded-md mb-1.5 text-center">
                  <span className="text-[9px] font-extrabold text-amber-900 flex items-center justify-center gap-0.5 truncate">
                    <Flame size={10} className="text-amber-600 fill-amber-600 flex-shrink-0" />
                    {growthTag.replace(" surge in Sector 62", "")}
                  </span>
                </div>

                {/* Real Product Image */}
                <div className="w-full h-20 rounded-lg overflow-hidden my-1 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <p className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight min-h-[28px] mt-1">
                  {product.name}
                </p>

                <p className="text-[9px] text-gray-500 font-medium truncate mt-0.5">
                  {product.category}
                </p>

                <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-gray-100">
                  <span className="text-[9px] font-bold text-gray-800 flex items-center gap-0.5">
                    <Star size={9} className="text-amber-500 fill-amber-500" />
                    {product.rating}
                  </span>
                  <span className="text-[8px] font-bold text-[#0C831F] bg-green-50 px-1 py-0.2 rounded ml-auto">
                    {product.reorderRate}% reorder
                  </span>
                </div>

                <p className="text-[8px] text-gray-500 font-semibold mt-1 bg-gray-50 px-1 py-0.5 rounded border border-gray-100 truncate">
                  👥 {trend.rolling14dUniqueBuyers} near you
                </p>
              </div>

              <div className="mt-2 pt-1 flex items-center justify-between">
                <div>
                  {product.trialPrice ? (
                    <div>
                      <span className="text-[9px] text-gray-400 line-through block leading-none">
                        ₹{product.price}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0C831F] leading-tight">
                        ₹{product.trialPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-extrabold text-gray-900">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                <QuantityStepper productId={product.id} compact={true} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
