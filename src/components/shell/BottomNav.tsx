"use client";

import { useApp } from "@/context/AppContext";
import type { TabId } from "@/types";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "홈" },
  { id: "stats", icon: "📊", label: "통계" },
  { id: "workout", icon: "💪", label: "" },
  { id: "performance", icon: "🏆", label: "레코드" },
  { id: "exercise-info", icon: "📚", label: "라이브러리" },
];

export default function BottomNav() {
  const { activeTab, theme, setTab, enterWorkout } = useApp();

  return (
    <nav
      className="shrink-0 flex items-end justify-around relative h-[72px] bg-black border-t border-lime-500/20"
      style={{
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        boxShadow: "0 -1px 0 rgba(163,230,53,.15), 0 -15px 40px rgba(0,0,0,.9)",
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
                  background: "linear-gradient(135deg, #a3e635 0%, #65a30d 100%)",
                  boxShadow:
                    "0 0 20px rgba(163,230,53,.65), 0 0 40px rgba(163,230,53,.25), 0 4px 20px rgba(0,0,0,.5)",
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
              className="text-[10px] font-medium transition-all duration-200 font-sans"
              style={
                isActive
                  ? { color: "#a3e635", textShadow: "0 0 8px rgba(163,230,53,.6)" }
                  : { color: "#2a2a2a" }
              }
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
