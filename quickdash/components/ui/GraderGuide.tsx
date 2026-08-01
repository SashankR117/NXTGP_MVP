"use client";

import { useApp } from "@/lib/store";
import { X, FlaskConical, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function GraderGuide() {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => dispatch({ type: "TOGGLE_GRADER_GUIDE" })}
        className="fixed bottom-20 left-4 z-50 bg-black text-[#F8CB46] border border-[#F8CB46]/40 rounded-full px-3.5 py-2 shadow-2xl hover:bg-gray-900 transition-all flex items-center gap-1.5 font-bold text-xs"
        title="Evaluation Script v2"
      >
        <FlaskConical size={16} className="text-[#F8CB46]" />
        <span>Grader Guide v2</span>
      </button>

      {/* Evaluation Modal */}
      {state.graderGuideOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-[420px] w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in text-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-[#F8CB46] text-black rounded-t-2xl">
              <div className="flex items-center gap-2">
                <FlaskConical size={20} className="text-black" />
                <h2 className="font-extrabold text-base">
                  Blinkit Master Prompt v2 Verification
                </h2>
              </div>
              <button
                onClick={() => dispatch({ type: "TOGGLE_GRADER_GUIDE" })}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            {/* Test Scenarios */}
            <div className="p-4 space-y-3">
              <ModuleTestCard
                num="1"
                title="Module 1: Recurring Subscriptions"
                bullets={[
                  "Check day-of-month recurrence controls & pause/skip functions",
                  "Verify pre-charge renewal touchpoint with mandatory discovery slot (not a silent background job!)",
                  "Test adding recommended trial item directly into subscription basket",
                ]}
              />

              <ModuleTestCard
                num="2"
                title="Module 2: Hyperlocal Demand"
                bullets={[
                  "Observe catchment zone trends (Sector 62, Noida)",
                  "Verify rate-of-change trend velocity calculation",
                  "Confirm promotional bulk orders are excluded",
                  "Check Discovery Filter: items from categories you already buy are excluded!",
                ]}
              />

              <ModuleTestCard
                num="3"
                title="Module 3: Circles (Friends Connect)"
                bullets={[
                  "Test Mutual Double Opt-In gate: Accept pending request from Rahul Verma",
                  "Verify NO raw order history or timestamps are displayed (only aggregated cadence & liked tags)",
                  "Verify Discovery-Biased Display: items from unexplored categories rank first!",
                  "Open 'Manage Visibility' to test instant disconnect & category privacy matrix",
                ]}
              />

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                💡 <b>Persona Switcher:</b> Use top dropdown to switch between Ananya, Rahul, Priya, & Arjun to test dynamic category discovery per user profile.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ModuleTestCard({
  num,
  title,
  bullets,
}: {
  num: string;
  title: string;
  bullets: string[];
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-[#0C831F] text-white font-bold text-xs flex items-center justify-center">
          {num}
        </span>
        <h4 className="text-xs font-extrabold text-gray-900">{title}</h4>
      </div>
      <ul className="space-y-1 pl-7 text-[11px] text-gray-600 list-disc">
        {bullets.map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
