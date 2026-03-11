"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useGoal } from "@/context/GoalContext";
import MyPageModal from "@/components/mypage/MyPageModal";
import { appendChartPoint } from "@/context/useChartDataStorage";
import { CYCLE_WEEKS, CYCLE_DAYS } from "@/utils/chartConstants";
import type { CategorySetting } from "@/types/categorySettings";

function getDateForDay(configuredAt: string, day: number): string {
  const d = new Date(configuredAt);
  d.setDate(d.getDate() + day);
  return d.toISOString().slice(0, 10);
}

function randomBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

export default function Topbar() {
  const { user } = useUser();
  const { categorySettings, setCategorySetting } = useGoal();
  const [showMyPage, setShowMyPage] = useState(false);

  const handleTestClick = () => {
    const strength = categorySettings.strength;
    let configuredAt = strength?.configuredAt ?? null;

    if (!configuredAt) {
      const today = new Date().toISOString().slice(0, 10);
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 28);
      const startVal = 100;
      const targetVal = 120;
      const newSetting: CategorySetting = {
        isConfigured: true,
        configuredAt: today,
        startValues: { squat: startVal, bench: 90, deadlift: 120, total: 310 },
        goal: {
          metric: "squat",
          startValue: startVal,
          targetValue: targetVal,
          weeklyDelta: (targetVal - startVal) / CYCLE_WEEKS,
          estimatedWeeks: CYCLE_WEEKS,
          totalWeeks: CYCLE_WEEKS,
        },
        autoPaces: {
          squat: { start: startVal, target: targetVal, weeklyDelta: 5 },
          bench: { start: 90, target: 100, weeklyDelta: 2.5 },
          deadlift: { start: 120, target: 135, weeklyDelta: 3.75 },
        },
        cycleWeeks: CYCLE_WEEKS,
        cycleEndDate: endDate.toISOString().slice(0, 10),
      };
      setCategorySetting("strength", newSetting);
      configuredAt = today;
    }

    const startVal = strength?.autoPaces?.squat?.start ?? strength?.startValues?.squat ?? 100;
    const targetVal = strength?.autoPaces?.squat?.target ?? strength?.goal?.targetValue ?? 120;
    const minVal = Math.min(startVal, targetVal) - 10;
    const maxVal = Math.max(startVal, targetVal) + 10;

    for (let d = 0; d <= CYCLE_DAYS; d++) {
      const date = getDateForDay(configuredAt!, d);
      const value = randomBetween(minVal, maxVal);
      appendChartPoint(
        "strength.squat",
        { day: d, value, date },
        configuredAt!
      );
    }

    window.dispatchEvent(new CustomEvent("chartRefresh"));
  };

  return (
    <>
      <header
        className="flex items-center justify-between px-5 shrink-0 h-[60px] bg-black border-b border-lime-500/25"
        style={{ boxShadow: "0 0 30px rgba(163,230,53,.06), 0 1px 0 rgba(163,230,53,.18)" }}
      >
        {/* 테스트 버튼 */}
        <button
          type="button"
          onClick={handleTestClick}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 transition-colors"
        >
          테스트
        </button>

        {/* Logo */}
        <div className="font-bebas text-[24px] tracking-wide leading-none">
          <span
            style={{
              color: "#a3e635",
              textShadow: "0 0 10px #a3e635, 0 0 22px rgba(163,230,53,.5)",
            }}
          >
            Fit
          </span>
          <span className="text-neutral-700">Log</span>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Bell */}
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.06)" }}
          >
            <span className="text-[16px]">🔔</span>
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 animate-pulse"
              style={{ boxShadow: "0 0 6px #a3e635, 0 0 12px rgba(163,230,53,.4)" }}
            />
          </button>

          {/* Avatar */}
          <button
            type="button"
            onClick={() => setShowMyPage(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-black transition-all hover:brightness-110"
            style={{ background: "#a3e635", boxShadow: "0 0 16px rgba(163,230,53,.45)" }}
          >
            {user?.initial ?? "?"}
          </button>
        </div>
      </header>

      <MyPageModal open={showMyPage} onClose={() => setShowMyPage(false)} />
    </>
  );
}
