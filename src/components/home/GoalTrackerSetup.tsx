"use client";

import { Target, Sliders } from "lucide-react";
import type { GoalPurpose, GoalInputs, GoalDuration } from "@/types";
import {
  PURPOSE_CONFIG,
  DURATION_OPTIONS,
  canProceedFromStep2,
} from "./goalTrackerUtils";

interface GoalTrackerSetupProps {
  step: 0 | 1 | 2 | 3;
  purpose: GoalPurpose | null;
  inputs: Partial<GoalInputs>;
  duration: GoalDuration | null;
  onStepChange: (step: 0 | 1 | 2 | 3) => void;
  onPurposeSelect: (p: GoalPurpose) => void;
  onInputsChange: (inputs: Partial<GoalInputs>) => void;
  onDurationSelect: (d: GoalDuration) => void;
  onConfirm: () => void;
}

export default function GoalTrackerSetup({
  step,
  purpose,
  inputs,
  duration,
  onStepChange,
  onPurposeSelect,
  onInputsChange,
  onDurationSelect,
  onConfirm,
}: GoalTrackerSetupProps) {
  return (
    <div className="bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-2xl p-6 shadow-lg relative overflow-hidden hover:border-orange-500/30 transition-colors">
      <div className="min-h-[200px] flex flex-col">
        {step === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-4 animate-slide-in-from-bottom">
            <Target className="w-12 h-12 mb-4 text-white group-hover:text-orange-500 transition-all duration-300" />
            <h3 className="text-2xl font-bebas tracking-wider mb-1 text-white">
              목표 설정하기
            </h3>
            <p className="text-xs font-sans mb-6 text-neutral-400">
              목적을 선택하고 수치를 입력해 프로토콜을 시작하세요.
            </p>
            <button
              onClick={() => onStepChange(1)}
              className="relative inline-block px-6 py-3 font-bold text-sm uppercase italic -skew-x-12 text-black transition-all hover:brightness-110 active:scale-[0.98] bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.55)]"
            >
              <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none" />
              <span className="skew-x-12 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> 목표 설정 시작하기
              </span>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-slide-in-from-bottom">
            <h3 className="text-lg font-bebas text-white mb-4">목적 선택</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PURPOSE_CONFIG) as GoalPurpose[]).map((p) => {
                const cfg = PURPOSE_CONFIG[p];
                return (
                  <button
                    key={p}
                    onClick={() => onPurposeSelect(p)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-neutral-800 bg-neutral-950 transition-all ${cfg.borderHover}`}
                  >
                    <cfg.Icon className={`w-8 h-8 ${cfg.color}`} />
                    <span className="font-bebas text-sm text-white">
                      {cfg.wildLabel}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onStepChange(0)}
              className="mt-4 text-xs text-neutral-500 hover:text-neutral-300"
            >
              ← 이전
            </button>
          </div>
        )}

        {step === 2 && purpose && (
          <div className="animate-slide-in-from-bottom">
            <h3 className="text-lg font-bebas text-white mb-4">
              현재 수치 & 목표 수치
            </h3>

            {purpose === "다이어트" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 mb-1 flex items-center justify-between">
                    <span>현재 체중</span>
                    <span className="font-bebas text-orange-500">{(inputs as { current?: number }).current ?? 70} kg</span>
                  </label>
                  <input
                    type="range" min={40} max={150}
                    value={(inputs as { current?: number }).current ?? 70}
                    onChange={(e) =>
                      onInputsChange({
                        ...inputs,
                        purpose: "다이어트",
                        current: Number(e.target.value),
                        target: (inputs as { target?: number }).target ?? 65,
                        unit: "kg",
                      })
                    }
                    className="setup-slider w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 mb-1 flex items-center justify-between">
                    <span>목표 체중</span>
                    <span className="font-bebas text-orange-500">{(inputs as { target?: number }).target ?? 65} kg</span>
                  </label>
                  <input
                    type="range" min={40} max={150}
                    value={(inputs as { target?: number }).target ?? 65}
                    onChange={(e) =>
                      onInputsChange({
                        ...inputs,
                        purpose: "다이어트",
                        current: (inputs as { current?: number }).current ?? 70,
                        target: Number(e.target.value),
                        unit: "kg",
                      })
                    }
                    className="setup-slider w-full"
                  />
                </div>
              </div>
            )}

            {purpose === "벌크업" && (
              <div className="space-y-4">
                {(
                  [
                    ["weightCurrent", "현재 체중", 70],
                    ["weightTarget", "목표 체중", 75],
                    ["muscleCurrent", "현재 근육량", 30],
                    ["muscleTarget", "목표 근육량", 35],
                  ] as const
                ).map(([key, label, def]) => {
                  const inp = inputs as Record<string, number>;
                  const val = inp[key] ?? def;
                  return (
                    <div key={key}>
                      <label className="text-xs text-neutral-500 mb-1 flex items-center justify-between">
                        <span>{label}</span>
                        <span className="font-bebas text-orange-500">{val} kg</span>
                      </label>
                      <input
                        type="range"
                        min={key.includes("muscle") ? 20 : 40}
                        max={key.includes("muscle") ? 60 : 120}
                        value={val}
                        onChange={(e) => {
                          const p = inputs as Record<string, number>;
                          const v = Number(e.target.value);
                          onInputsChange({
                            purpose: "벌크업" as const,
                            weightCurrent: key === "weightCurrent" ? v : (p.weightCurrent ?? 70),
                            weightTarget: key === "weightTarget" ? v : (p.weightTarget ?? 75),
                            muscleCurrent: key === "muscleCurrent" ? v : (p.muscleCurrent ?? 30),
                            muscleTarget: key === "muscleTarget" ? v : (p.muscleTarget ?? 35),
                          });
                        }}
                        className="setup-slider w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {purpose === "스트렝스" && (
              <div className="space-y-4">
                {[
                  ["squat", "targetSquat", "스쿼트"],
                  ["bench", "targetBench", "벤치"],
                  ["deadlift", "targetDeadlift", "데드리프트"],
                ].map(([cur, tgt, label]) => {
                  const curVal = (inputs as Record<string, number>)[cur] ?? 100;
                  const tgtVal = (inputs as Record<string, number>)[tgt] ?? 120;
                  return (
                    <div key={cur} className="space-y-2">
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 현재</span>
                        <span className="font-bebas text-orange-500">{curVal} kg</span>
                      </label>
                      <input
                        type="range" min={0} max={300} value={curVal}
                        onChange={(e) =>
                          onInputsChange({ ...inputs, purpose: "스트렝스", ...(inputs as object), [cur]: Number(e.target.value) })
                        }
                        className="setup-slider w-full"
                      />
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 목표</span>
                        <span className="font-bebas text-orange-500">{tgtVal} kg</span>
                      </label>
                      <input
                        type="range" min={0} max={300} value={tgtVal}
                        onChange={(e) =>
                          onInputsChange({ ...inputs, purpose: "스트렝스", ...(inputs as object), [tgt]: Number(e.target.value) })
                        }
                        className="setup-slider w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {purpose === "바디프로필" && (
              <div className="space-y-4">
                {[
                  ["fatPctCurrent", "fatPctTarget", "체지방률", 10, 40, "%"],
                  ["weightCurrent", "weightTarget", "체중", 40, 120, "kg"],
                ].map(([cur, tgt, label, min, max, unit]) => {
                  const curVal = (inputs as Record<string, number>)[cur] ?? (label === "체지방률" ? 25 : 70);
                  const tgtVal = (inputs as Record<string, number>)[tgt] ?? (label === "체지방률" ? 18 : 65);
                  return (
                    <div key={cur} className="space-y-2">
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 현재</span>
                        <span className="font-bebas text-orange-500">{curVal}{unit}</span>
                      </label>
                      <input
                        type="range" min={min} max={max} value={curVal}
                        onChange={(e) =>
                          onInputsChange({ ...inputs, purpose: "바디프로필", ...(inputs as object), [cur]: Number(e.target.value) })
                        }
                        className="setup-slider w-full"
                      />
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 목표</span>
                        <span className="font-bebas text-orange-500">{tgtVal}{unit}</span>
                      </label>
                      <input
                        type="range" min={min} max={max} value={tgtVal}
                        onChange={(e) =>
                          onInputsChange({ ...inputs, purpose: "바디프로필", ...(inputs as object), [tgt]: Number(e.target.value) })
                        }
                        className="setup-slider w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => onStepChange(1)}
                className="text-xs text-neutral-500 hover:text-neutral-300"
              >
                ← 이전
              </button>
              <button
                onClick={() => onStepChange(3)}
                disabled={!canProceedFromStep2(purpose, inputs)}
                className="ml-auto px-4 py-2 bg-orange-500 text-black font-bold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {step === 3 && purpose && (
          <div className="animate-slide-in-from-bottom">
            <h3 className="text-lg font-bebas text-white mb-4">기간 설정</h3>
            <div className="flex gap-2 mb-6">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => onDurationSelect(d)}
                  className={`flex-1 py-3 rounded-xl border-2 font-bebas text-sm transition-all ${
                    duration === d
                      ? "border-orange-500 bg-orange-500/10 text-orange-500"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  {d}주
                </button>
              ))}
            </div>

            <button
              onClick={onConfirm}
              disabled={!duration}
              className="w-full py-3 bg-orange-500 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              <Target className="w-4 h-4" /> 목표 확정
            </button>

            <button
              onClick={() => onStepChange(2)}
              className="mt-4 text-xs text-neutral-500 hover:text-neutral-300 block"
            >
              ← 이전
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
