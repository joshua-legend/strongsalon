"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { CategorySetting } from "@/types/categorySettings";
import type { GoalId } from "@/types/goalSetting";
import { generateDietAutoPaces } from "@/utils/dietAutoPace";

interface InbodySetupProps {
  profile: UserProfile;
  primaryGoal: GoalId | null;
  onComplete: (setting: CategorySetting) => void;
  onBack: () => void;
}

function CompactInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min: number;
  max: number;
  step: number;
}) {
  const display = value === 0 ? "" : String(value);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 shrink-0" style={{ color: "var(--text-sub)" }}>{label}</span>
      <div
        className="flex-1 flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors focus-within:border-[var(--border-focus)]"
        style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}
      >
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={display}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") { onChange(0); return; }
            const num = Number(raw);
            onChange(isNaN(num) ? 0 : num);
          }}
          className="flex-1 bg-transparent font-mono text-sm focus:outline-none min-w-0"
          style={{ color: "var(--text-main)" }}
        />
        <span className="text-xs font-mono" style={{ color: "var(--text-sub)" }}>{unit}</span>
      </div>
    </div>
  );
}

export default function InbodySetup({
  profile,
  primaryGoal,
  onComplete,
  onBack,
}: InbodySetupProps) {
  const [fatPercent, setFatPercent] = useState(25);
  const [muscleMass, setMuscleMass] = useState(
    Math.round(profile.weight * 0.4 * 10) / 10
  );
  const [targetFatPercent, setTargetFatPercent] = useState(20);
  const [targetMuscleMass, setTargetMuscleMass] = useState(
    Math.round(profile.weight * 0.4 * 10) / 10
  );

  const isPrimary = primaryGoal === "diet";

  const minFatTarget = Math.max(5, fatPercent - 4);
  const maxFatTarget = Math.max(5, fatPercent - 0.5);
  const defaultFatTarget = Math.max(minFatTarget, Math.min(maxFatTarget, fatPercent - 2));
  const effectiveFatTarget =
    targetFatPercent >= minFatTarget && targetFatPercent <= maxFatTarget
      ? targetFatPercent
      : defaultFatTarget;

  const result = generateDietAutoPaces(
    profile.weight,
    fatPercent,
    muscleMass,
    effectiveFatTarget,
    targetMuscleMass
  );

  const baseValid =
    fatPercent >= 5 &&
    fatPercent <= 60 &&
    muscleMass >= 10 &&
    muscleMass <= 80 &&
    targetMuscleMass >= 10 &&
    targetMuscleMass <= 80;
  const goalValid = !isPrimary || effectiveFatTarget < fatPercent;
  const targetFatValid = effectiveFatTarget < fatPercent;
  const isValid = baseValid && goalValid && targetFatValid;

  const handleComplete = () => {
    if (!isValid) return;
    const startValues = {
      weight: profile.weight,
      muscleMass,
      fatPercent,
    };
    const configuredAt = new Date().toISOString().slice(0, 10);
    const endDate = new Date(configuredAt);
    endDate.setDate(endDate.getDate() + 28);
    const setting: CategorySetting = {
      isConfigured: true,
      configuredAt,
      startValues,
      goal: {
        metric: "fatPercent",
        startValue: fatPercent,
        targetValue: effectiveFatTarget,
        weeklyDelta: result.main.weeklyDelta,
        estimatedWeeks: result.main.estimatedWeeks,
        totalWeeks: 4,
      },
      autoPaces: {
        weight: result.auto.weight,
        muscleMass: result.auto.muscleMass,
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
          className="text-sm transition-colors hover:opacity-80"
          style={{ color: "var(--text-sub)" }}
        >
          ← 뒤로
        </button>
        <h2 className="font-bebas text-xl tracking-wider" style={{ color: "var(--text-main)" }}>
          인바디 설정
        </h2>
        <div className="w-12" />
      </div>

      <p className="text-[11px] mb-5" style={{ color: "var(--text-sub)" }}>
        인바디 용지를 참고하면 정확합니다. 없으면 대략적으로 입력해도 됩니다.
      </p>

      {/* 현재 수치 */}
      <div
        className="rounded-xl p-4 space-y-3 mb-4"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text-sub)" }}>현재 수치</div>
        <CompactInput label="체지방률" value={fatPercent} onChange={setFatPercent} unit="%" min={5} max={60} step={0.1} />
        <CompactInput label="골격근량" value={muscleMass} onChange={setMuscleMass} unit="kg" min={10} max={80} step={0.1} />
        <div className="text-[10px] pl-[76px]" style={{ color: "var(--text-sub)" }}>
          체중 {profile.weight}kg (프로필)
        </div>
      </div>

      {/* 목표 수치 */}
      <div
        className="rounded-xl p-4 space-y-3 mb-5"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text-sub)" }}>4주 목표</div>
        <CompactInput label="체지방률" value={targetFatPercent} onChange={setTargetFatPercent} unit="%" min={5} max={60} step={0.5} />
        <CompactInput label="골격근량" value={targetMuscleMass} onChange={setTargetMuscleMass} unit="kg" min={10} max={80} step={0.1} />
        {isPrimary && (
          <div className="text-[10px] pl-[76px]" style={{ color: "var(--text-sub)" }}>
            주당 체지방률 {result.main.weeklyDelta}% · 골격근 {result.auto.muscleMass.weeklyDelta >= 0 ? "+" : ""}{result.auto.muscleMass.weeklyDelta}kg
          </div>
        )}
        {!targetFatValid && fatPercent > 0 && targetFatPercent > 0 && (
          <div className="text-[10px] text-orange-500 pl-[76px]">
            목표 체지방률은 현재보다 낮아야 합니다
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
