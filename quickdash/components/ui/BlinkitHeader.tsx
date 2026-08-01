"use client";

import { useApp } from "@/lib/store";
import { personas } from "@/lib/data/users";
import { Search, MapPin, ChevronDown, Mic, Zap, ArrowLeft, Sparkles } from "lucide-react";
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
    <div className="bg-[#F8CB46] text-black pt-3 pb-3 px-4 shadow-sm sticky top-0 z-40">
      {/* Top row: Back button, Location & Persona switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Back button on top left when on secondary screens */}
          {isBackVisible && (
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors mr-1 flex-shrink-0"
              title="Go Back"
            >
              <ArrowLeft size={18} className="text-black font-bold" />
            </button>
          )}

          {/* Blinkit delivery speed badge */}
          <div className="bg-black text-white px-2 py-0.5 rounded-md flex items-center gap-1 font-extrabold text-[11px] tracking-tight flex-shrink-0">
            <Zap size={11} className="text-[#F8CB46] fill-[#F8CB46]" />
            8 MINS
          </div>

          {/* Location selector */}
          <div className="leading-none min-w-0">
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="font-extrabold text-xs text-black tracking-tight truncate">
                {state.currentPersona.locality}
              </span>
              <ChevronDown size={12} className="text-black/80 flex-shrink-0" />
            </div>
            <p className="text-[10px] text-black/70 font-medium truncate max-w-[130px] mt-0.5">
              Sector 62, Noida
            </p>
          </div>
        </div>

        {/* Persona Switcher Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-black/10 hover:bg-black/15 rounded-full border border-black/10 transition-all text-xs font-semibold"
          >
            <span>{state.currentPersona.avatarEmoji}</span>
            <span className="max-w-[70px] truncate">{state.currentPersona.fullName.split(" ")[0]}</span>
            <ChevronDown size={12} className={`transition-transform ${personaOpen ? "rotate-180" : ""}`} />
          </button>

          {personaOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in text-gray-800">
              <div className="p-2.5 bg-gray-50 border-b border-gray-200">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Switch Persona (Demo)
                </p>
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-gray-100 transition-colors text-left ${
                    state.currentPersona.id === persona.id ? "bg-green-50 font-bold" : ""
                  }`}
                >
                  <span className="text-xl">{persona.avatarEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {persona.fullName}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      Buys: {persona.primaryCategories.join(", ")}
                    </p>
                  </div>
                  {state.currentPersona.id === persona.id && (
                    <Sparkles size={14} className="text-[#0C831F]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-xl px-3.5 py-2 shadow-sm border border-gray-200">
          <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder='Search "milk", "bread", "eggs", "coffee"'
            className="w-full bg-transparent text-xs text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
            readOnly
          />
          <Mic size={15} className="text-gray-400 ml-2 flex-shrink-0 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
