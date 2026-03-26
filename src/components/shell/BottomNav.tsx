"use client";

import {
  Award,
  BarChart2,
  BookOpen,
  ClipboardList,
  Dumbbell,
  Home,
  PlusCircle,
  Trophy,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import type { TabId } from "@/types";

const tabs: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "운동", Icon: Dumbbell },
  { id: "level", label: "레벨", Icon: Award },
  { id: "record", label: "기록", Icon: ClipboardList },
  { id: "stats", label: "통계", Icon: BarChart2 },
  { id: "workout", label: "테스트", Icon: PlusCircle },
  { id: "performance", label: "챌린지", Icon: Trophy },
  { id: "exercise-info", label: "라이브러리", Icon: BookOpen },
];

export default function BottomNav() {
  const { activeTab, theme, setTab, enterWorkout } = useApp();
  const { theme: colorTheme } = useTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 mx-auto flex w-full max-w-[480px] items-center justify-between border-t px-4 py-3 backdrop-blur-lg ${
        colorTheme === "light" ? "" : "shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      }`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-card) 80%, transparent)",
        borderColor: "var(--border-light)",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((tab) => {
        const isCenter = tab.id === "workout";
        const isActive = isCenter ? theme === "workout" : activeTab === tab.id;

        if (isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => enterWorkout()}
              className="group relative flex flex-1 flex-col items-center gap-1.5 p-2 transition-colors duration-300 active:scale-95"
            >
              <div
                className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                  isActive
                    ? "bg-[var(--accent-main)]/20 opacity-100"
                    : "opacity-0 group-hover:bg-[var(--accent-main)]/20 group-hover:opacity-50"
                }`}
              />
              <tab.Icon
                className={`relative z-10 h-6 w-6 transition-colors duration-300 ${
                  isActive
                    ? "text-[var(--accent-main)]"
                    : "text-[var(--text-sub)] group-hover:text-[var(--text-main)]"
                }`}
              />
              <span
                className={`relative z-10 text-[11px] font-semibold tracking-wide transition-colors duration-300 ${
                  isActive
                    ? "text-[var(--accent-main)]"
                    : "text-[var(--text-sub)] group-hover:text-[var(--text-main)]"
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
            className={`flex flex-1 flex-col items-center gap-1.5 p-2 transition-colors duration-300 active:scale-95 ${
              isActive
                ? "text-[var(--accent-main)]"
                : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
            }`}
          >
            <tab.Icon className="h-6 w-6" />
            <span className="text-[11px] font-semibold tracking-wide">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
