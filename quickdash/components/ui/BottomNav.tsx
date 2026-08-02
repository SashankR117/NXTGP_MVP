"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, TrendingUp, RefreshCw, Users } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { href: "/circles", label: "Circles", icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-0.5 px-3 transition-all rounded-xl ${
                isActive
                  ? "text-[#0C831F] font-bold"
                  : "text-gray-400 hover:text-gray-700 font-medium"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0C831F]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

