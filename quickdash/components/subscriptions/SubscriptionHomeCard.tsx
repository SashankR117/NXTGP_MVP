"use client";

import { useApp } from "@/lib/store";
import { getProductById } from "@/lib/data/products";
import { getHyperlocalDemandTrends } from "@/lib/data/locality";
import QuantityStepper from "@/components/ui/QuantityStepper";
import {
  Calendar,
  ChevronRight,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SubscriptionHomeCard() {
  const { state, dispatch } = useApp();
  const { subscription, currentPersona } = state;
  const [editingDay, setEditingDay] = useState(false);
  const [selectedDay, setSelectedDay] = useState(subscription.dayOfMonth);

  const subItems = subscription.items.map((item) => ({
    ...item,
    product: getProductById(item.productId),
  }));

  const subtotal = subItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const isPaused = subscription.status === "paused";

  const purchasedCategoryNames = currentPersona.purchaseHistory
    .map((id) => getProductById(id)?.category)
    .filter(Boolean) as string[];

  const hyperlocalTrends = getHyperlocalDemandTrends(
    currentPersona.localityZoneId,
    purchasedCategoryNames
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fade-in hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="p-2.5 bg-gradient-to-r from-emerald-50/60 to-white border-b border-gray-100 flex items-center justify-between">
        <Link href="/subscriptions" className="flex items-center gap-2 group flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#0C831F]/10 flex items-center justify-center text-[#0C831F] flex-shrink-0">
            <RefreshCw size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-[11px] font-extrabold text-gray-900 group-hover:text-[#0C831F] transition-colors truncate">
                Monthly Pantry Subscription
              </h3>
              <span
                className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase flex-shrink-0 ${
                  isPaused ? "bg-amber-100 text-amber-800" : "bg-green-100 text-[#0C831F]"
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <p className="text-[9.5px] text-gray-500 font-medium truncate">
              Next delivery: <b className="text-gray-800">{subscription.nextExecutionDate}</b>
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch({ type: "TOGGLE_SUBSCRIPTION_STATUS" });
              dispatch({
                type: "SHOW_TOAST",
                message: isPaused ? "Subscription resumed!" : "Subscription paused.",
                toastType: "info",
              });
            }}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-[10px] font-semibold flex items-center gap-0.5"
          >
            {isPaused ? (
              <PlayCircle size={13} className="text-[#0C831F]" />
            ) : (
              <PauseCircle size={13} className="text-amber-600" />
            )}
          </button>

          <Link
            href="/subscriptions"
            className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
            title="Full Subscription View"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Schedule Delivery Change Control */}
      <div className="px-3 py-1.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1 text-gray-600 truncate">
          <Calendar size={12} className="text-[#0C831F] flex-shrink-0" />
          <span className="truncate">Renews monthly on <b>Day {subscription.dayOfMonth}</b></span>
        </div>

        {editingDay ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="text-[9px] font-bold bg-white border border-gray-300 rounded px-1 py-0.5"
            >
              {[1, 5, 10, 15, 20, 25].map((d) => (
                <option key={d} value={d}>
                  {d}th
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                dispatch({
                  type: "UPDATE_SUBSCRIPTION_DAY",
                  dayOfMonth: selectedDay,
                });
                setEditingDay(false);
                dispatch({
                  type: "SHOW_TOAST",
                  message: `Delivery day updated to ${selectedDay}th of month.`,
                });
              }}
              className="text-[9px] bg-[#0C831F] text-white px-1.5 py-0.5 rounded font-bold"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingDay(true)}
            className="text-[9.5px] font-bold text-[#0C831F] hover:underline flex-shrink-0"
          >
            Change Day
          </button>
        )}
      </div>

      {/* Small Window Section of Products - Horizontally Scrollable */}
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider">
            Basket Items ({subItems.length}) • Total ₹{subtotal}
          </span>
          <Link href="/subscriptions" className="text-[9.5px] font-bold text-[#0C831F] hover:underline">
            Manage & Edit
          </Link>
        </div>

        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
          {subItems.map(
            (item) =>
              item.product && (
                <div
                  key={item.productId}
                  className="flex-shrink-0 w-20 bg-gray-50 rounded-xl p-1.5 border border-gray-100 flex flex-col justify-between"
                >
                  <div className="relative text-center">
                    <div className="w-full h-12 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-[#0C831F] text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="text-[9.5px] font-bold text-gray-900 truncate text-center mt-1">
                    {item.product.name}
                  </p>
                  <p className="text-[8.5px] text-gray-500 font-semibold text-center">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>
              )
          )}
        </div>
      </div>

      {/* Renewal Touchpoint Hook Slot */}
      {hyperlocalTrends.length > 0 && (
        <div className="mx-2.5 mb-2.5 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0 pr-1.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-amber-200">
              <img
                src={hyperlocalTrends[0].product.imageUrl}
                alt={hyperlocalTrends[0].product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-extrabold text-amber-800 uppercase tracking-wider block leading-none">
                Pre-Charge Touchpoint
              </span>
              <p className="text-[10px] font-bold text-gray-900 truncate leading-tight">
                {hyperlocalTrends[0].product.name}
              </p>
              <p className="text-[8.5px] text-[#0C831F] font-bold truncate leading-none">
                🔥 {hyperlocalTrends[0].growthTag}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              dispatch({
                type: "ADD_TO_SUBSCRIPTION",
                productId: hyperlocalTrends[0].product.id,
                quantity: 1,
              });
              dispatch({
                type: "SHOW_TOAST",
                message: `Added ${hyperlocalTrends[0].product.name} to upcoming renewal box!`,
              });
            }}
            className="px-2 py-1 bg-[#0C831F] text-white text-[10px] font-extrabold rounded-md hover:bg-[#096918] transition-colors flex items-center gap-0.5 flex-shrink-0 active:scale-95 shadow-xs"
          >
            <Plus size={10} /> Add
          </button>
        </div>
      )}
    </div>
  );
}

