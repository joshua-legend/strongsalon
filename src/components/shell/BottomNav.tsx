"use client";

import { useMemo } from "react";
import {
  CircleAlert,
  Award,
  BarChart2,
  BookOpen,
  ClipboardList,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useGoal } from "@/context/GoalContext";
import { useTheme } from "@/context/ThemeContext";
import type { TabId } from "@/types";
import { isLevelSetupComplete as getIsLevelSetupComplete } from "@/utils/levelSetup";

const tabs: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: "home", label: "\uC6B4\uB3D9", Icon: Dumbbell },
  { id: "level", label: "\uB808\uBCA8", Icon: Award },
  { id: "record", label: "\uAE30\uB85D", Icon: ClipboardList },
  { id: "stats", label: "\uD1B5\uACC4", Icon: BarChart2 },
  { id: "exercise-info", label: "\uB77C\uC774\uBE0C\uB7EC\uB9AC", Icon: BookOpen },
];

export default function BottomNav() {
  const { activeTab, theme, setTab } = useApp();
  const { theme: colorTheme } = useTheme();
  const { categorySettings } = useGoal();
  const isLevelSetupComplete = useMemo(
    () => getIsLevelSetupComplete(categorySettings),
    [categorySettings]
  );

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
        const isActive =
          tab.id === "home"
            ? activeTab === tab.id || theme === "workout"
            : activeTab === tab.id;
        const showLevelSetupBadge = tab.id === "level" && !isLevelSetupComplete;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`flex flex-1 flex-col items-center gap-1.5 p-2 transition-colors duration-300 active:scale-95 ${
              isActive
                ? "text-[var(--accent-main)]"
                : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
            }`}
          >
            <div className="relative">
              <tab.Icon className="h-6 w-6" />
              {showLevelSetupBadge && (
                <span
                  className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full border flex items-center justify-center px-[2px]"
                  style={{
                    borderColor: "var(--accent-main)",
                    backgroundColor: "var(--accent-bg)",
                    color: "var(--accent-main)",
                  }}
                  title="레벨 데이터 설정 필요"
                >
                  <CircleAlert className="h-2.5 w-2.5" />
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
