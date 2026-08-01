"use client";

import { useApp } from "@/lib/store";
import { getPersonaById } from "@/lib/data/users";
import { CATEGORIES, getProductById } from "@/lib/data/products";
import { Eye, EyeOff, Lock, ShieldAlert, Trash2, UserX, Check } from "lucide-react";

export default function VisibilityManager() {
  const { state, dispatch } = useApp();
  const { currentPersona, friendConnectionsList, shelfItemsList } = state;

  // Mutual connections
  const mutualConnections = friendConnectionsList.filter(
    (fc) =>
      fc.status === "mutual" &&
      (fc.requesterId === currentPersona.id || fc.addresseeId === currentPersona.id)
  );

  // My curated shelf items
  const myShelfItems = shelfItemsList.filter((item) => item.userId === currentPersona.id);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Active Mutual Connections & Revoke Controls */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">
          Connected Friends ({mutualConnections.length}) — Revoke Access Instantly
        </h3>

        {mutualConnections.length > 0 ? (
          <div className="space-y-2">
            {mutualConnections.map((fc) => {
              const friendId =
                fc.requesterId === currentPersona.id ? fc.addresseeId : fc.requesterId;
              const friend = getPersonaById(friendId);
              if (!friend) return null;

              return (
                <div
                  key={fc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{friend.avatarEmoji}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {friend.fullName}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Phone Hash: {fc.hashedPhoneMatch.substring(0, 10)}...
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      dispatch({
                        type: "DISCONNECT_FRIEND",
                        connectionId: fc.id,
                      });
                      dispatch({
                        type: "SHOW_TOAST",
                        message: `Revoked connection with ${friend.fullName}. Access cut instantly.`,
                        toastType: "info",
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <UserX size={12} /> Disconnect
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No active mutual connections.</p>
        )}
      </div>

      {/* Category Level Privacy Matrix */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            Category Privacy Controls (Smart Defaults)
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
            Hygiene / Medical Auto-Hidden
          </span>
        </div>

        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const catItems = myShelfItems.filter((i) => i.category === cat.name);
            const isAllVisible = catItems.length > 0 && catItems.every((i) => i.visibilityFlag);

            return (
              <div
                key={cat.name}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                    {cat.isSensitive && (
                      <span className="text-[9px] font-semibold text-amber-700 flex items-center gap-0.5">
                        <Lock size={9} /> Sensitive Category (Default Hidden)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    dispatch({
                      type: "TOGGLE_CATEGORY_VISIBILITY",
                      category: cat.name,
                      visible: !isAllVisible,
                    });
                    dispatch({
                      type: "SHOW_TOAST",
                      message: `${cat.name} visibility updated.`,
                      toastType: "info",
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isAllVisible
                      ? "bg-green-100 text-[#0C831F]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isAllVisible ? (
                    <>
                      <Eye size={12} /> Shared
                    </>
                  ) : (
                    <>
                      <EyeOff size={12} /> Hidden
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
