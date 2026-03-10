"use client";

import { useState } from "react";
import type { GoalSetting, FitnessMainMetric } from "@/types/goalSetting";

const FITNESS_ACTIVITIES: {
  id: "running" | "rowing" | "skierg";
  label: string;
}[] = [
  { id: "running", label: "런닝" },
  { id: "rowing", label: "로잉" },
  { id: "skierg", label: "스키에르그" },
];

const MAIN_METRIC_OPTIONS: { id: FitnessMainMetric; label: string }[] = [
  { id: "total", label: "토탈" },
  { id: "running", label: "런닝" },
  { id: "rowing", label: "로잉" },
  { id: "skierg", label: "스키" },
];

type GoalMode = "pace" | "distance";

/** 거리(km) + 시간(분) → 페이스(분/km). 0이면 null */
function calcPace(distanceKm: number, timeMin: number): number | null {
  if (distanceKm <= 0 || timeMin <= 0) return null;
  const totalSeconds = timeMin * 60;
  const paceSeconds = totalSeconds / distanceKm;
  return Math.round((paceSeconds / 60) * 100) / 100;
}

/** 분/km → "m:ss" 형식 */
function formatPace(minPerKm: number): string {
  if (minPerKm <= 0) return "-";
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
}

/** "m:ss" 파싱 → 분/km (소수) */
function parsePaceDisplay(str: string): number | null {
  const match = str.match(/^(\d+):(\d{2})$/);
  if (!match) return null;
  const m = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  if (s >= 60) return null;
  return m + s / 60;
}

interface FitnessGoalInputProps {
  onConfirm: (goalSetting: GoalSetting) => void;
  onBack: () => void;
}

export default function FitnessGoalInput({
  onConfirm,
  onBack,
}: FitnessGoalInputProps) {
  const [running, setRunning] = useState({ distance: 0, time: 0 });
  const [rowing, setRowing] = useState({ distance: 0, time: 0 });
  const [skierg, setSkierg] = useState({ distance: 0, time: 0 });
  const [mainMetric, setMainMetric] = useState<FitnessMainMetric>("total");
  const [goalMode, setGoalMode] = useState<GoalMode>("pace");
  const [targetPaceStr, setTargetPaceStr] = useState("");
  const [targetPaceRaw, setTargetPaceRaw] = useState(0);
  const [targetDistance, setTargetDistance] = useState(0);

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

  const distances = {
    running: running.distance,
    rowing: rowing.distance,
    skierg: skierg.distance,
  };

  const startValue = startValues[mainMetric];
  const startDistance =
    mainMetric === "total"
      ? running.distance + rowing.distance + skierg.distance
      : distances[mainMetric as keyof typeof distances];

  const isTotal = mainMetric === "total";
  const requiredActivities = isTotal
    ? (["running", "rowing", "skierg"] as const)
    : [mainMetric as "running" | "rowing" | "skierg"];

  const hasRequiredInputs = requiredActivities.every((id) => {
    const s = id === "running" ? running : id === "rowing" ? rowing : skierg;
    return s.distance >= 0.1 && s.distance <= 100 && s.time >= 1 && s.time <= 300;
  });

  let effectiveTarget = 0;
  let minVal = 0;
  let maxVal = 0;
  let estimatedWeeks = 12;
  let weeklyDelta = 0;

  if (goalMode === "pace") {
    const defaultTarget = startValue > 0 ? startValue * 0.85 : 6;
    effectiveTarget = targetPaceRaw > 0 ? targetPaceRaw : defaultTarget;
    minVal = startValue > 0 ? startValue * 0.6 : 1;
    maxVal = startValue > 0 ? startValue * 0.95 : 15;
    const clamped = Math.max(minVal, Math.min(maxVal, effectiveTarget));
    effectiveTarget = clamped;
    weeklyDelta = startValue > 0 ? (startValue - clamped) / 12 : 0.1;
    estimatedWeeks =
      startValue > 0 && clamped < startValue
        ? Math.max(1, Math.ceil((startValue - clamped) / Math.abs(weeklyDelta)))
        : 12;
  } else {
    const defaultTarget = startDistance > 0 ? startDistance * 1.15 : 5;
    effectiveTarget = targetDistance > 0 ? targetDistance : defaultTarget;
    minVal = startDistance > 0 ? startDistance * 1.05 : 0.1;
    maxVal = startDistance > 0 ? startDistance * 2 : 100;
    const clamped = Math.max(minVal, Math.min(maxVal, effectiveTarget));
    effectiveTarget = clamped;
    weeklyDelta = startDistance > 0 ? (clamped - startDistance) / 12 : 0.5;
    estimatedWeeks =
      startDistance > 0 && clamped > startDistance
        ? Math.max(1, Math.ceil((clamped - startDistance) / Math.abs(weeklyDelta)))
        : 12;
  }

  const isStartEqualsTarget =
    (goalMode === "pace" && (startValue <= 0 || Math.abs(effectiveTarget - startValue) < 0.01)) ||
    (goalMode === "distance" &&
      (startDistance <= 0 || Math.abs(effectiveTarget - startDistance) < 0.01));

  const isValid =
    hasRequiredInputs &&
    !isStartEqualsTarget &&
    (goalMode === "pace"
      ? effectiveTarget < startValue
      : effectiveTarget > startDistance);

  const handleConfirm = () => {
    const goalSetting: GoalSetting = {
      goalId: "fitness",
      category: "fitness",
      mainMetric,
      startValues: { ...startValues },
      target: {
        metric: mainMetric,
        startValue: goalMode === "pace" ? startValue : startDistance,
        targetValue: effectiveTarget,
        weeklyDelta: goalMode === "pace" ? -Math.abs(weeklyDelta) : Math.abs(weeklyDelta),
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
          🏃 체력 설정
        </h2>
        <div className="w-12" />
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
          —— 현재 유산소 기록 ——
        </div>
        <p className="text-xs text-neutral-500">
          ⓘ 최근에 수행한 거리와 시간을 입력하면 페이스가 자동 계산됩니다
        </p>
        {FITNESS_ACTIVITIES.map((act) => {
          const state =
            act.id === "running"
              ? running
              : act.id === "rowing"
                ? rowing
                : skierg;
          const setState =
            act.id === "running"
              ? setRunning
              : act.id === "rowing"
                ? setRowing
                : setSkierg;
          const pace =
            act.id === "running"
              ? runningPace
              : act.id === "rowing"
                ? rowingPace
                : skiergPace;
          const isRequired = requiredActivities.includes(act.id);
          return (
            <div
              key={act.id}
              className="rounded-xl bg-neutral-900 border border-neutral-800 p-4"
            >
              <div className="text-xs text-neutral-500 mb-2">
                {act.label} {isRequired && <span className="text-orange-400">*</span>}
              </div>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[80px]">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="거리"
                    value={state.distance || ""}
                    onChange={(e) =>
                      setState({
                        ...state,
                        distance: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
                  />
                </div>
                <span className="text-neutral-500">km</span>
                <div className="flex-1 min-w-[80px]">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="시간"
                    value={state.time || ""}
                    onChange={(e) =>
                      setState({
                        ...state,
                        time: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
                  />
                </div>
                <span className="text-neutral-500">분</span>
                <div className="font-mono text-sm text-lime-400 min-w-24">
                  → 페이스: {formatPace(pace ?? 0)}
                </div>
              </div>
            </div>
          );
        })}
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
                  setTargetPaceRaw(0);
                  setTargetDistance(0);
                  setTargetPaceStr("");
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
          <label className="text-xs text-neutral-500 block mb-2">
            목표 방식 <span className="text-orange-400">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setGoalMode("pace");
                setTargetDistance(0);
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                goalMode === "pace"
                  ? "bg-lime-400/5 border-2 border-lime-400 text-white"
                  : "bg-neutral-900 border-2 border-neutral-800 text-neutral-500"
              }`}
            >
              {goalMode === "pace" ? "● " : "○ "}같은 거리를 더 빠르게
            </button>
            <button
              type="button"
              onClick={() => {
                setGoalMode("distance");
                setTargetPaceRaw(0);
                setTargetPaceStr("");
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                goalMode === "distance"
                  ? "bg-lime-400/5 border-2 border-lime-400 text-white"
                  : "bg-neutral-900 border-2 border-neutral-800 text-neutral-500"
              }`}
            >
              {goalMode === "distance" ? "● " : "○ "}같은 시간에 더 멀리
            </button>
          </div>
        </div>
        {goalMode === "pace" ? (
          <div>
            <label className="text-xs text-neutral-500 block mb-1">
              목표 {MAIN_METRIC_OPTIONS.find((o) => o.id === mainMetric)?.label} 페이스{" "}
              <span className="text-orange-400">*</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="5:30"
                value={
                  targetPaceStr ||
                  (effectiveTarget > 0 ? formatPace(effectiveTarget).replace("/km", "") : "")
                }
                onChange={(e) => {
                  const v = e.target.value;
                  setTargetPaceStr(v);
                  const parsed = parsePaceDisplay(v);
                  if (parsed !== null) setTargetPaceRaw(parsed);
                }}
                className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
              />
              <span className="text-neutral-600 font-mono text-sm">/km</span>
            </div>
            <input
              type="range"
              min={minVal}
              max={maxVal}
              step={5 / 60}
              value={effectiveTarget}
              onChange={(e) => {
                const v = Number(e.target.value);
                setTargetPaceRaw(v);
                setTargetPaceStr(formatPace(v).replace("/km", ""));
              }}
              className="slider-core w-full"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs text-neutral-500 block mb-1">
              목표 거리 <span className="text-orange-400">*</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                inputMode="decimal"
                value={effectiveTarget || ""}
                onChange={(e) => setTargetDistance(Number(e.target.value) || 0)}
                min={minVal}
                max={maxVal}
                step={0.1}
                className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none"
              />
              <span className="text-neutral-600 font-mono text-sm">km</span>
            </div>
            <input
              type="range"
              min={minVal}
              max={maxVal}
              step={0.1}
              value={effectiveTarget}
              onChange={(e) => setTargetDistance(Number(e.target.value))}
              className="slider-core w-full"
            />
          </div>
        )}
        <p className="text-xs text-neutral-500">
          예상 소요: 약 {estimatedWeeks}주
        </p>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!isValid}
        className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
      >
        목표 확정
      </button>
    </div>
  );
}
