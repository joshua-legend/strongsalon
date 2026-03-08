"use client";

import { useState } from "react";
import type { PurposeOptionWithIcon } from "@/config/purposeOptions";
import type { BodyFormData } from "./BodyInfo";
import type { InbodyGoal, InbodyMetricKey } from "@/types/quest";
import { generateIdealPaces } from "@/utils/inbodyIdealPace";

const INBODY_MAIN_OPTIONS: {
  id: InbodyMetricKey;
  label: string;
  unit: string;
  weeklyDelta: number;
  getStart: (form: BodyFormData) => number;
}[] = [
  {
    id: "weight",
    label: "체중 감량",
    unit: "kg",
    weeklyDelta: -0.5,
    getStart: (f) => f.weight,
  },
  {
    id: "muscleMass",
    label: "골격근량 증가",
    unit: "kg",
    weeklyDelta: 0.3,
    getStart: (f) => f.muscleMass ?? f.weight * 0.4,
  },
  {
    id: "fatPercent",
    label: "체지방률 감소",
    unit: "%",
    weeklyDelta: -0.44,
    getStart: (f) => f.bodyFatPct ?? 25,
  },
];

interface InbodyTargetSetProps {
  purpose: PurposeOptionWithIcon;
  bodyForm: BodyFormData;
  onConfirm: (inbodyGoal: InbodyGoal, startValue: number, targetValue: number) => void;
  onBack: () => void;
}

export default function InbodyTargetSet({
  purpose,
  bodyForm,
  onConfirm,
  onBack,
}: InbodyTargetSetProps) {
  const [mainMetric, setMainMetric] = useState<InbodyMetricKey>("weight");
  const opt = INBODY_MAIN_OPTIONS.find((o) => o.id === mainMetric)!;
  const startValue = opt.getStart(bodyForm);
  const defaultTarget = startValue + opt.weeklyDelta * 8;
  const [targetValue, setTargetValue] = useState(defaultTarget);

  const delta = Math.abs(opt.weeklyDelta);
  const minVal =
    opt.weeklyDelta < 0
      ? Math.max(30, startValue + opt.weeklyDelta * 52)
      : startValue + opt.weeklyDelta * 2;
  const maxVal =
    opt.weeklyDelta < 0
      ? startValue + opt.weeklyDelta * 2
      : Math.min(150, startValue + opt.weeklyDelta * 52);
  const clampedTarget = Math.max(minVal, Math.min(maxVal, targetValue));
  const estimatedWeeks = Math.ceil(
    Math.abs(clampedTarget - startValue) / delta
  ) || 1;

  const currentValues = {
    weight: bodyForm.weight,
    muscleMass: bodyForm.muscleMass ?? bodyForm.weight * 0.4,
    fatPercent: bodyForm.bodyFatPct ?? 25,
  };

  const inbodyGoal = generateIdealPaces(
    mainMetric,
    currentValues,
    clampedTarget,
    opt.weeklyDelta
  );

  const isStartEqualsTarget = Math.abs(clampedTarget - startValue) < 0.01;

  const handleConfirm = () => {
    onConfirm(inbodyGoal, startValue, clampedTarget);
  };

  const otherPaces = (["weight", "muscleMass", "fatPercent"] as const).filter(
    (m) => m !== mainMetric
  );

  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-white tracking-wider mb-6">
        인바디 목표: 가장 중요한 지표를 하나 선택하세요
      </h2>

      <div className="space-y-2 mb-6">
        {INBODY_MAIN_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setMainMetric(o.id);
              const start = o.getStart(bodyForm);
              setTargetValue(start + o.weeklyDelta * 8);
            }}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
              mainMetric === o.id
                ? "bg-lime-400/5 border-lime-400"
                : "bg-neutral-900 border-neutral-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mainMetric === o.id ? "border-lime-400 bg-lime-400" : "border-neutral-600"
              }`}
            >
              {mainMetric === o.id && (
                <span className="text-black text-xs font-bold">●</span>
              )}
            </div>
            <span className="font-bebas text-lg text-white">{o.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="text-xs text-neutral-500 mb-2">현재값</div>
        <div className="font-mono text-xl text-lime-400">
          {startValue}
          {opt.unit}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-xs text-neutral-500 mb-2 flex justify-between">
          <span>목표값</span>
          <span className="font-mono text-lime-400">
            {clampedTarget}
            {opt.unit}
          </span>
        </div>
        <input
          type="range"
          min={minVal}
          max={maxVal}
          step={opt.unit === "%" ? 0.1 : 0.1}
          value={clampedTarget}
          onChange={(e) => setTargetValue(Number(e.target.value))}
          className="slider-core w-full"
        />
        <input
          type="number"
          inputMode="decimal"
          value={clampedTarget}
          onChange={(e) => setTargetValue(Number(e.target.value) || startValue)}
          className="mt-2 w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none"
        />
      </div>
      <div className="text-xs text-neutral-500 mb-4">
        예상: 주 {opt.weeklyDelta > 0 ? "+" : ""}
        {opt.weeklyDelta}
        {opt.unit}, 약 {estimatedWeeks}주
      </div>

      <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-4 mb-4">
        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">
          자동 예상 추이 (나머지 지표)
        </div>
        {otherPaces.map((m) => {
          const p = inbodyGoal.paces[m];
          const unit = m === "fatPercent" ? "%" : "kg";
          const label =
            m === "weight" ? "체중" : m === "muscleMass" ? "골격근량" : "체지방률";
          return (
            <div key={m} className="text-sm text-neutral-300 mb-2 last:mb-0">
              <span className="font-mono text-lime-400">{label}</span>: {p.start}
              {unit} → {p.target}
              {unit}
              <span className="text-neutral-500 text-xs ml-1">
                주 {p.weeklyDelta > 0 ? "+" : ""}
                {p.weeklyDelta}
                {unit}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-500 mb-4 italic">
        ⓘ 예상 추이는 운동 병행 기준 참고치이며 실제 결과와 다를 수 있습니다.
      </p>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isStartEqualsTarget}
        className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all mb-4"
      >
        목표 확정
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
