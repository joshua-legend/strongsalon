"use client";

import { useState } from "react";
import type { CategorySetting } from "@/types/categorySettings";
import type { CardioChartOption } from "@/utils/goalChartData";

const CARDIO_LABELS: Record<CardioChartOption, string> = {
  run5k: "런닝",
  row2k: "로잉",
  skierg: "스키에르그",
};

const CARDIO_METRIC_KEY: Record<CardioChartOption, string> = {
  run5k: "running",
  row2k: "rowing",
  skierg: "skierg",
};

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

interface FitnessSingleSetupProps {
  metric: CardioChartOption;
  existingSetting?: CategorySetting | null;
  onComplete: (setting: CategorySetting) => void;
  onBack: () => void;
}

export default function FitnessSingleSetup({
  metric,
  existingSetting,
  onComplete,
  onBack,
}: FitnessSingleSetupProps) {
  const metricKey = CARDIO_METRIC_KEY[metric];
  const existingStart = existingSetting?.startValues?.[metricKey] ?? 0;
  const existingPace = existingSetting?.autoPaces?.[metricKey];

  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [targetPace, setTargetPace] = useState(existingPace?.target ?? 0);

  const currentPace = distance > 0 && time > 0
    ? calcPace(distance, time)
    : existingStart;
  const currentValue = currentPace ?? 0;

  const defaultTarget = currentValue > 0 ? Math.round(currentValue * 0.92 * 100) / 100 : 0;
  const effectiveTarget = targetPace > 0 ? targetPace : defaultTarget;

  const hasInput = currentValue > 0;
  const targetValid = currentValue > 0 && effectiveTarget > 0 && effectiveTarget < currentValue;
  const isValid = hasInput && targetValid;

  const weeklyDelta =
    currentValue > 0 && effectiveTarget > 0
      ? -Math.abs((currentValue - effectiveTarget) / CYCLE_WEEKS)
      : -0.1;

  const handleComplete = () => {
    if (!isValid) return;
    const configuredAt =
      existingSetting?.configuredAt ?? new Date().toISOString().slice(0, 10);
    const endDate = new Date(configuredAt);
    endDate.setDate(endDate.getDate() + 28);

    const prevStartValues = existingSetting?.startValues ?? {};
    const prevAutoPaces = existingSetting?.autoPaces ?? {};
    const prevGoal = existingSetting?.goal;

    const newStartValues = { ...prevStartValues, [metricKey]: currentValue };
    const configuredPaces = [newStartValues.running, newStartValues.rowing, newStartValues.skierg].filter(
      (p): p is number => typeof p === "number" && p > 0
    );
    const newTotalPace =
      configuredPaces.length > 0
        ? Math.round((configuredPaces.reduce((a, b) => a + b, 0) / configuredPaces.length) * 100) / 100
        : currentValue;

    const newAutoPaces = {
      ...prevAutoPaces,
      [metricKey]: {
        start: currentValue,
        target: effectiveTarget,
        weeklyDelta,
      },
    };

    const setting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: { ...newStartValues, total: newTotalPace },
      goal: prevGoal ?? {
        metric: "total",
        startValue: currentValue,
        targetValue: effectiveTarget,
        weeklyDelta,
        estimatedWeeks: CYCLE_WEEKS,
        totalWeeks: 4,
      },
      autoPaces: newAutoPaces,
      cycleWeeks: 4,
      cycleEndDate: endDate.toISOString().slice(0, 10),
    };
    onComplete(setting);
  };

  const label = CARDIO_LABELS[metric];

  return (
    <div className="animate-slide-up-quest min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-sm transition-colors hover:opacity-80"
          style={{ color: "var(--text-sub)" }}
        >
          ← 뒤로
        </button>
        <h2 className="font-bebas text-xl tracking-wider" style={{ color: "var(--text-main)" }}>
          {label} 설정
        </h2>
        <div className="w-12" />
      </div>

      <p className="text-[11px] mb-5" style={{ color: "var(--text-sub)" }}>
        최근 수행한 거리 × 시간 기준으로 입력하세요.
      </p>

      {/* 현재 수치 */}
      <div
        className="rounded-xl p-4 space-y-3 mb-4 min-w-0"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text-sub)" }}>
          현재 수치
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex-1 min-w-0 flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors focus-within:border-[var(--border-focus)]"
            style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}
          >
            <input
              type="number"
              inputMode="decimal"
              placeholder="거리"
              value={distance || ""}
              onChange={(e) => setDistance(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm focus:outline-none min-w-0"
              style={{ color: "var(--text-main)" }}
            />
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-sub)" }}>km</span>
          </div>
          <span className="shrink-0" style={{ color: "var(--text-sub)" }}>×</span>
          <div
            className="flex-1 min-w-0 flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors focus-within:border-[var(--border-focus)]"
            style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}
          >
            <input
              type="number"
              inputMode="decimal"
              placeholder="시간"
              value={time || ""}
              onChange={(e) => setTime(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm focus:outline-none min-w-0"
              style={{ color: "var(--text-main)" }}
            />
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-sub)" }}>분</span>
          </div>
        </div>
        {currentValue > 0 && (
          <div className="text-[10px] font-mono" style={{ color: "var(--accent-main)" }}>
            페이스: {formatPace(currentValue)}
          </div>
        )}
      </div>

      {/* 4주 목표 */}
      <div
        className="rounded-xl p-4 space-y-3 mb-5 min-w-0"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text-sub)" }}>
          4주 목표 페이스
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs w-16 shrink-0" style={{ color: "var(--text-sub)" }}>목표</span>
          <div
            className="flex-1 min-w-0 flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors focus-within:border-[var(--border-focus)]"
            style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}
          >
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={15}
              step={0.05}
              placeholder="5.5"
              value={effectiveTarget || ""}
              onChange={(e) => setTargetPace(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm focus:outline-none min-w-0"
              style={{ color: "var(--text-main)" }}
            />
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-sub)" }}>분/km</span>
          </div>
        </div>
        {effectiveTarget > 0 && currentValue > 0 && (
          <div className="text-[10px]" style={{ color: "var(--text-sub)" }}>
            주 {weeklyDelta.toFixed(2)}분/km (빨라짐)
          </div>
        )}
        {!targetValid && currentValue > 0 && (
          <div className="text-[10px] text-orange-500">
            목표 페이스는 현재보다 빨라야 합니다 (낮은 값)
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={!isValid}
        className="w-full py-3.5 rounded-xl font-bold text-base disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
        style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
      >
        설정 완료
      </button>
    </div>
  );
}
