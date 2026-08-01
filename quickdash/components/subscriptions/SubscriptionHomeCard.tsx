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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50/60 to-white border-b border-gray-100 flex items-center justify-between">
        <Link href="/subscriptions" className="flex items-center gap-2 group flex-1">
          <div className="w-8 h-8 rounded-xl bg-[#0C831F]/10 flex items-center justify-center text-[#0C831F]">
            <RefreshCw size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-extrabold text-gray-900 group-hover:text-[#0C831F] transition-colors">
                Monthly Pantry Subscription
              </h3>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase ${
                  isPaused ? "bg-amber-100 text-amber-800" : "bg-green-100 text-[#0C831F]"
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Next delivery: <b className="text-gray-800">{subscription.nextExecutionDate}</b>
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 flex-shrink-0">
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
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-[11px] font-semibold flex items-center gap-1"
          >
            {isPaused ? (
              <PlayCircle size={14} className="text-[#0C831F]" />
            ) : (
              <PauseCircle size={14} className="text-amber-600" />
            )}
          </button>

          <Link
            href="/subscriptions"
            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
            title="Full Subscription View"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* Schedule Delivery Change Control */}
      <div className="px-3.5 py-2 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar size={13} className="text-[#0C831F]" />
          <span>Renews monthly on <b>Day {subscription.dayOfMonth}</b></span>
        </div>

        {editingDay ? (
          <div className="flex items-center gap-1">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="text-[10px] font-bold bg-white border border-gray-300 rounded px-1 py-0.5"
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
              className="text-[10px] bg-[#0C831F] text-white px-2 py-0.5 rounded font-bold"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingDay(true)}
            className="text-[10px] font-bold text-[#0C831F] hover:underline"
          >
            Change Day
          </button>
        )}
      </div>

      {/* Small Window Section of Products - Horizontally Scrollable */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
            Basket Items ({subItems.length}) • Total ₹{subtotal}
          </span>
          <Link href="/subscriptions" className="text-[10px] font-bold text-[#0C831F] hover:underline">
            Manage & Edit
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {subItems.map(
            (item) =>
              item.product && (
                <div
                  key={item.productId}
                  className="flex-shrink-0 w-24 bg-gray-50 rounded-xl p-2 border border-gray-100 flex flex-col justify-between"
                >
                  <div className="relative text-center">
                    <div className="w-full h-14 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-[#0C831F] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-900 truncate text-center mt-1">
                    {item.product.name}
                  </p>
                  <p className="text-[9px] text-gray-500 font-semibold text-center">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>
              )
          )}
        </div>
      </div>

      {/* Renewal Touchpoint Hook Slot */}
      {hyperlocalTrends.length > 0 && (
        <div className="mx-3 mb-3 p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-amber-200">
              <img
                src={hyperlocalTrends[0].product.imageUrl}
                alt={hyperlocalTrends[0].product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider block">
                Renewal Discovery Slot (48h Pre-Charge)
              </span>
              <p className="text-xs font-bold text-gray-900 truncate">
                {hyperlocalTrends[0].product.name}
              </p>
              <p className="text-[9px] text-[#0C831F] font-bold truncate">
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
            className="px-2.5 py-1.5 bg-[#0C831F] text-white text-[11px] font-extrabold rounded-lg hover:bg-[#096918] transition-colors flex items-center gap-0.5 flex-shrink-0 active:scale-95 shadow-xs"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      )}
    </div>
  );
}
