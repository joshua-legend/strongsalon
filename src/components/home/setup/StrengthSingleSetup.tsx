"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { CategorySetting } from "@/types/categorySettings";
import type { StrengthChartOption } from "@/utils/goalChartData";
import { estimate1RM } from "@/utils/estimate1RM";

const STRENGTH_LABELS: Record<StrengthChartOption, string> = {
  squat: "스쿼트",
  bench: "벤치프레스",
  deadlift: "데드리프트",
};

const CYCLE_WEEKS = 4;

function get4WeekTargetDelta(
  experience: "beginner" | "intermediate" | "advanced"
): number {
  if (experience === "beginner") return 10;
  if (experience === "intermediate") return 6;
  return 4;
}

interface StrengthSingleSetupProps {
  metric: StrengthChartOption;
  profile?: UserProfile | null;
  existingSetting?: CategorySetting | null;
  onComplete: (setting: CategorySetting) => void;
  onBack: () => void;
}

export default function StrengthSingleSetup({
  metric,
  profile,
  existingSetting,
  onComplete,
  onBack,
}: StrengthSingleSetupProps) {
  const existingStart = existingSetting?.startValues?.[metric] ?? 0;
  const existingPace = existingSetting?.autoPaces?.[metric];
  const existingWeight = existingSetting?.startValues
    ? (metric === "squat" ? 0 : existingSetting.startValues[metric])
    : 0;

  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [targetValue, setTargetValue] = useState(existingPace?.target ?? 0);

  const oneRM = weight > 0 && reps > 0
    ? estimate1RM(weight, reps)
    : existingStart;
  const currentValue = oneRM;

  const experience = profile?.experience ?? "beginner";
  const delta = get4WeekTargetDelta(experience);
  const defaultTarget = currentValue > 0 ? currentValue + delta : 0;
  const effectiveTarget = targetValue > 0 ? targetValue : defaultTarget;

  const hasInput = currentValue > 0;
  const targetValid = currentValue > 0 && effectiveTarget > currentValue;
  const isValid = hasInput && targetValid;

  const weeklyDelta = currentValue > 0 ? (effectiveTarget - currentValue) / CYCLE_WEEKS : 0;

  const handleComplete = () => {
    if (!isValid) return;
    const configuredAt =
      existingSetting?.configuredAt ?? new Date().toISOString().slice(0, 10);
    const endDate = new Date(configuredAt);
    endDate.setDate(endDate.getDate() + 28);

    const prevStartValues = existingSetting?.startValues ?? {};
    const prevAutoPaces = existingSetting?.autoPaces ?? {};
    const prevGoal = existingSetting?.goal;

    const newStartValues = { ...prevStartValues, [metric]: currentValue };
    const totalStart =
      (newStartValues.squat ?? 0) + (newStartValues.bench ?? 0) + (newStartValues.deadlift ?? 0);
    const newAutoPaces = {
      ...prevAutoPaces,
      [metric]: { start: currentValue, target: effectiveTarget, weeklyDelta },
    };
    const totalTarget =
      (newAutoPaces.squat?.target ?? newStartValues.squat ?? 0) +
      (newAutoPaces.bench?.target ?? newStartValues.bench ?? 0) +
      (newAutoPaces.deadlift?.target ?? newStartValues.deadlift ?? 0);
    const totalWeeklyDelta = (totalTarget - totalStart) / CYCLE_WEEKS;

    const setting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: { ...newStartValues, total: totalStart },
      goal: prevGoal ?? {
        metric: "total",
        startValue: totalStart,
        targetValue: totalTarget,
        weeklyDelta: totalWeeklyDelta,
        estimatedWeeks: CYCLE_WEEKS,
        totalWeeks: 4,
      },
      autoPaces: newAutoPaces,
      cycleWeeks: 4,
      cycleEndDate: endDate.toISOString().slice(0, 10),
    };
    onComplete(setting);
  };

  const label = STRENGTH_LABELS[metric];

  return (
    <div className="animate-slide-up-quest min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-neutral-500 hover:text-white transition-colors text-sm"
        >
          ← 뒤로
        </button>
        <h2 className="font-bebas text-xl text-white tracking-wider">
          {label} 설정
        </h2>
        <div className="w-12" />
      </div>

      <p className="text-[11px] text-neutral-600 mb-5">
        최근 수행한 중량 × 횟수 기준으로 입력하세요.
      </p>

      {/* 현재 수치 */}
      <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-3 mb-4 min-w-0">
        <div className="text-[10px] text-neutral-500 font-bold tracking-widest">
          현재 수치
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              placeholder="중량"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0"
            />
            <span className="text-neutral-600 text-xs font-mono shrink-0">kg</span>
          </div>
          <span className="text-neutral-700 shrink-0">×</span>
          <div className="w-20 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
            <input
              type="number"
              inputMode="numeric"
              placeholder="횟수"
              value={reps || ""}
              onChange={(e) => setReps(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0 text-center"
            />
            <span className="text-neutral-600 text-xs font-mono shrink-0">회</span>
          </div>
        </div>
        {currentValue > 0 && (
          <div className="text-[10px] text-lime-400 font-mono">
            추정 1RM: {currentValue}kg
          </div>
        )}
      </div>

      {/* 4주 목표 */}
      <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-3 mb-5 min-w-0">
        <div className="text-[10px] text-neutral-500 font-bold tracking-widest">
          4주 목표
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-neutral-400 w-16 shrink-0">목표 1RM</span>
          <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={500}
              step={2.5}
              value={effectiveTarget || ""}
              onChange={(e) => setTargetValue(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0"
            />
            <span className="text-neutral-600 text-xs font-mono shrink-0">kg</span>
          </div>
        </div>
        {effectiveTarget > 0 && currentValue > 0 && (
          <div className="text-[10px] text-neutral-500">
            주 +{weeklyDelta.toFixed(1)}kg
          </div>
        )}
        {!targetValid && currentValue > 0 && (
          <div className="text-[10px] text-orange-400">
            목표는 현재보다 높아야 합니다
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={!isValid}
        className="w-full py-3.5 rounded-xl font-bold text-base bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
      >
        설정 완료
      </button>
    </div>
  );
}
