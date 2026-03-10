"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { GoalSetting, StrengthMainMetric } from "@/types/goalSetting";
import { estimate1RM } from "@/utils/estimate1RM";

const STRENGTH_LIFTS: {
  id: "squat" | "bench" | "deadlift";
  label: string;
}[] = [
  { id: "squat", label: "스쿼트 (퍼팩트스쿼트 기준)" },
  { id: "bench", label: "벤치프레스 (체스트프레스 기준)" },
  { id: "deadlift", label: "데드리프트 (랫풀다운/티바로우 기준)" },
];

const MAIN_METRIC_OPTIONS: { id: StrengthMainMetric; label: string }[] = [
  { id: "total", label: "토탈" },
  { id: "squat", label: "스쿼트" },
  { id: "bench", label: "벤치" },
  { id: "deadlift", label: "데드" },
];

function getWeeklyDelta(
  experience: "beginner" | "intermediate" | "advanced",
  isTotal: boolean
): number {
  if (experience === "beginner")
    return isTotal ? 7 : 2.5;
  if (experience === "intermediate")
    return isTotal ? 5 : 1.5;
  return isTotal ? 3 : 1;
}

interface StrengthGoalInputProps {
  profile?: UserProfile | null;
  onConfirm: (goalSetting: GoalSetting) => void;
  onBack: () => void;
}

export default function StrengthGoalInput({
  profile,
  onConfirm,
  onBack,
}: StrengthGoalInputProps) {
  const [squat, setSquat] = useState({ weight: 0, reps: 0 });
  const [bench, setBench] = useState({ weight: 0, reps: 0 });
  const [deadlift, setDeadlift] = useState({ weight: 0, reps: 0 });
  const [mainMetric, setMainMetric] = useState<StrengthMainMetric>("total");
  const [targetValue, setTargetValue] = useState(0);

  const squat1RM = estimate1RM(squat.weight, squat.reps);
  const bench1RM = estimate1RM(bench.weight, bench.reps);
  const deadlift1RM = estimate1RM(deadlift.weight, deadlift.reps);
  const total1RM = squat1RM + bench1RM + deadlift1RM;

  const experience = profile?.experience ?? "beginner";
  const isTotal = mainMetric === "total";
  const weeklyDelta = getWeeklyDelta(experience, isTotal);

  const startValues: Record<string, number> = {
    squat: squat1RM,
    bench: bench1RM,
    deadlift: deadlift1RM,
    total: total1RM,
  };

  const startValue = startValues[mainMetric];
  const defaultTarget = startValue > 0 ? startValue + weeklyDelta * 12 : weeklyDelta * 12;
  const effectiveTarget = targetValue === 0 ? defaultTarget : targetValue;
  const minVal = startValue + weeklyDelta * 4;
  const maxVal =
    startValue > 0
      ? Math.min(startValue * 2, startValue + weeklyDelta * 52)
      : weeklyDelta * 52;
  const clampedTarget = Math.max(minVal, Math.min(maxVal, effectiveTarget));
  const estimatedWeeks = Math.max(
    1,
    Math.ceil((clampedTarget - startValue) / weeklyDelta)
  );
  const actualWeeklyDelta = (clampedTarget - startValue) / estimatedWeeks;

  const isStartEqualsTarget = Math.abs(clampedTarget - startValue) < 0.1;

  const handleConfirm = () => {
    const goalSetting: GoalSetting = {
      goalId: "strength",
      category: "strength",
      mainMetric,
      startValues: { ...startValues },
      target: {
        metric: mainMetric,
        startValue,
        targetValue: clampedTarget,
        weeklyDelta: actualWeeklyDelta,
        estimatedWeeks,
      },
      autoPaces: null,
    };
    onConfirm(goalSetting);
  };

  return (
    <div className="animate-slide-up-quest">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
        >
          ← 뒤로
        </button>
        <h2 className="font-bebas text-xl text-white tracking-wider">
          🏋️ 스트렝스 설정
        </h2>
        <div className="w-12" />
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
          —— 현재 3대 운동 기록 ——
        </div>
        <p className="text-xs text-neutral-500">
          ⓘ 최근에 수행한 중량과 횟수를 입력하면 추정 1RM이 자동 계산됩니다
        </p>
        {STRENGTH_LIFTS.map((lift) => {
          const state =
            lift.id === "squat" ? squat : lift.id === "bench" ? bench : deadlift;
          const setState =
            lift.id === "squat" ? setSquat : lift.id === "bench" ? setBench : setDeadlift;
          const oneRM =
            lift.id === "squat" ? squat1RM : lift.id === "bench" ? bench1RM : deadlift1RM;
          return (
            <div
              key={lift.id}
              className="rounded-xl bg-neutral-900 border border-neutral-800 p-4"
            >
              <div className="text-xs text-neutral-500 mb-2">
                {lift.label} <span className="text-orange-400">*</span>
              </div>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[80px]">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="중량"
                    value={state.weight || ""}
                    onChange={(e) =>
                      setState({
                        ...state,
                        weight: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
                  />
                </div>
                <div className="flex-1 min-w-[80px]">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="회"
                    value={state.reps || ""}
                    onChange={(e) =>
                      setState({
                        ...state,
                        reps: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600 text-center"
                  />
                </div>
                <span className="text-neutral-500 text-sm">kg × 회</span>
                <div className="font-mono text-sm text-lime-400 min-w-24">
                  → 추정 1RM: {oneRM} kg
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">
        —— 토탈 추정 1RM: {total1RM} kg ——
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
          —— 목표 설정 ——
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-2">
            메인 목표 지표 <span className="text-orange-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MAIN_METRIC_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setMainMetric(o.id);
                  const start = startValues[o.id];
                  const def = start + getWeeklyDelta(experience, o.id === "total") * 12;
                  setTargetValue(Math.round(def * 10) / 10);
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  mainMetric === o.id
                    ? "bg-lime-400/5 border-2 border-lime-400 text-white"
                    : "bg-neutral-900 border-2 border-neutral-800 text-neutral-500"
                }`}
              >
                {mainMetric === o.id ? "● " : "○ "}
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            목표 {mainMetric === "total" ? "토탈" : MAIN_METRIC_OPTIONS.find((o) => o.id === mainMetric)?.label} 1RM{" "}
            <span className="text-orange-400">*</span>
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              inputMode="decimal"
              value={clampedTarget}
              onChange={(e) =>
                setTargetValue(Number(e.target.value) || startValue)
              }
              min={minVal}
              max={maxVal}
              className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none"
            />
            <span className="text-neutral-600 font-mono text-sm">kg</span>
          </div>
          <input
            type="range"
            min={minVal}
            max={maxVal}
            step={1}
            value={clampedTarget}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="slider-core w-full"
          />
        </div>
        <p className="text-xs text-neutral-500">
          예상 소요: 약 {estimatedWeeks}주 (주 +{actualWeeklyDelta.toFixed(1)}kg)
        </p>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isStartEqualsTarget}
        className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
      >
        목표 확정
      </button>
    </div>
  );
}
