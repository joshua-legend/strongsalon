"use client";

import { useState } from "react";
import type { WeeklyGoal, GoalCategory } from "@/types";
import { CATEGORIES, EXERCISE_OPTIONS, UNIT_MAP, LABEL_MAP } from "./weeklyGoalSheetData";

interface WeeklyGoalSheetProps {
  open: boolean;
  onClose: () => void;
  goals: WeeklyGoal[];
  onSave: (goals: WeeklyGoal[]) => void;
}

export default function WeeklyGoalSheet({ open, onClose, goals, onSave }: WeeklyGoalSheetProps) {
  const [category, setCategory]         = useState<GoalCategory>("strength");
  const [exerciseKey, setExerciseKey]   = useState("bench");
  const [targetValue, setTargetValue]   = useState("80");
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
      <div className="fixed left-0 right-0 bottom-0 z-[901] rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] max-h-[80vh] overflow-auto border-t" style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)" }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bebas text-[20px] leading-none text-[var(--text-main)]">이번 주 목표 추가</p>
            <p className="font-bebas text-[9px] text-[var(--text-sub)] mt-0.5">주간 단위로 달성할 목표를 설정하세요</p>
          </div>
          <button onClick={onClose} className="font-bebas text-[12px] text-[var(--text-sub)] hover:text-[var(--text-main)]">닫기</button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bebas text-[9px] mb-2 text-[var(--text-sub)] uppercase tracking-wider">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bebas transition-colors ${
                    category === c.value
                      ? "bg-[var(--accent-bg)] text-[var(--accent-main)] border border-[var(--border-focus)]"
                      : "bg-[var(--bg-card)] text-[var(--text-sub)] border border-transparent"
                  }`}>
                  <span>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </div>

          {category === "strength" && (
            <div>
              <p className="font-bebas text-[9px] mb-2 text-[var(--text-sub)] uppercase tracking-wider">종목</p>
              <div className="flex flex-wrap gap-2">
                {EXERCISE_OPTIONS.map((e) => (
                  <button key={e.key} onClick={() => setExerciseKey(e.key)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bebas transition-colors ${
                      exerciseKey === e.key
                        ? "bg-[var(--accent-bg)] text-[var(--accent-main)] border border-[var(--border-focus)]"
                        : "bg-[var(--bg-card)] text-[var(--text-sub)] border border-transparent"
                    }`}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-bebas text-[9px] mb-2 text-[var(--text-sub)] uppercase tracking-wider">목표 ({unit})</p>
              <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[18px] font-bebas border focus:outline-none"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)", color: "var(--text-main)" }}
                placeholder="80" />
            </div>
            <div>
              <p className="font-bebas text-[9px] mb-2 text-[var(--text-sub)] uppercase tracking-wider">현재 진행 ({unit})</p>
              <input type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[18px] font-bebas border focus:outline-none"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)", color: "var(--text-main)" }}
                placeholder="0" />
            </div>
          </div>

          <button onClick={handleAdd}
            className="w-full py-3 rounded-xl font-bebas text-[13px] font-medium uppercase tracking-wider transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}>
            목표 추가
          </button>
        </div>
      </div>
    </>
  );
}
