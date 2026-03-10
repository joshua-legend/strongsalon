"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/profile";
import type { GoalSetting } from "@/types/goalSetting";
import { generateDietAutoPaces } from "@/utils/dietAutoPace";
import { InputRow } from "./BodyInfoInputRow";

interface DietGoalInputProps {
  profile: UserProfile;
  onConfirm: (goalSetting: GoalSetting) => void;
  onBack: () => void;
}

export default function DietGoalInput({
  profile,
  onConfirm,
  onBack,
}: DietGoalInputProps) {
  const [fatPercent, setFatPercent] = useState(25);
  const [muscleMass, setMuscleMass] = useState(
    Math.round(profile.weight * 0.4 * 10) / 10
  );
  const [targetFatPercent, setTargetFatPercent] = useState(20);

  const minTarget = Math.max(5, fatPercent - 15);
  const maxTarget = Math.max(5, fatPercent - 1);
  const defaultTarget = Math.max(minTarget, Math.min(maxTarget, fatPercent - 5));
  const effectiveTarget =
    targetFatPercent >= minTarget && targetFatPercent <= maxTarget
      ? targetFatPercent
      : defaultTarget;

  const result = generateDietAutoPaces(
    profile.weight,
    fatPercent,
    muscleMass,
    effectiveTarget
  );

  const isValid =
    fatPercent >= 5 &&
    fatPercent <= 60 &&
    muscleMass >= 10 &&
    muscleMass <= 80 &&
    effectiveTarget < fatPercent;

  const handleConfirm = () => {
    if (!isValid) return;
    const goalSetting: GoalSetting = {
      goalId: "diet",
      category: "inbody",
      mainMetric: "fatPercent",
      startValues: {
        weight: profile.weight,
        muscleMass,
        fatPercent,
      },
      target: {
        metric: "fatPercent",
        startValue: fatPercent,
        targetValue: effectiveTarget,
        weeklyDelta: result.main.weeklyDelta,
        estimatedWeeks: result.main.estimatedWeeks,
      },
      autoPaces: {
        weight: result.auto.weight,
        muscleMass: result.auto.muscleMass,
      },
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
          ⚖️ 살 빼기 설정
        </h2>
        <div className="w-12" />
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
          —— 현재 인바디 수치 ——
        </div>
        <InputRow
          label="현재 체지방률"
          value={fatPercent}
          onChangeVal={setFatPercent}
          unit="%"
          min={5}
          max={60}
          step={0.1}
          isRequired
        />
        <InputRow
          label="현재 골격근량"
          value={muscleMass}
          onChangeVal={setMuscleMass}
          unit="kg"
          min={10}
          max={80}
          step={0.1}
          isRequired
        />
        <p className="text-xs text-neutral-500 italic">
          ⓘ 인바디 용지를 참고하면 정확합니다. 없으면 대략적으로 입력해도 됩니다.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
          —— 목표 설정 ——
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            목표 체지방률 <span className="text-orange-400">*</span>
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              inputMode="decimal"
              value={effectiveTarget}
              onChange={(e) =>
                setTargetFatPercent(Number(e.target.value) || fatPercent - 5)
              }
              min={minTarget}
              max={maxTarget}
              step={0.5}
              className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none"
            />
            <span className="text-neutral-600 font-mono text-sm">%</span>
          </div>
          <input
            type="range"
            min={minTarget}
            max={maxTarget}
            step={0.5}
            value={effectiveTarget}
            onChange={(e) => setTargetFatPercent(Number(e.target.value))}
            className="slider-core w-full"
          />
        </div>
        <p className="text-xs text-neutral-500">
          예상 소요: 약 {result.main.estimatedWeeks}주 (주 {result.main.weeklyDelta}%)
        </p>
      </div>

      <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-4 mb-4">
        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-3">
          —— 자동 예상 추이 (참고) ——
        </div>
        <div className="space-y-2 text-sm text-neutral-300">
          <div>
            <span className="font-mono text-lime-400">체중</span>:{" "}
            {result.auto.weight.start} → {result.auto.weight.target} kg
            <span className="text-neutral-500 text-xs ml-1">
              주 {result.auto.weight.weeklyDelta}kg
            </span>
          </div>
          <div>
            <span className="font-mono text-lime-400">골격근량</span>:{" "}
            {result.auto.muscleMass.start} → {result.auto.muscleMass.target} kg
            <span className="text-neutral-500 text-xs ml-1">
              주 +{result.auto.muscleMass.weeklyDelta}kg (유지)
            </span>
          </div>
        </div>
        <p className="text-[10px] text-neutral-500 mt-3 italic">
          ⓘ 예상 추이는 운동 병행 기준 참고치이며 실제와 다를 수 있습니다
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
