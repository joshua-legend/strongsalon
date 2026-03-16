"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useGoal } from "@/context/GoalContext";
import { useProfile } from "@/context/ProfileContext";
import { useInbody } from "@/context/InbodyContext";
import { useChartData } from "@/context/ChartDataContext";
import type { ChartMetricKey } from "@/types/chartData";
import type { CategorySetting } from "@/types/categorySettings";
import { estimate1RM } from "@/utils/estimate1RM";
import type { Experience } from "@/types/profile";

const CYCLE_WEEKS = 4;

function get4WeekTargetDelta(
  experience: Experience,
  isTotal: boolean
): number {
  if (experience === "beginner") return isTotal ? 28 : 10;
  if (experience === "intermediate") return isTotal ? 20 : 6;
  return isTotal ? 12 : 4;
}

function roundVal(v: number): number {
  return Math.round(v);
}

function CompactInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min: number;
  max: number;
  step?: number;
}) {
  const display = value === 0 ? "" : String(value);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={display}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange(0);
              return;
            }
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
            추정 1RM: {roundVal(oneRM)}kg
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

function ActivityInput({
  label,
  time,
  onTimeChange,
  pace,
}: {
  label: string;
  time: number;
  onTimeChange: (v: number) => void;
  pace: number | null;
}) {
  const formatPace = (minPerKm: number) => {
    if (minPerKm <= 0) return "-";
    const m = Math.floor(minPerKm);
    const s = roundVal((minPerKm - m) * 60);
    return `${m}:${s.toString().padStart(2, "0")}/km`;
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">{label}</span>
        {pace != null && pace > 0 && (
          <span className="text-[10px] font-mono text-lime-400">
            페이스: {formatPace(pace)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-neutral-500 text-sm shrink-0">2 km ×</span>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
          <input
            type="number"
            inputMode="decimal"
            placeholder="시간"
            value={time || ""}
            onChange={(e) => onTimeChange(Number(e.target.value) || 0)}
            className="flex-1 min-w-0 w-0 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700"
          />
          <span className="text-neutral-600 text-xs font-mono shrink-0">분</span>
        </div>
      </div>
    </div>
  );
}

function calcPace(distanceKm: number, timeMin: number): number | null {
  if (distanceKm <= 0 || timeMin <= 0) return null;
  const totalSeconds = timeMin * 60;
  const paceMinPerKm = totalSeconds / 60 / distanceKm;
  return roundVal(paceMinPerKm);
}

interface RecommendationSetupSheetProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function RecommendationSetupSheet({
  open,
  onClose,
  onComplete,
}: RecommendationSetupSheetProps) {
  const { setCategorySetting } = useGoal();
  const { profile } = useProfile();
  const experience = profile?.experience ?? "beginner";
  const { addInbodyRecord } = useInbody();
  const { addStartPoint } = useChartData();

  const defaultWeight = profile?.weight ?? 70;

  const [weight, setWeight] = useState(defaultWeight);
  const [fatPercent, setFatPercent] = useState(0);
  const [muscleMass, setMuscleMass] = useState(0);

  const [squat, setSquat] = useState({ weight: 0, reps: 0 });
  const [bench, setBench] = useState({ weight: 0, reps: 0 });
  const [deadlift, setDeadlift] = useState({ weight: 0, reps: 0 });

  const [running, setRunning] = useState({ distance: 2, time: 0 });
  const [rowing, setRowing] = useState({ distance: 2, time: 0 });
  const [skierg, setSkierg] = useState({ distance: 2, time: 0 });

  const squat1RM = roundVal(estimate1RM(squat.weight, squat.reps));
  const bench1RM = roundVal(estimate1RM(bench.weight, bench.reps));
  const deadlift1RM = roundVal(estimate1RM(deadlift.weight, deadlift.reps));
  const total1RM = squat1RM + bench1RM + deadlift1RM;

  const runningPace = calcPace(2, running.time);
  const rowingPace = calcPace(2, rowing.time);
  const skiergPace = calcPace(2, skierg.time);

  const inbodyValid =
    weight > 0 &&
    fatPercent >= 5 &&
    fatPercent <= 60 &&
    muscleMass >= 10 &&
    muscleMass <= 80;

  const strengthValid = squat1RM > 0 && bench1RM > 0 && deadlift1RM > 0;

  const fitnessPaces = [runningPace, rowingPace, skiergPace].filter(
    (p): p is number => p !== null && p > 0
  );
  const fitnessValid = fitnessPaces.length >= 1;
  const totalPace =
    fitnessPaces.length > 0
      ? roundVal(fitnessPaces.reduce((a, b) => a + b, 0) / fitnessPaces.length)
      : 0;

  const allValid = inbodyValid && strengthValid && fitnessValid;

  const handleComplete = () => {
    if (!allValid) return;

    const configuredAt = new Date().toISOString().slice(0, 10);

    const inbodySetting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: {
        weight: roundVal(weight),
        fatPercent: roundVal(fatPercent),
        muscleMass: roundVal(muscleMass),
      },
      goal: null,
      autoPaces: null,
    };
    setCategorySetting("inbody", inbodySetting);
    addStartPoint("inbody.weight", roundVal(weight), configuredAt);
    addStartPoint("inbody.fatPercent", roundVal(fatPercent), configuredAt);
    addStartPoint("inbody.muscleMass", roundVal(muscleMass), configuredAt);

    const fatMass = roundVal(weight * (fatPercent / 100) * 10) / 10;
    addInbodyRecord(
      {
        date: configuredAt,
        weight: roundVal(weight),
        muscleMass: roundVal(muscleMass),
        fatMass,
        fatPercent: roundVal(fatPercent),
      },
      configuredAt
    );

    const delta = get4WeekTargetDelta(experience, false);
    const totalDelta = get4WeekTargetDelta(experience, true);
    const effectiveTargetSquat = squat1RM > 0 ? squat1RM + delta : 0;
    const effectiveTargetBench = bench1RM > 0 ? bench1RM + delta : 0;
    const effectiveTargetDeadlift = deadlift1RM > 0 ? deadlift1RM + delta : 0;
    const effectiveTargetTotal = effectiveTargetSquat + effectiveTargetBench + effectiveTargetDeadlift;
    const actualWeeklyDelta = total1RM > 0 ? (effectiveTargetTotal - total1RM) / CYCLE_WEEKS : totalDelta / CYCLE_WEEKS;
    const squatDelta = squat1RM > 0 ? (effectiveTargetSquat - squat1RM) / CYCLE_WEEKS : 0;
    const benchDelta = bench1RM > 0 ? (effectiveTargetBench - bench1RM) / CYCLE_WEEKS : 0;
    const deadliftDelta = deadlift1RM > 0 ? (effectiveTargetDeadlift - deadlift1RM) / CYCLE_WEEKS : 0;

    const endDate = new Date(configuredAt);
    endDate.setDate(endDate.getDate() + 28);

    const strengthSetting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: {
        squat: squat1RM,
        bench: bench1RM,
        deadlift: deadlift1RM,
        total: total1RM,
      },
      goal: {
        metric: "total",
        startValue: total1RM,
        targetValue: effectiveTargetTotal,
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
    setCategorySetting("strength", strengthSetting);
    addStartPoint("strength.squat" as ChartMetricKey, squat1RM, configuredAt);
    addStartPoint("strength.bench" as ChartMetricKey, bench1RM, configuredAt);
    addStartPoint("strength.deadlift" as ChartMetricKey, deadlift1RM, configuredAt);
    addStartPoint("strength.total" as ChartMetricKey, total1RM, configuredAt);

    const fitnessStartValues: Record<string, number> = {
      running: runningPace ?? 0,
      rowing: rowingPace ?? 0,
      skierg: skiergPace ?? 0,
      total: totalPace,
    };
    const fitnessSetting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: fitnessStartValues,
      goal: null,
      autoPaces: null,
    };
    setCategorySetting("fitness", fitnessSetting);
    if ((runningPace ?? 0) > 0)
      addStartPoint("fitness.running" as ChartMetricKey, runningPace!, configuredAt);
    if ((rowingPace ?? 0) > 0)
      addStartPoint("fitness.rowing" as ChartMetricKey, rowingPace!, configuredAt);
    if ((skiergPace ?? 0) > 0)
      addStartPoint("fitness.skierg" as ChartMetricKey, skiergPace!, configuredAt);
    if (totalPace > 0)
      addStartPoint("fitness.total" as ChartMetricKey, totalPace, configuredAt);

    window.dispatchEvent(new Event("chartRefresh"));
    onComplete?.();
    onClose();
  };

  if (!open) return null;

  const sheet = (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative z-[10000] w-full max-w-[min(100vw,28rem)] min-w-0 rounded-t-2xl bg-[var(--bg-body)] border border-[var(--border-light)] p-5 pb-8 max-h-[85vh] overflow-y-auto overflow-x-hidden box-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors text-sm"
          >
            ← 닫기
          </button>
          <h2 className="font-bebas text-xl text-white tracking-wider">
            추천을 위한 데이터 설정
          </h2>
          <div className="w-12" />
        </div>

        <p className="text-[11px] text-neutral-600 mb-5">
          인바디·스트렝스·체력 수치를 모두 입력해 주세요. 모든 항목이 채워져야 설정 완료할 수 있습니다.
        </p>

        {/* 인바디 */}
        <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-3 mb-4">
          <div className="text-[10px] text-neutral-500 font-bold tracking-widest">
            인바디 {!inbodyValid && <span className="text-amber-400">(필수)</span>}
          </div>
          <CompactInput
            label="체중"
            value={weight}
            onChange={setWeight}
            unit="kg"
            min={30}
            max={200}
          />
          <CompactInput
            label="체지방률"
            value={fatPercent}
            onChange={setFatPercent}
            unit="%"
            min={5}
            max={60}
          />
          <CompactInput
            label="골격근량"
            value={muscleMass}
            onChange={setMuscleMass}
            unit="kg"
            min={10}
            max={80}
          />
        </div>

        {/* 스트렝스 */}
        <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-4 mb-4">
          <div className="text-[10px] text-neutral-500 font-bold tracking-widest">
            스트렝스 (3대) {!strengthValid && <span className="text-amber-400">(필수)</span>}
          </div>
          <p className="text-[10px] text-neutral-600">
            최근 수행한 중량 × 횟수로 입력 (추정 1RM 자동 계산)
          </p>
          <LiftInput
            label="스쿼트"
            weight={squat.weight}
            reps={squat.reps}
            onWeightChange={(v) => setSquat((s) => ({ ...s, weight: v }))}
            onRepsChange={(v) => setSquat((s) => ({ ...s, reps: v }))}
            oneRM={squat1RM}
          />
          <LiftInput
            label="벤치프레스"
            weight={bench.weight}
            reps={bench.reps}
            onWeightChange={(v) => setBench((s) => ({ ...s, weight: v }))}
            onRepsChange={(v) => setBench((s) => ({ ...s, reps: v }))}
            oneRM={bench1RM}
          />
          <LiftInput
            label="데드리프트"
            weight={deadlift.weight}
            reps={deadlift.reps}
            onWeightChange={(v) => setDeadlift((s) => ({ ...s, weight: v }))}
            onRepsChange={(v) => setDeadlift((s) => ({ ...s, reps: v }))}
            oneRM={deadlift1RM}
          />
          {total1RM > 0 && (
            <div className="text-[10px] text-neutral-500 text-right">
              토탈 추정 1RM: <span className="font-mono text-white">{total1RM}kg</span>
            </div>
          )}
        </div>

        {/* 체력 */}
        <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-4 mb-5">
          <div className="text-[10px] text-neutral-500 font-bold tracking-widest">
            체력 {!fitnessValid && <span className="text-amber-400">(1종목 이상 필수)</span>}
          </div>
          <p className="text-[10px] text-neutral-600">
            2km 기준 시간(분)으로 입력 (페이스 자동 계산)
          </p>
          <ActivityInput
            label="런닝"
            time={running.time}
            onTimeChange={(v) => setRunning((s) => ({ ...s, time: v }))}
            pace={runningPace}
          />
          <ActivityInput
            label="로잉"
            time={rowing.time}
            onTimeChange={(v) => setRowing((s) => ({ ...s, time: v }))}
            pace={rowingPace}
          />
          <ActivityInput
            label="스키에르그"
            time={skierg.time}
            onTimeChange={(v) => setSkierg((s) => ({ ...s, time: v }))}
            pace={skiergPace}
          />
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={!allValid}
          className="w-full py-3.5 rounded-xl font-bold text-base bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
        >
          설정 완료
        </button>
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
