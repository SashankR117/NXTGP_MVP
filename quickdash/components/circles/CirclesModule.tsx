"use client";

import { useApp } from "@/lib/store";
import { getPersonaById } from "@/lib/data/users";
import { getProductById } from "@/lib/data/products";
import QuantityStepper from "@/components/ui/QuantityStepper";
import {
  Eye,
  EyeOff,
  Heart,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  ChevronRight,
  Phone,
  Send,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import VisibilityManager from "./VisibilityManager";

export default function CirclesModule() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<"feed" | "privacy">("feed");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneSending, setPhoneSending] = useState(false);

  const { currentPersona, friendConnectionsList, shelfItemsList } = state;

  const currentPurchasedCategories = new Set(
    currentPersona.purchaseHistory
      .map((id) => getProductById(id)?.category)
      .filter(Boolean) as string[]
  );

  // Mutual connections
  const mutualConnections = friendConnectionsList.filter(
    (fc) =>
      fc.status === "mutual" &&
      (fc.requesterId === currentPersona.id || fc.addresseeId === currentPersona.id)
  );

  const mutualFriendIds = mutualConnections.map((fc) =>
    fc.requesterId === currentPersona.id ? fc.addresseeId : fc.requesterId
  );

  // Pending requests TO current user
  const pendingRequests = friendConnectionsList.filter(
    (fc) => fc.status === "pending" && fc.addresseeId === currentPersona.id
  );

  // Pending requests SENT BY current user
  const sentPendingRequests = friendConnectionsList.filter(
    (fc) => fc.status === "pending" && fc.requesterId === currentPersona.id
  );

  // Shared shelf items from MUTUAL friends ONLY
  const friendShelfItems = shelfItemsList.filter(
    (item) => mutualFriendIds.includes(item.userId) && item.visibilityFlag
  );

  // Sort with DISCOVERY-BIAS
  const sortedFriendShelfItems = [...friendShelfItems].sort((a, b) => {
    const aNew = !currentPurchasedCategories.has(a.category);
    const bNew = !currentPurchasedCategories.has(b.category);
    if (aNew && !bNew) return -1;
    if (!aNew && bNew) return 1;
    return 0;
  });

  const handleSendPhoneInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 8) {
      dispatch({
        type: "SHOW_TOAST",
        message: "Please enter a valid 10-digit mobile number",
        toastType: "info",
      });
      return;
    }

    setPhoneSending(true);
    setTimeout(() => {
      dispatch({
        type: "SEND_FRIEND_REQUEST_BY_PHONE",
        phone: phoneInput,
      });
      dispatch({
        type: "SHOW_TOAST",
        message: `Connect invite sent to ${phoneInput}! Pending double opt-in acceptance.`,
      });
      setPhoneInput("");
      setPhoneSending(false);
    }, 600);
  };

  return (
    <div className="space-y-3 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <Link href="/circles" className="flex items-center gap-1.5 group flex-1">
          <Users size={16} className="text-[#0C831F]" />
          <div>
            <h3 className="text-xs font-extrabold text-gray-900 group-hover:text-[#0C831F] transition-colors tracking-tight flex items-center gap-1">
              Circles — Friends' Favorites
              <ChevronRight size={14} className="text-gray-400 group-hover:text-[#0C831F] transition-colors" />
            </h3>
            <p className="text-[10px] text-gray-500 font-medium">
              Mutual double opt-in • {mutualConnections.length} connected friends
            </p>
          </div>
        </Link>

        <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px]">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              activeTab === "feed"
                ? "bg-[#0C831F] text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              activeTab === "privacy"
                ? "bg-[#0C831F] text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Privacy
          </button>
        </div>
      </div>

      {activeTab === "privacy" ? (
        <VisibilityManager />
      ) : (
        <div className="space-y-3">
          {/* Requirement 2: Add Friends Invite Mechanism by Mobile Number */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-gray-900 flex items-center gap-1.5">
                <UserPlus size={14} className="text-[#0C831F]" />
                Add Friend to Circle
              </span>
              <span className="text-[9px] bg-green-50 text-[#0C831F] font-bold px-1.5 py-0.2 rounded border border-green-200">
                Hashed Phone Lookup
              </span>
            </div>

            <form onSubmit={handleSendPhoneInvite} className="flex gap-1.5">
              <div className="relative flex-1">
                <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter friend's 10-digit mobile number"
                  className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-none focus:border-[#0C831F]"
                />
              </div>
              <button
                type="submit"
                disabled={phoneSending}
                className="px-3 py-1.5 bg-[#0C831F] text-white font-extrabold text-xs rounded-xl hover:bg-[#096918] transition-colors flex items-center gap-1 flex-shrink-0 active:scale-95 disabled:opacity-50"
              >
                {phoneSending ? "Sending..." : <><Send size={11} /> Invite</>}
              </button>
            </form>

            {/* Sent Pending Requests Banner */}
            {sentPendingRequests.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                <span>Outbound requests: {sentPendingRequests.length} pending double opt-in</span>
                <span className="font-bold text-amber-700">Awaiting acceptance</span>
              </div>
            )}
          </div>

          {/* Pending Connection Requests TO Me */}
          {pendingRequests.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 shadow-xs animate-fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                  <UserPlus size={11} className="text-amber-700" />
                  Incoming Request ({pendingRequests.length})
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  Double Opt-In Gate
                </span>
              </div>

              {pendingRequests.map((req) => {
                const requester = getPersonaById(req.requesterId);
                if (!requester) return null;

                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{requester.avatarEmoji}</span>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900">
                          {requester.fullName}
                        </p>
                        <p className="text-[9px] text-gray-500 font-medium">
                          {requester.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        dispatch({
                          type: "ACCEPT_FRIEND_REQUEST",
                          connectionId: req.id,
                        });
                        dispatch({
                          type: "SHOW_TOAST",
                          message: `Connected with ${requester.fullName}! Mutual shelf visible.`,
                        });
                      }}
                      className="px-2.5 py-1 bg-[#0C831F] text-white text-[10px] font-extrabold rounded-md hover:bg-[#096918] transition-colors flex items-center gap-0.5 active:scale-95"
                    >
                      <UserCheck size={11} /> Accept
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Horizontally Scrollable Friends Products Cards (Product-Focused, Real Images & Stepper) */}
          {sortedFriendShelfItems.length > 0 ? (
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
              {sortedFriendShelfItems.map((item) => {
                const friend = getPersonaById(item.userId);
                const product = getProductById(item.productId);
                if (!friend || !product) return null;

                const isNewCategoryForViewer = !currentPurchasedCategories.has(
                  product.category
                );

                return (
                  <div
                    key={item.id}
                    className={`flex-shrink-0 w-36 bg-white rounded-xl border p-2.5 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#0C831F]/40 transition-all group ${
                      isNewCategoryForViewer
                        ? "border-[#0C831F]/40 bg-gradient-to-b from-emerald-50/40 to-white"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      {/* Peer Hint Badge */}
                      <div className="bg-gray-50 px-1.5 py-0.5 rounded-md mb-1.5 border border-gray-100 flex items-center gap-1 truncate">
                        <span className="text-xs">{friend.avatarEmoji}</span>
                        <span className="text-[9px] font-bold text-gray-700 truncate">
                          {friend.fullName.split(" ")[0]}'s {item.type === "liked" ? "Liked ❤️" : "Repeat 🔁"}
                        </span>
                      </div>

                      {/* Discovery Highlight */}
                      {isNewCategoryForViewer && (
                        <div className="bg-green-100 px-1.5 py-0.2 rounded text-[8px] font-extrabold text-[#0C831F] mb-1.5 flex items-center gap-0.5 truncate">
                          <Sparkles size={8} /> New Category!
                        </div>
                      )}

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
                    </div>

                    {/* Pricing & Stepper UI */}
                    <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-gray-900">
                        ₹{product.price}
                      </span>

                      {/* Requirement 1: Quantity Stepper (- 1 +) */}
                      <QuantityStepper productId={product.id} compact={true} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-xs font-bold text-gray-700">No Friend Items Shared Yet</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Accept or send pending requests to see peer picks.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
