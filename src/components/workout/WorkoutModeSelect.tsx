"use client";

import { useGoal } from "@/context/GoalContext";
import { SPLIT_PRESETS } from "@/data/workoutPresets";

interface WorkoutModeSelectProps {
  onSelectRecommended: () => void;
  onSelectFree: () => void;
}

export default function WorkoutModeSelect({
  onSelectRecommended,
  onSelectFree,
}: WorkoutModeSelectProps) {
  const { categorySettings } = useGoal();
  const strength = categorySettings.strength;
  const hasStrength =
    strength?.isConfigured &&
    strength?.startValues &&
    (strength.startValues.squat ?? 0) > 0 &&
    (strength.startValues.bench ?? 0) > 0 &&
    (strength.startValues.deadlift ?? 0) > 0;

  const sampleSplit = SPLIT_PRESETS[0];
  const sampleCount = sampleSplit.exercises.length;

  return (
    <div className="min-h-full flex flex-col px-4 py-6" style={{ background: "#000" }}>
      <div className="max-w-md mx-auto w-full space-y-4">
        <h1 className="font-bebas text-2xl tracking-wider text-white text-center">
          오늘 어떤 운동?
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {/* 추천 운동 카드 */}
          <button
            type="button"
            onClick={onSelectRecommended}
            className={`relative rounded-2xl p-5 text-left transition-all overflow-hidden ${
              hasStrength
                ? "bg-lime-500/15 border-2 border-lime-400/50 hover:border-lime-400 hover:bg-lime-500/20"
                : "bg-neutral-900/80 border border-neutral-700 hover:border-amber-500/50"
            }`}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-lime-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500/30 text-lime-300 mb-2">
                추천
              </span>
              <h2 className="font-bebas text-lg tracking-wider text-white">
                3대 기반 추천 루틴
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                오늘 어떤 분할 · {sampleCount}종목 · 약 {sampleSplit.estMinutes}분
              </p>
              {!hasStrength && (
                <p className="text-[11px] text-amber-400 mt-2">
                  스트렝스 정보가 필요합니다
                </p>
              )}
            </div>
          </button>

          {/* 자유 운동 카드 */}
          <button
            type="button"
            onClick={onSelectFree}
            className="relative rounded-2xl p-5 text-left transition-all border-2 border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900/50 bg-neutral-950/80"
          >
            <div className="relative">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-600/50 text-neutral-300 mb-2">
                자유
              </span>
              <h2 className="font-bebas text-lg tracking-wider text-white">
                내가 정한 루틴
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                원하는 종목을 자유롭게 선택
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
