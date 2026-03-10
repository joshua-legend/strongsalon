"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { CategorySetting } from "@/types/categorySettings";
import type { GoalId, StrengthMainMetric } from "@/types/goalSetting";
import { estimate1RM } from "@/utils/estimate1RM";

const STRENGTH_LIFTS: {
  id: "squat" | "bench" | "deadlift";
  label: string;
  short: string;
}[] = [
  { id: "squat", label: "스쿼트 (퍼팩트스쿼트)", short: "스쿼트" },
  { id: "bench", label: "벤치프레스 (체스트프레스)", short: "벤치" },
  { id: "deadlift", label: "데드리프트 (랫풀다운/티바로우)", short: "데드" },
];

const CYCLE_WEEKS = 4;

function get4WeekTargetDelta(
  experience: "beginner" | "intermediate" | "advanced",
  isTotal: boolean
): number {
  if (experience === "beginner") return isTotal ? 28 : 10;
  if (experience === "intermediate") return isTotal ? 20 : 6;
  return isTotal ? 12 : 4;
}

function CompactInput({
  label,
  value,
  onChange,
  unit,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  placeholder?: string;
  min: number;
  max: number;
  step: number;
}) {
  const display = value === 0 ? "" : String(value);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-400 w-16 shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={display}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") { onChange(0); return; }
            const num = Number(raw);
            onChange(isNaN(num) ? 0 : num);
          }}
          className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0"
        />
        <span className="text-neutral-600 text-xs font-mono">{unit}</span>
      </div>
    </div>
  );
}

function LiftInput({
  label,
  weight,
  reps,
  onWeightChange,
  onRepsChange,
  oneRM,
}: {
  label: string;
  weight: number;
  reps: number;
  onWeightChange: (v: number) => void;
  onRepsChange: (v: number) => void;
  oneRM: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">{label}</span>
        {oneRM > 0 && (
          <span className="text-[10px] font-mono text-lime-400">
            추정 1RM: {oneRM}kg
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
          <input
            type="number"
            inputMode="decimal"
            placeholder="중량"
            value={weight || ""}
            onChange={(e) => onWeightChange(Number(e.target.value) || 0)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0"
          />
          <span className="text-neutral-600 text-xs font-mono">kg</span>
        </div>
        <span className="text-neutral-700">×</span>
        <div className="w-20 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
          <input
            type="number"
            inputMode="numeric"
            placeholder="횟수"
            value={reps || ""}
            onChange={(e) => onRepsChange(Number(e.target.value) || 0)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0 text-center"
          />
          <span className="text-neutral-600 text-xs font-mono">회</span>
        </div>
      </div>
    </div>
  );
}

interface StrengthSetupProps {
  profile?: UserProfile | null;
  primaryGoal: GoalId | null;
  onComplete: (setting: CategorySetting) => void;
  onBack: () => void;
}

export default function StrengthSetup({
  profile,
  primaryGoal,
  onComplete,
  onBack,
}: StrengthSetupProps) {
  const [squat, setSquat] = useState({ weight: 0, reps: 0 });
  const [bench, setBench] = useState({ weight: 0, reps: 0 });
  const [deadlift, setDeadlift] = useState({ weight: 0, reps: 0 });
  const [targetSquat, setTargetSquat] = useState(0);
  const [targetBench, setTargetBench] = useState(0);
  const [targetDeadlift, setTargetDeadlift] = useState(0);

  const squat1RM = estimate1RM(squat.weight, squat.reps);
  const bench1RM = estimate1RM(bench.weight, bench.reps);
  const deadlift1RM = estimate1RM(deadlift.weight, deadlift.reps);
  const total1RM = squat1RM + bench1RM + deadlift1RM;

  const experience = profile?.experience ?? "beginner";
  const delta = get4WeekTargetDelta(experience, false);
  const totalDelta = get4WeekTargetDelta(experience, true);

  const effectiveTargetSquat = targetSquat > 0 ? targetSquat : (squat1RM > 0 ? squat1RM + delta : 0);
  const effectiveTargetBench = targetBench > 0 ? targetBench : (bench1RM > 0 ? bench1RM + delta : 0);
  const effectiveTargetDeadlift = targetDeadlift > 0 ? targetDeadlift : (deadlift1RM > 0 ? deadlift1RM + delta : 0);
  const effectiveTargetTotal = effectiveTargetSquat + effectiveTargetBench + effectiveTargetDeadlift;

  const startValues: Record<string, number> = {
    squat: squat1RM,
    bench: bench1RM,
    deadlift: deadlift1RM,
    total: total1RM,
  };

  const hasInput = squat1RM > 0 || bench1RM > 0 || deadlift1RM > 0;
  const targetValid = total1RM > 0 && effectiveTargetTotal > total1RM;
  const isValid = hasInput && targetValid;

  const mainMetric: StrengthMainMetric = "total";
  const startValue = total1RM;
  const clampedTarget = effectiveTargetTotal;
  const actualWeeklyDelta = total1RM > 0 ? (clampedTarget - startValue) / CYCLE_WEEKS : totalDelta / CYCLE_WEEKS;

  const handleComplete = () => {
    if (!isValid) return;
    const configuredAt = new Date().toISOString().slice(0, 10);
    const endDate = new Date(configuredAt);
    endDate.setDate(endDate.getDate() + 28);

    const squatDelta = squat1RM > 0 ? (effectiveTargetSquat - squat1RM) / CYCLE_WEEKS : 0;
    const benchDelta = bench1RM > 0 ? (effectiveTargetBench - bench1RM) / CYCLE_WEEKS : 0;
    const deadliftDelta = deadlift1RM > 0 ? (effectiveTargetDeadlift - deadlift1RM) / CYCLE_WEEKS : 0;

    const setting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: { ...startValues },
      goal: {
        metric: mainMetric,
        startValue,
        targetValue: clampedTarget,
        weeklyDelta: actualWeeklyDelta,
        estimatedWeeks: CYCLE_WEEKS,
        totalWeeks: 4,
      },
      autoPaces: {
        squat: { start: squat1RM, target: effectiveTargetSquat, weeklyDelta: squatDelta },
        bench: { start: bench1RM, target: effectiveTargetBench, weeklyDelta: benchDelta },
        deadlift: { start: deadlift1RM, target: effectiveTargetDeadlift, weeklyDelta: deadliftDelta },
      },
      cycleWeeks: 4,
      cycleEndDate: endDate.toISOString().slice(0, 10),
    };
    onComplete(setting);
  };

  return (
    <div className="animate-slide-up-quest">
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-neutral-500 hover:text-white transition-colors text-sm"
        >
          ← 뒤로
        </button>
        <h2 className="font-bebas text-xl text-white tracking-wider">
          스트렝스 설정
        </h2>
        <div className="w-12" />
      </div>

      <p className="text-[11px] text-neutral-600 mb-5">
        최근 수행한 중량 × 횟수 기준으로 입력하세요.
      </p>

      {/* 현재 수치 */}
      <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-4 mb-4">
        <div className="text-[10px] text-neutral-500 font-bold tracking-widest">현재 수치</div>
        {STRENGTH_LIFTS.map((lift) => {
          const state = lift.id === "squat" ? squat : lift.id === "bench" ? bench : deadlift;
          const setState = lift.id === "squat" ? setSquat : lift.id === "bench" ? setBench : setDeadlift;
          const oneRM = lift.id === "squat" ? squat1RM : lift.id === "bench" ? bench1RM : deadlift1RM;
          return (
            <LiftInput
              key={lift.id}
              label={lift.label}
              weight={state.weight}
              reps={state.reps}
              onWeightChange={(v) => setState({ ...state, weight: v })}
              onRepsChange={(v) => setState({ ...state, reps: v })}
              oneRM={oneRM}
            />
          );
        })}
        {total1RM > 0 && (
          <div className="text-[10px] text-neutral-500 text-right">
            토탈 추정 1RM: <span className="font-mono text-white">{total1RM}kg</span>
          </div>
        )}
      </div>

      {/* 4주 목표 */}
      <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-3 mb-5">
        <div className="text-[10px] text-neutral-500 font-bold tracking-widest">4주 목표</div>
        <CompactInput
          label="스쿼트"
          value={effectiveTargetSquat}
          onChange={setTargetSquat}
          unit="kg"
          min={0}
          max={500}
          step={2.5}
        />
        <CompactInput
          label="벤치"
          value={effectiveTargetBench}
          onChange={setTargetBench}
          unit="kg"
          min={0}
          max={300}
          step={2.5}
        />
        <CompactInput
          label="데드"
          value={effectiveTargetDeadlift}
          onChange={setTargetDeadlift}
          unit="kg"
          min={0}
          max={500}
          step={2.5}
        />
        {effectiveTargetTotal > 0 && total1RM > 0 && (
          <div className="text-[10px] text-neutral-500 pl-[76px]">
            목표 토탈 <span className="font-mono text-white">{effectiveTargetTotal}kg</span>
            {" "}(주 +{actualWeeklyDelta.toFixed(1)}kg)
          </div>
        )}
        {!targetValid && total1RM > 0 && (
          <div className="text-[10px] text-orange-400 pl-[76px]">
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
