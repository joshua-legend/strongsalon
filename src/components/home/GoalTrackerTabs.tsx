"use client";

import { useState } from "react";
import { useGoal } from "@/context/GoalContext";
import UnifiedGoalCard from "./UnifiedGoalCard";
import WeeklyView from "./WeeklyView";
import InBodyView from "./InBodyView";

type TabId = "goal" | "weekly" | "inbody";

const TABS: { id: TabId; label: string }[] = [
  { id: "goal", label: "현재 목표" },
  { id: "weekly", label: "위클리" },
  { id: "inbody", label: "인바디" },
];

export default function GoalTrackerTabs() {
  const { activeQuest } = useGoal();
  const [activeTab, setActiveTab] = useState<TabId>("goal");

  return (
    <div className="space-y-4">
      <div className="rounded-full p-1 bg-[var(--bg-card)] border border-[var(--border-light)] flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[var(--bg-card-hover)] text-[var(--text-main)]"
                : "text-[var(--text-sub)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="transition-opacity duration-200" style={{ opacity: 1 }}>
        {activeTab === "goal" && (activeQuest ? <UnifiedGoalCard /> : (
          <div className="py-12 text-center text-xs text-[var(--text-sub)]">
            목표를 설정하면 골 트래커가 표시됩니다
          </div>
        ))}
        {activeTab === "weekly" && <WeeklyView />}
        {activeTab === "inbody" && <InBodyView />}
      </div>
    </div>
  );
}
