"use client";

import { useApp } from "@/context/AppContext";
import type { TabId } from "@/types";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "홈" },
  { id: "performance", icon: "🏃", label: "수행능력" },
  { id: "workout", icon: "💪", label: "" },
  { id: "stats", icon: "📊", label: "통계" },
  { id: "ranking", icon: "🏅", label: "랭킹" },
];

const WORKOUT_NAV_BG = {
  dark: "rgba(26,9,0,.97)",
  light: "rgba(248,244,240,.97)",
} as const;

export default function BottomNav() {
  const { activeTab, theme, colorMode, setTab, enterWorkout } = useApp();
  const isWorkoutMode = theme === "workout";

  return (
    <nav
      className="shrink-0 flex items-end justify-around relative"
      style={{
        height: 72,
        background: isWorkoutMode ? WORKOUT_NAV_BG[colorMode] : "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((tab) => {
        const isCenter = tab.id === "workout";
        const isActive = activeTab === tab.id;

        if (isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => enterWorkout()}
              className="flex flex-col items-center justify-center relative"
              style={{ marginTop: -10 }}
            >
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[24px]"
                style={{
                  background: "linear-gradient(135deg, var(--orange), #ff8c4a)",
                  boxShadow: "0 4px 20px rgba(255,94,31,.45)",
                  transform: "translateY(-10px)",
                }}
              >
                💪
              </div>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="flex flex-col items-center justify-center gap-0.5 pt-2 flex-1"
          >
            <span
              className="text-[20px] transition-transform duration-200"
              style={{ transform: isActive ? "scale(1.15)" : "scale(1)" }}
            >
              {tab.icon}
            </span>
            <span
              className="text-[10px] font-medium transition-colors duration-200"
              style={{
                fontFamily: "var(--font-pretendard)",
                color: isActive ? "var(--orange)" : "var(--muted)",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
