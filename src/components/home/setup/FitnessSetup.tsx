"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { CategorySetting } from "@/types/categorySettings";
import type { GoalId } from "@/types/goalSetting";

const FITNESS_ACTIVITIES: {
  id: "running" | "rowing" | "skierg";
  label: string;
  short: string;
}[] = [
  { id: "running", label: "런닝 (5km 또는 최근 기록)", short: "런닝" },
  { id: "rowing", label: "로잉 (2km 또는 최근 기록)", short: "로잉" },
  { id: "skierg", label: "스키에르그 (최근 기록)", short: "스키" },
];

const CYCLE_WEEKS = 4;

function calcPace(distanceKm: number, timeMin: number): number | null {
  if (distanceKm <= 0 || timeMin <= 0) return null;
  const totalSeconds = timeMin * 60;
  const paceSeconds = totalSeconds / distanceKm;
  return Math.round((paceSeconds / 60) * 100) / 100;
}

function formatPace(minPerKm: number): string {
  if (minPerKm <= 0) return "-";
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
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
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-xs text-neutral-400 w-16 shrink-0">{label}</span>
      <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
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

function ActivityInput({
  label,
  distance,
  time,
  onDistanceChange,
  onTimeChange,
  pace,
}: {
  label: string;
  distance: number;
  time: number;
  onDistanceChange: (v: number) => void;
  onTimeChange: (v: number) => void;
  pace: number | null;
}) {
  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-xs text-neutral-400 min-w-0">{label}</span>
        {pace && pace > 0 && (
          <span className="text-[10px] font-mono text-lime-400">
            페이스: {formatPace(pace)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
          <input
            type="number"
            inputMode="decimal"
            placeholder="거리"
            value={distance || ""}
            onChange={(e) => onDistanceChange(Number(e.target.value) || 0)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0"
          />
          <span className="text-neutral-600 text-xs font-mono">km</span>
        </div>
        <span className="text-neutral-700 shrink-0">×</span>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2 focus-within:border-lime-400/60 transition-colors">
          <input
            type="number"
            inputMode="decimal"
            placeholder="시간"
            value={time || ""}
            onChange={(e) => onTimeChange(Number(e.target.value) || 0)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none placeholder:text-neutral-700 min-w-0"
          />
          <span className="text-neutral-600 text-xs font-mono">분</span>
        </div>
      </div>
    </div>
  );
}

interface FitnessSetupProps {
  profile?: UserProfile | null;
  primaryGoal: GoalId | null;
  onComplete: (setting: CategorySetting) => void;
  onBack: () => void;
}

export default function FitnessSetup({
  primaryGoal,
  onComplete,
  onBack,
}: FitnessSetupProps) {
  const [running, setRunning] = useState({ distance: 0, time: 0 });
  const [rowing, setRowing] = useState({ distance: 0, time: 0 });
  const [skierg, setSkierg] = useState({ distance: 0, time: 0 });

  const [targetRunPace, setTargetRunPace] = useState(0);
  const [targetRowPace, setTargetRowPace] = useState(0);
  const [targetSkiPace, setTargetSkiPace] = useState(0);

  const runningPace = calcPace(running.distance, running.time);
  const rowingPace = calcPace(rowing.distance, rowing.time);
  const skiergPace = calcPace(skierg.distance, skierg.time);

  const paces = [runningPace, rowingPace, skiergPace].filter(
    (p): p is number => p !== null && p > 0
  );
  const totalPace =
    paces.length > 0
      ? Math.round((paces.reduce((a, b) => a + b, 0) / paces.length) * 100) / 100
      : 0;

  const startValues: Record<string, number> = {
    running: runningPace ?? 0,
    rowing: rowingPace ?? 0,
    skierg: skiergPace ?? 0,
    total: totalPace,
  };

  const defaultTargetFn = (pace: number | null) =>
    pace && pace > 0 ? Math.round(pace * 0.92 * 100) / 100 : 0;

  const effectiveTargetRun = targetRunPace > 0 ? targetRunPace : defaultTargetFn(runningPace);
  const effectiveTargetRow = targetRowPace > 0 ? targetRowPace : defaultTargetFn(rowingPace);
  const effectiveTargetSki = targetSkiPace > 0 ? targetSkiPace : defaultTargetFn(skiergPace);

  const effectiveTargets = [effectiveTargetRun, effectiveTargetRow, effectiveTargetSki].filter(v => v > 0);
  const effectiveTargetAvg =
    effectiveTargets.length > 0
      ? Math.round((effectiveTargets.reduce((a, b) => a + b, 0) / effectiveTargets.length) * 100) / 100
      : 0;

  const hasInput = paces.length > 0;

  const targetValid = totalPace > 0 && effectiveTargetAvg > 0 && effectiveTargetAvg < totalPace;
  const isValid = hasInput && targetValid;

  const startValue = totalPace;
  const effectiveTarget = effectiveTargetAvg;
  const weeklyDelta = startValue > 0 && effectiveTarget > 0
    ? -Math.abs((startValue - effectiveTarget) / CYCLE_WEEKS)
    : -0.1;

  const handleComplete = () => {
    if (!isValid) return;
    const configuredAt = new Date().toISOString().slice(0, 10);
    const endDate = new Date(configuredAt);
    endDate.setDate(endDate.getDate() + 28);
    const setting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: { ...startValues },
      goal: {
        metric: "total",
        startValue,
        targetValue: effectiveTarget,
        weeklyDelta,
        estimatedWeeks: CYCLE_WEEKS,
        totalWeeks: 4,
      },
      autoPaces: null,
      cycleWeeks: 4,
      cycleEndDate: endDate.toISOString().slice(0, 10),
    };
    onComplete(setting);
  };

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
          체력 설정
        </h2>
        <div className="w-12" />
      </div>

      <p className="text-[11px] text-neutral-600 mb-5">
        최근 수행한 거리 × 시간 기준으로 입력하세요.
      </p>

      {/* 현재 수치 */}
      <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-4 mb-4 min-w-0">
        <div className="text-[10px] text-neutral-500 font-bold tracking-widest">현재 수치</div>
        {FITNESS_ACTIVITIES.map((act) => {
          const state = act.id === "running" ? running : act.id === "rowing" ? rowing : skierg;
          const setState = act.id === "running" ? setRunning : act.id === "rowing" ? setRowing : setSkierg;
          const pace = act.id === "running" ? runningPace : act.id === "rowing" ? rowingPace : skiergPace;
          return (
            <ActivityInput
              key={act.id}
              label={act.label}
              distance={state.distance}
              time={state.time}
              onDistanceChange={(v) => setState({ ...state, distance: v })}
              onTimeChange={(v) => setState({ ...state, time: v })}
              pace={pace}
            />
          );
        })}
        {totalPace > 0 && (
          <div className="text-[10px] text-neutral-500 text-right">
            평균 페이스: <span className="font-mono text-white">{formatPace(totalPace)}</span>
          </div>
        )}
      </div>

      {/* 4주 목표 */}
      <div className="rounded-xl bg-neutral-950/60 border border-neutral-800/50 p-4 space-y-3 mb-5 min-w-0">
        <div className="text-[10px] text-neutral-500 font-bold tracking-widest">4주 목표 페이스</div>
        <CompactInput
          label="런닝"
          value={effectiveTargetRun}
          onChange={setTargetRunPace}
          unit="분/km"
          min={1}
          max={15}
          step={0.05}
        />
        <CompactInput
          label="로잉"
          value={effectiveTargetRow}
          onChange={setTargetRowPace}
          unit="분/km"
          min={1}
          max={15}
          step={0.05}
        />
        <CompactInput
          label="스키"
          value={effectiveTargetSki}
          onChange={setTargetSkiPace}
          unit="분/km"
          min={1}
          max={15}
          step={0.05}
        />
        {effectiveTargetAvg > 0 && totalPace > 0 && (
          <div className="text-[10px] text-neutral-500 pl-[76px]">
            목표 평균 <span className="font-mono text-white">{formatPace(effectiveTargetAvg)}</span>
            {" "}(주 {weeklyDelta.toFixed(2)}분/km)
          </div>
        )}
        {!targetValid && totalPace > 0 && (
          <div className="text-[10px] text-orange-400 pl-[76px]">
            목표 페이스는 현재보다 빨라야 합니다 (낮은 값)
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
