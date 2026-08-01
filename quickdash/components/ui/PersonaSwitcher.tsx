"use client";

import { useApp } from "@/lib/store";
import { personas } from "@/lib/data/users";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

export default function PersonaSwitcher() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-dash-bg/90 backdrop-blur-xl border-b border-dash-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dash-accent-green to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            Q
          </div>
          <div>
            <h1 className="text-base font-bold text-dash-text-primary leading-tight">
              QuickDash
            </h1>
            <p className="text-[10px] text-dash-text-secondary/60 leading-tight">
              10 min delivery
            </p>
          </div>
        </div>

        {/* Persona switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-dash-card rounded-full border border-dash-border hover:border-dash-accent-blue/40 transition-all"
          >
            <span className="text-lg">{state.currentPersona.avatarEmoji}</span>
            <span className="text-xs font-medium text-dash-text-secondary">
              {state.currentPersona.fullName}
            </span>
            <ChevronDown
              size={14}
              className={`text-dash-text-secondary/60 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-dash-card border border-dash-border rounded-xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-2 border-b border-dash-border">
                <p className="text-[10px] text-dash-text-secondary/60 uppercase tracking-wider font-semibold px-2">
                  Switch Demo Persona
                </p>
              </div>
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    dispatch({ type: "SWITCH_PERSONA", personaId: persona.id });
                    setIsOpen(false);
                    dispatch({
                      type: "SHOW_TOAST",
                      message: `Switched to ${persona.fullName}`,
                      toastType: "info",
                    });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dash-card-hover transition-colors ${
                    state.currentPersona.id === persona.id
                      ? "bg-dash-card-hover"
                      : ""
                  }`}
                >
                  <span className="text-2xl">{persona.avatarEmoji}</span>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-dash-text-primary">
                      {persona.fullName}
                    </p>
                    <p className="text-[10px] text-dash-text-secondary/60">
                      Buys: {persona.primaryCategories.join(", ")}
                    </p>
                  </div>
                  {state.currentPersona.id === persona.id && (
                    <Sparkles size={14} className="text-dash-accent-green" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
