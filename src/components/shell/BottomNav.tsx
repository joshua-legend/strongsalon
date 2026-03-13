"use client";

import { Home, BarChart2, PlusCircle, Trophy, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import type { TabId } from "@/types";

const tabs: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "홈", Icon: Home },
  { id: "stats", label: "통계", Icon: BarChart2 },
  { id: "workout", label: "운동", Icon: PlusCircle },
  { id: "performance", label: "챌린지", Icon: Trophy },
  { id: "exercise-info", label: "라이브러리", Icon: BookOpen },
];

export default function BottomNav() {
  const { activeTab, theme, setTab, enterWorkout } = useApp();
  const { theme: colorTheme } = useTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 w-full max-w-[480px] mx-auto bg-[var(--bg-card)]/80 backdrop-blur-lg border-t border-[var(--border-light)] px-6 py-3 z-40 flex justify-between items-center ${
        colorTheme === "light" ? "" : "shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      }`}
      style={{
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((tab) => {
        const isCenter = tab.id === "workout";
        const isActive =
          isCenter ? theme === "workout" : activeTab === tab.id;

        if (isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => enterWorkout()}
              className="relative group flex flex-col items-center gap-1.5 p-2 transition-colors duration-300 active:scale-95"
            >
              <div
                className={`absolute inset-0 blur-md rounded-full transition-opacity duration-300 ${
                  isActive ? "opacity-100 bg-[var(--accent-main)]/20" : "opacity-0 group-hover:opacity-50 group-hover:bg-[var(--accent-main)]/20"
                }`}
              />
              <tab.Icon
                className={`w-6 h-6 relative z-10 transition-colors duration-300 ${
                  isActive ? "text-[var(--accent-main)]" : "text-[var(--text-sub)] group-hover:text-[var(--text-main)]"
                }`}
              />
              <span
                className={`text-[11px] font-semibold tracking-wide relative z-10 transition-colors duration-300 ${
                  isActive ? "text-[var(--accent-main)]" : "text-[var(--text-sub)] group-hover:text-[var(--text-main)]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 p-2 transition-colors duration-300 active:scale-95 ${
              isActive ? "text-[var(--accent-main)]" : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
            }`}
          >
            <tab.Icon className="w-6 h-6" />
            <span className="text-[11px] font-semibold tracking-wide">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
