"use client";

import { useApp } from "@/lib/store";
import { getProductById } from "@/lib/data/products";
import { getHyperlocalDemandTrends } from "@/lib/data/locality";
import SubscriptionQuantityStepper from "@/components/subscriptions/SubscriptionQuantityStepper";
import AddProductToSubscriptionModal from "@/components/subscriptions/AddProductToSubscriptionModal";
import { useState } from "react";
import {
  Calendar,
  Edit2,
  PauseCircle,
  PlayCircle,
  Plus,
  SkipForward,
  Trash2,
  TrendingUp,
  Flame,
  Check,
} from "lucide-react";

export default function SubscriptionManager() {
  const { state, dispatch } = useApp();
  const { subscription, currentPersona } = state;
  const [editingDay, setEditingDay] = useState(false);
  const [selectedDay, setSelectedDay] = useState(subscription.dayOfMonth);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const subItems = subscription.items.map((item) => ({
    ...item,
    product: getProductById(item.productId),
  }));

  const subtotal = subItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const purchasedCategoryNames = currentPersona.purchaseHistory
    .map((id) => getProductById(id)?.category)
    .filter(Boolean) as string[];

  const hyperlocalTrends = getHyperlocalDemandTrends(
    currentPersona.localityZoneId,
    purchasedCategoryNames
  );

  const isPaused = subscription.status === "paused";

  return (
    <div className="space-y-4">
      {/* Status & Recurrence Card */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">
                Monthly Pantry Box
              </h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isPaused
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-[#0C831F]"
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Auto-renews on day {subscription.dayOfMonth} of every month
            </p>
          </div>

          <button
            onClick={() => {
              dispatch({ type: "TOGGLE_SUBSCRIPTION_STATUS" });
              dispatch({
                type: "SHOW_TOAST",
                message: isPaused
                  ? "Subscription resumed!"
                  : "Subscription paused for next cycle.",
                toastType: "info",
              });
            }}
            className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            {isPaused ? (
              <>
                <PlayCircle size={14} className="text-[#0C831F]" />
                Resume
              </>
            ) : (
              <>
                <PauseCircle size={14} className="text-amber-600" />
                Pause
              </>
            )}
          </button>
        </div>

        {/* Recurrence Schedule Controls */}
        <div className="pt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={14} className="text-[#0C831F]" />
            <span>Next delivery: <b>{subscription.nextExecutionDate}</b></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dispatch({ type: "SKIP_NEXT_CYCLE" });
                dispatch({
                  type: "SHOW_TOAST",
                  message: "Skipped next cycle! Next date updated.",
                  toastType: "info",
                });
              }}
              disabled={isPaused}
              className="flex items-center gap-1 text-xs font-semibold text-[#0C831F] hover:underline disabled:opacity-40"
            >
              <SkipForward size={12} />
              Skip cycle
            </button>
          </div>
        </div>

        {/* Edit day picker */}
        {editingDay ? (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Select monthly recurrence day:
            </p>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {[1, 5, 10, 15, 20, 25].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    selectedDay === d
                      ? "bg-[#0C831F] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {d}th
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                dispatch({
                  type: "UPDATE_SUBSCRIPTION_DAY",
                  dayOfMonth: selectedDay,
                });
                setEditingDay(false);
                dispatch({
                  type: "SHOW_TOAST",
                  message: `Subscription scheduled for day ${selectedDay} of each month.`,
                });
              }}
              className="px-3 py-1 bg-[#0C831F] text-white font-semibold text-xs rounded-lg"
            >
              Save Schedule
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingDay(true)}
            className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Edit2 size={10} /> Change renewal day of month
          </button>
        )}
      </div>

      {/* Horizontally Scrollable Module 2 Hook inside Subscription Page */}
      <div className="p-3 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200/70 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#0C831F]" />
            <span className="text-xs font-extrabold text-amber-900 tracking-tight">
              Trending Near You (Add to Subscription)
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-[#0C831F] bg-green-50 px-2 py-0.5 rounded border border-green-200">
            Module 2 Hook
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {hyperlocalTrends.map(({ product, trend, growthTag }) => {
            const isAlreadySubscribed = subscription.items.some(
              (i) => i.productId === product.id
            );

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-36 bg-white rounded-xl p-2.5 border border-amber-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="bg-amber-100/60 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded mb-1 truncate flex items-center gap-0.5">
                    <Flame size={9} className="text-amber-600 fill-amber-600 flex-shrink-0" />
                    {growthTag.replace(" surge in Sector 62", "")}
                  </div>

                  <div className="w-full h-16 rounded-lg overflow-hidden bg-gray-100 my-1">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-[#0C831F] font-extrabold mt-0.5">
                    ₹{product.trialPrice || product.price}
                  </p>
                </div>

                <div className="mt-2 pt-1 border-t border-gray-100">
                  {isAlreadySubscribed ? (
                    <span className="text-[10px] font-bold text-[#0C831F] block text-center bg-green-50 py-1 rounded">
                      ✓ Subscribed
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch({
                          type: "ADD_TO_SUBSCRIPTION",
                          productId: product.id,
                          quantity: 1,
                        });
                        dispatch({
                          type: "SHOW_TOAST",
                          message: `Added ${product.name} to subscription box!`,
                        });
                      }}
                      className="w-full py-1 bg-[#0C831F] text-white text-[10px] font-extrabold rounded-md hover:bg-[#096918] transition-colors flex items-center justify-center gap-0.5 active:scale-95 shadow-xs"
                    >
                      <Plus size={11} /> Add to Box
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Items List with Real-time Quantity Modifications & Add Products Modal Trigger */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            Subscribed Basket Items ({subItems.length})
          </h3>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3 py-1.5 bg-[#0C831F] text-white font-extrabold text-xs rounded-lg hover:bg-[#096918] transition-colors flex items-center gap-1 active:scale-95 shadow-xs"
          >
            <Plus size={13} /> Add More Items
          </button>
        </div>

        <div className="space-y-3 divide-y divide-gray-100">
          {subItems.map(
            (item) =>
              item.product && (
                <div key={item.productId} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {item.product.weight || ""} • ₹{item.product.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Real-time Subscription Stepper */}
                    <SubscriptionQuantityStepper
                      productId={item.productId}
                      currentQty={item.quantity}
                    />

                    <button
                      onClick={() => {
                        dispatch({
                          type: "REMOVE_FROM_SUBSCRIPTION",
                          productId: item.productId,
                        });
                        dispatch({
                          type: "SHOW_TOAST",
                          message: `Removed ${item.product?.name} from subscription.`,
                          toastType: "info",
                        });
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
          )}
        </div>

        {/* Total & Summary */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600">Monthly Subtotal</span>
          <span className="text-base font-extrabold text-gray-900">₹{subtotal}</span>
        </div>
      </div>

      <AddProductToSubscriptionModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
