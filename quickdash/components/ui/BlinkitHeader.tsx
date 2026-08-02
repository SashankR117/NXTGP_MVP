"use client";

import { useApp } from "@/lib/store";
import { personas } from "@/lib/data/users";
import { Search, ChevronDown, Mic, Zap, ArrowLeft, Sparkles, User, Camera } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function BlinkitHeader({ showBack }: { showBack?: boolean }) {
  const { state, dispatch } = useApp();
  const [personaOpen, setPersonaOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isBackVisible = showBack !== undefined ? showBack : !isHome;

  return (
    <div className="bg-[#F8CB46] text-black pt-2 pb-3 px-3.5 shadow-sm sticky top-0 z-40">
      {/* Top Header Row: Brand Logo, Delivery Badge & Persona Switcher */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Back button on secondary screens */}
          {isBackVisible && (
            <button
              onClick={() => router.back()}
              className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors mr-0.5 flex-shrink-0"
              title="Go Back"
            >
              <ArrowLeft size={16} className="text-black font-bold" />
            </button>
          )}

          {/* Authentic Blinkit Brand Logo */}
          <div className="flex items-baseline select-none">
            <span className="text-xl font-black tracking-tighter text-black font-sans">blink</span>
            <span className="text-xl font-black tracking-tighter text-[#0C831F] font-sans">it</span>
          </div>

          <div className="h-4 w-[1px] bg-black/20 mx-0.5" />

          {/* Delivery speed badge */}
          <div className="bg-black text-white px-2 py-0.5 rounded-md flex items-center gap-1 font-extrabold text-[10px] tracking-tight flex-shrink-0 shadow-xs">
            <Zap size={10} className="text-[#F8CB46] fill-[#F8CB46]" />
            8 MINS
          </div>
        </div>

        {/* Persona Switcher / Profile Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-black/10 hover:bg-black/15 rounded-full border border-black/10 transition-all text-xs font-bold"
          >
            <span className="text-sm">{state.currentPersona.avatarEmoji}</span>
            <span className="max-w-[65px] truncate text-[11px] text-gray-900">
              {state.currentPersona.fullName.split(" ")[0]}
            </span>
            <ChevronDown size={12} className={`transition-transform ${personaOpen ? "rotate-180" : ""}`} />
          </button>

          {personaOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in text-gray-800">
              <div className="p-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">
                  Switch Persona (Demo Profile)
                </p>
                <User size={12} className="text-gray-400" />
              </div>
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    dispatch({ type: "SWITCH_PERSONA", personaId: persona.id });
                    setPersonaOpen(false);
                    dispatch({
                      type: "SHOW_TOAST",
                      message: `Switched to ${persona.fullName}`,
                      toastType: "info",
                    });
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-none ${
                    state.currentPersona.id === persona.id ? "bg-green-50/80 font-bold" : ""
                  }`}
                >
                  <span className="text-xl">{persona.avatarEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {persona.fullName}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      Category Focus: {persona.primaryCategories.join(", ")}
                    </p>
                  </div>
                  {state.currentPersona.id === persona.id && (
                    <Sparkles size={14} className="text-[#0C831F] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address & Locality Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-[12px] text-black tracking-tight">
                Deliver to {state.currentPersona.locality}
              </span>
              <ChevronDown size={12} className="text-black font-bold flex-shrink-0" />
            </div>
            <p className="text-[10px] text-black/70 font-semibold truncate max-w-[240px]">
              Sector 62, Noida • High-Velocity Dark Store catchment
            </p>
          </div>
        </div>
      </div>

      {/* Authentic Blinkit Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-xs border border-black/10">
          <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder='Search "milk", "bread", "curd", "coffee"'
            className="w-full bg-transparent text-xs text-gray-900 focus:outline-none placeholder-gray-400 font-medium"
            readOnly
          />
          <div className="flex items-center gap-2 text-gray-400 ml-1 flex-shrink-0">
            <Mic size={15} className="cursor-pointer hover:text-gray-600" />
            <Camera size={15} className="cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

