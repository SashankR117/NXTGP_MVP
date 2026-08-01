"use client";

import { useApp } from "@/lib/store";
import { products, CATEGORIES, getProductById } from "@/lib/data/products";
import { Search, Plus, X, Check, Sparkles } from "lucide-react";
import { useState } from "react";

export default function AddProductToSubscriptionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const subscribedProductIds = new Set(
    state.subscription.items.map((i) => i.productId)
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-[430px] w-full max-h-[85vh] flex flex-col shadow-2xl animate-slide-up overflow-hidden text-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#F8CB46]">
          <div>
            <h3 className="font-extrabold text-sm text-black flex items-center gap-1.5">
              <Plus size={16} /> Add Products to Monthly Box
            </h3>
            <p className="text-[10px] text-black/80 font-medium">
              Browse & add any catalog item directly to your subscription
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-gray-100 bg-gray-50 space-y-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products to add to subscription..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#0C831F]"
            />
          </div>

          {/* Horizontal Category Pill Filter */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 ${
                selectedCategory === null
                  ? "bg-[#0C831F] text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 flex items-center gap-1 ${
                  selectedCategory === cat.name
                    ? "bg-[#0C831F] text-white"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-gray-100">
          {filteredProducts.map((product) => {
            const isSubscribed = subscribedProductIds.has(product.id);

            return (
              <div
                key={product.id}
                className="pt-2 first:pt-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">
                      {product.category} {product.weight ? `• ${product.weight}` : ""}
                    </p>
                    <p className="text-xs font-extrabold text-[#0C831F] mt-0.5">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                {isSubscribed ? (
                  <span className="text-[11px] font-bold text-[#0C831F] bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200 flex items-center gap-1 flex-shrink-0">
                    <Check size={13} /> Subscribed
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
                    className="px-3 py-1.5 bg-[#0C831F] text-white font-extrabold text-xs rounded-lg hover:bg-[#096918] transition-colors flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-xs"
                  >
                    <Plus size={13} /> Add to Box
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
