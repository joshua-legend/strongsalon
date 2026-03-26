"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { CategorySetting } from "@/types/categorySettings";
import type { InbodyChartOption } from "@/utils/goalChartData";

const INBODY_LABELS: Record<InbodyChartOption, string> = {
  fatPercent: "체지방률",
  muscleMass: "골격근",
  weight: "체중",
};

const INBODY_UNITS: Record<InbodyChartOption, string> = {
  fatPercent: "%",
  muscleMass: "kg",
  weight: "kg",
};

const CYCLE_WEEKS = 4;

interface InbodySingleSetupProps {
  metric: InbodyChartOption;
  profile?: UserProfile | null;
  existingSetting?: CategorySetting | null;
  onComplete: (setting: CategorySetting) => void;
  onBack: () => void;
}

export default function InbodySingleSetup({
  metric,
  profile,
  existingSetting,
  onComplete,
  onBack,
}: InbodySingleSetupProps) {
  const existingStart = existingSetting?.startValues?.[metric] ?? 0;
  const existingPace = existingSetting?.autoPaces?.[metric];

  const [currentValue, setCurrentValue] = useState(existingStart || (metric === "weight" && profile ? profile.weight : 0));
  const [targetValue, setTargetValue] = useState(existingPace?.target ?? 0);

  const unit = INBODY_UNITS[metric];
  const defaultTarget =
    metric === "fatPercent"
      ? currentValue > 0 ? Math.max(5, Math.round((currentValue - 2) * 10) / 10) : 0
      : metric === "weight"
        ? currentValue > 0 ? Math.max(30, Math.round((currentValue - 2) * 10) / 10) : 0
        : currentValue > 0 ? Math.round((currentValue + 1) * 10) / 10 : 0;

  const effectiveTarget = targetValue > 0 ? targetValue : defaultTarget;

  const hasInput = currentValue > 0;
  const targetValid =
    metric === "fatPercent" || metric === "weight"
      ? currentValue > 0 && effectiveTarget > 0 && effectiveTarget < currentValue
      : currentValue > 0 && effectiveTarget > currentValue;
  const isValid = hasInput && targetValid;

  const weeklyDelta =
    currentValue > 0 && effectiveTarget > 0
      ? (effectiveTarget - currentValue) / CYCLE_WEEKS
      : 0;

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
    const newAutoPaces = {
      ...prevAutoPaces,
      [metric]: {
        start: currentValue,
        target: effectiveTarget,
        weeklyDelta,
      },
    };

    const setting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues: newStartValues,
      goal: prevGoal ?? {
        metric,
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

  const label = INBODY_LABELS[metric];
  const targetHint =
    metric === "fatPercent" || metric === "weight"
      ? "목표는 현재보다 낮아야 합니다"
      : "목표는 현재보다 높아야 합니다";

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
        인바디 용지를 참고하면 정확합니다. 없으면 대략적으로 입력해도 됩니다.
      </p>

      {/* 현재 수치 */}
      <div
        className="rounded-xl p-4 space-y-3 mb-4 min-w-0"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text-sub)" }}>
          현재 수치
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs w-16 shrink-0" style={{ color: "var(--text-sub)" }}>{label}</span>
          <div
            className="flex-1 min-w-0 flex items-center gap-1.5 rounded-lg px-3 py-2 border border-[var(--border-light)] focus-within:border-[var(--border-focus)] transition-colors"
            style={{ backgroundColor: "var(--bg-body)" }}
          >
            <input
              type="number"
              inputMode="decimal"
              min={metric === "fatPercent" ? 5 : 10}
              max={metric === "fatPercent" ? 60 : 200}
              step={metric === "fatPercent" ? 0.1 : 0.1}
              placeholder={metric === "weight" && profile ? String(profile.weight) : "0"}
              value={currentValue || ""}
              onChange={(e) => setCurrentValue(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm focus:outline-none min-w-0"
              style={{ color: "var(--text-main)" }}
            />
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-sub)" }}>{unit}</span>
          </div>
        </div>
      </div>

      {/* 4주 목표 */}
      <div
        className="rounded-xl p-4 space-y-3 mb-5 min-w-0"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text-sub)" }}>
          4주 목표
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs w-16 shrink-0" style={{ color: "var(--text-sub)" }}>목표</span>
          <div
            className="flex-1 min-w-0 flex items-center gap-1.5 rounded-lg px-3 py-2 border border-[var(--border-light)] focus-within:border-[var(--border-focus)] transition-colors"
            style={{ backgroundColor: "var(--bg-body)" }}
          >
            <input
              type="number"
              inputMode="decimal"
              min={metric === "fatPercent" ? 5 : 10}
              max={metric === "fatPercent" ? 60 : 200}
              step={metric === "fatPercent" ? 0.5 : 0.1}
              value={effectiveTarget || ""}
              onChange={(e) => setTargetValue(Number(e.target.value) || 0)}
              className="flex-1 bg-transparent font-mono text-sm focus:outline-none min-w-0"
              style={{ color: "var(--text-main)" }}
            />
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-sub)" }}>{unit}</span>
          </div>
        </div>
        {effectiveTarget > 0 && currentValue > 0 && (
          <div className="text-[10px]" style={{ color: "var(--text-sub)" }}>
            주 {weeklyDelta >= 0 ? "+" : ""}{weeklyDelta.toFixed(2)}{unit}
          </div>
        )}
        {!targetValid && currentValue > 0 && (
          <div className="text-[10px] text-orange-500">{targetHint}</div>
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
