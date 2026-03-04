"use client";

import type { PurposeOptionWithIcon } from "@/config/purposeOptions";
import type { BodyFormData } from "./BodyInfo";

interface TargetSetProps {
  purpose: PurposeOptionWithIcon;
  bodyForm: BodyFormData;
  targetValue: number;
  onTargetChange: (v: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

function getStartValue(purpose: PurposeOptionWithIcon, form: BodyFormData): number {
  switch (purpose.metricKey) {
    case "weight":
      return form.weight;
    case "muscleMass":
      return form.muscleMass ?? form.weight * 0.4;
    case "liftMax":
      return form.liftMax ?? 100;
    case "cardioTime":
      return form.cardioTime ?? 10;
    default:
      return form.weight;
  }
}

export default function TargetSet({
  purpose,
  bodyForm,
  targetValue,
  onTargetChange,
  onConfirm,
  onBack,
}: TargetSetProps) {
  const startValue = getStartValue(purpose, bodyForm);
  const { weeklyDelta } = purpose;
  const delta = Math.abs(weeklyDelta);

  const minVal =
    weeklyDelta < 0
      ? startValue + weeklyDelta * 52
      : startValue + weeklyDelta * 2;
  const maxVal =
    weeklyDelta < 0
      ? startValue + weeklyDelta * 2
      : startValue + weeklyDelta * 52;
  const defaultVal = startValue + weeklyDelta * 8;
  const clampedTarget = Math.max(minVal, Math.min(maxVal, targetValue || defaultVal));

  const estimatedWeeks = Math.ceil(
    Math.abs(clampedTarget - startValue) / delta
  );
  const isStartEqualsTarget = Math.abs(clampedTarget - startValue) < 0.01;

  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-white tracking-wider mb-6">
        시작점과 최종 목표
      </h2>
      <div className="mb-6">
        <div className="text-xs text-neutral-500 mb-2">시작점 (자동)</div>
        <div className="font-mono text-2xl text-lime-400">
          {startValue}
          {purpose.unit}
        </div>
      </div>
      <div className="mb-6">
        <div className="text-xs text-neutral-500 mb-2 flex justify-between">
          <span>최종 목표</span>
          <span className="font-mono text-lime-400">
            {clampedTarget}
            {purpose.unit}
          </span>
        </div>
        <input
          type="range"
          min={minVal}
          max={maxVal}
          step={delta >= 1 ? 1 : 0.1}
          value={clampedTarget}
          onChange={(e) => onTargetChange(Number(e.target.value))}
          className="slider-core w-full"
        />
        <input
          type="number"
          inputMode="decimal"
          value={clampedTarget}
          onChange={(e) => onTargetChange(Number(e.target.value) || startValue)}
          className="mt-2 w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none"
        />
      </div>
      <div className="text-xs text-neutral-500 mb-8">
        예상 소요: 약 {estimatedWeeks}주
      </div>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isStartEqualsTarget}
        className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all mb-4"
      >
        목표 확정하기
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full py-2 text-neutral-500 hover:text-white transition-colors"
      >
        이전
      </button>
    </div>
  );
}
