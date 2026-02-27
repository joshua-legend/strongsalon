"use client";

import { useState } from "react";
import type { Goal, GoalCategory } from "@/types";

const CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: "strength", label: "근력" },
  { value: "body", label: "체성분" },
  { value: "cardio", label: "체력" },
  { value: "attendance", label: "출석" },
  { value: "weight", label: "체중" },
];

const EXERCISE_OPTIONS: { key: string; label: string }[] = [
  { key: "bench", label: "벤치프레스" },
  { key: "squat", label: "스쿼트" },
  { key: "deadlift", label: "데드리프트" },
  { key: "ohp", label: "오버헤드프레스" },
];

const DEADLINE_OPTIONS = [
  { months: 1, label: "1개월" },
  { months: 2, label: "2개월" },
  { months: 3, label: "3개월" },
];

interface GoalEditSheetProps {
  open: boolean;
  onClose: () => void;
  goals: Goal[];
  onSave: (goals: Goal[]) => void;
}

export default function GoalEditSheet({ open, onClose, goals, onSave }: GoalEditSheetProps) {
  const [category, setCategory] = useState<GoalCategory>("strength");
  const [exerciseKey, setExerciseKey] = useState("bench");
  const [targetValue, setTargetValue] = useState("100");
  const [deadlineMonths, setDeadlineMonths] = useState<number | null>(null);

  if (!open) return null;

  const handleAdd = () => {
    const newGoal: Goal = {
      id: `g_${Date.now()}`,
      category,
      exerciseKey: category === "strength" ? exerciseKey : undefined,
      label: category === "strength" ? EXERCISE_OPTIONS.find((e) => e.key === exerciseKey)?.label : category,
      targetValue: Number(targetValue) || 0,
      currentValue: 0,
      unit: category === "strength" ? "kg" : category === "body" ? "%" : category === "attendance" ? "회" : "kg",
      deadline: deadlineMonths
        ? (() => {
            const d = new Date();
            d.setMonth(d.getMonth() + deadlineMonths);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
          })()
        : undefined,
      achieved: false,
      isPrimary: goals.length === 0,
    };
    onSave([...goals.slice(0, 2), newGoal]);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[900] bg-black/40" onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-[901] rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-h-[80vh] overflow-auto bg-neutral-950 border-t border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <p className="card-label mb-0">목표 편집</p>
          <button onClick={onClose} className="text-[14px] text-neutral-400">
            닫기
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bebas text-[9px] mb-2 text-neutral-400">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] ${
                    category === c.value
                      ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                      : "bg-neutral-900 text-neutral-400"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {category === "strength" && (
            <div>
              <p className="font-bebas text-[9px] mb-2 text-neutral-400">종목</p>
              <select
                value={exerciseKey}
                onChange={(e) => setExerciseKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[12px] bg-neutral-900 border border-neutral-800 text-white"
              >
                {EXERCISE_OPTIONS.map((e) => (
                  <option key={e.key} value={e.key}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <p className="font-bebas text-[9px] mb-2 text-neutral-400">목표 수치</p>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-[14px] font-bebas bg-neutral-900 border border-neutral-800 text-white"
              placeholder="100"
            />
          </div>

          <div>
            <p className="font-bebas text-[9px] mb-2 text-neutral-400">기한 (선택)</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeadlineMonths(null)}
                className={`px-3 py-1.5 rounded-lg text-[11px] ${
                  deadlineMonths === null
                    ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                    : "bg-neutral-900 text-neutral-400"
                }`}
              >
                무기한
              </button>
              {DEADLINE_OPTIONS.map((d) => (
                <button
                  key={d.months}
                  onClick={() => setDeadlineMonths(d.months)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] ${
                    deadlineMonths === d.months
                      ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                      : "bg-neutral-900 text-neutral-400"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-3 rounded-xl font-medium text-[14px] bg-lime-400 text-black"
          >
            목표 추가
          </button>
        </div>
      </div>
    </>
  );
}
