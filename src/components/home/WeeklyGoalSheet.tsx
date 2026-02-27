"use client";

import { useState } from "react";
import type { WeeklyGoal, GoalCategory } from "@/types";

const CATEGORIES: { value: GoalCategory; label: string; icon: string }[] = [
  { value: "strength", label: "근력",   icon: "🏋️" },
  { value: "cardio",   label: "체력",   icon: "🏃" },
  { value: "attendance", label: "출석", icon: "📅" },
  { value: "body",     label: "체성분", icon: "📊" },
  { value: "weight",   label: "체중",   icon: "⚖️" },
];

const EXERCISE_OPTIONS: { key: string; label: string }[] = [
  { key: "bench",    label: "벤치프레스" },
  { key: "squat",    label: "스쿼트" },
  { key: "deadlift", label: "데드리프트" },
  { key: "ohp",      label: "오버헤드프레스" },
  { key: "pullup",   label: "풀업" },
];

const UNIT_MAP: Record<GoalCategory, string> = {
  strength:   "reps",
  cardio:     "km",
  attendance: "회",
  body:       "%",
  weight:     "kg",
};

const LABEL_MAP: Record<GoalCategory, string> = {
  strength:   "종목 선택",
  cardio:     "유산소",
  attendance: "출석",
  body:       "체지방률",
  weight:     "체중",
};

interface WeeklyGoalSheetProps {
  open: boolean;
  onClose: () => void;
  goals: WeeklyGoal[];
  onSave: (goals: WeeklyGoal[]) => void;
}

export default function WeeklyGoalSheet({ open, onClose, goals, onSave }: WeeklyGoalSheetProps) {
  const [category, setCategory]       = useState<GoalCategory>("strength");
  const [exerciseKey, setExerciseKey] = useState("bench");
  const [targetValue, setTargetValue] = useState("80");
  const [currentValue, setCurrentValue] = useState("0");

  if (!open) return null;

  const unit = UNIT_MAP[category];

  const handleAdd = () => {
    const isStrength = category === "strength";
    const exercise = EXERCISE_OPTIONS.find((e) => e.key === exerciseKey);
    const label = isStrength ? (exercise?.label ?? "근력") : LABEL_MAP[category];
    const icon  = CATEGORIES.find((c) => c.value === category)?.icon ?? "🎯";

    const newGoal: WeeklyGoal = {
      id: `wg_${Date.now()}`,
      label,
      category,
      exerciseKey: isStrength ? exerciseKey : undefined,
      targetValue:  Number(targetValue)  || 0,
      currentValue: Number(currentValue) || 0,
      unit,
      icon,
    };

    onSave([...goals, newGoal]);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[900] bg-black/50" onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-[901] rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] max-h-[80vh] overflow-auto bg-neutral-950 border-t border-neutral-800">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bebas text-[20px] leading-none text-white">이번 주 목표 추가</p>
            <p className="font-bebas text-[9px] text-neutral-500 mt-0.5">주간 단위로 달성할 목표를 설정하세요</p>
          </div>
          <button onClick={onClose} className="font-bebas text-[12px] text-neutral-400">닫기</button>
        </div>

        <div className="flex flex-col gap-4">
          {/* 카테고리 */}
          <div>
            <p className="font-bebas text-[9px] mb-2 text-neutral-400 uppercase tracking-wider">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bebas transition-colors ${
                    category === c.value
                      ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                      : "bg-neutral-900 text-neutral-400 border border-transparent"
                  }`}
                >
                  <span>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 종목 선택 (근력만) */}
          {category === "strength" && (
            <div>
              <p className="font-bebas text-[9px] mb-2 text-neutral-400 uppercase tracking-wider">종목</p>
              <div className="flex flex-wrap gap-2">
                {EXERCISE_OPTIONS.map((e) => (
                  <button
                    key={e.key}
                    onClick={() => setExerciseKey(e.key)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bebas transition-colors ${
                      exerciseKey === e.key
                        ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                        : "bg-neutral-900 text-neutral-400 border border-transparent"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 목표 수치 / 현재값 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-bebas text-[9px] mb-2 text-neutral-400 uppercase tracking-wider">
                목표 ({unit})
              </p>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[18px] font-bebas bg-neutral-900 border border-neutral-800 text-white focus:border-lime-400/50 focus:outline-none"
                placeholder="80"
              />
            </div>
            <div>
              <p className="font-bebas text-[9px] mb-2 text-neutral-400 uppercase tracking-wider">
                현재 진행 ({unit})
              </p>
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[18px] font-bebas bg-neutral-900 border border-neutral-800 text-white focus:border-lime-400/50 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* 추가 버튼 */}
          <button
            onClick={handleAdd}
            className="w-full py-3 rounded-xl font-bebas text-[13px] font-medium uppercase tracking-wider bg-lime-400 text-black transition-opacity hover:opacity-90"
          >
            목표 추가
          </button>
        </div>
      </div>
    </>
  );
}
