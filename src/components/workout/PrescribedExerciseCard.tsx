"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { PrescribedExercise } from "@/types";

interface PrescribedExerciseCardProps {
  exercise: PrescribedExercise;
  completedSets: number;
  actualWeight?: number;
  onCompletedSetsChange: (completedSets: number) => void;
  onActualWeightChange?: (weight: number) => void;
}

export default function PrescribedExerciseCard({
  exercise,
  completedSets,
  actualWeight,
  onCompletedSetsChange,
  onActualWeightChange,
}: PrescribedExerciseCardProps) {
  const { equipmentName, targetWeight, targetReps, targetSets } = exercise;
  const displayWeight = actualWeight ?? targetWeight;
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState(String(displayWeight));

  const allComplete = completedSets >= targetSets;

  const handleCircleTap = (index: number) => {
    if (index === completedSets - 1) {
      onCompletedSetsChange(completedSets - 1);
    } else if (index === completedSets) {
      onCompletedSetsChange(completedSets + 1);
    }
  };

  const handleWeightBlur = () => {
    const n = parseFloat(weightInput);
    if (!isNaN(n) && n >= 0) {
      onActualWeightChange?.(n);
    }
    setEditingWeight(false);
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors ${
        allComplete
          ? "bg-[var(--bg-card)]/80 border-[var(--accent-main)]/40"
          : "bg-[var(--bg-card)] border-[var(--border-light)]"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bebas text-base text-[var(--text-main)]">
            {equipmentName}
          </span>
          {allComplete && (
            <span className="w-5 h-5 rounded-full bg-lime-400 flex items-center justify-center">
              <Check className="w-3 h-3 text-black" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mb-3">
          {editingWeight ? (
            <input
              type="number"
              inputMode="decimal"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              onBlur={handleWeightBlur}
              onKeyDown={(e) => e.key === "Enter" && handleWeightBlur()}
              className="font-mono text-lg bg-[var(--bg-card-hover)] border border-[var(--border-light)] w-20 px-2 py-1 rounded-lg text-[var(--text-main)] focus:border-[var(--border-focus)] focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setWeightInput(String(displayWeight));
                setEditingWeight(true);
              }}
              className="font-mono text-lg text-[var(--text-main)] hover:text-[var(--accent-main)] transition-colors"
            >
              {displayWeight}kg
            </button>
          )}
          <span className="font-mono text-sm text-[var(--text-sub)]">
            {targetSets}세트 × {targetReps}회
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: targetSets }).map((_, i) => {
            const done = i < completedSets;
            const isNext = i === completedSets;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleCircleTap(i)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-[var(--accent-main)] text-[var(--accent-text)]"
                    : isNext
                      ? "border-2 border-[var(--accent-main)] text-[var(--accent-main)] hover:bg-[var(--accent-bg)]"
                      : "bg-[var(--bg-card-hover)] text-[var(--text-sub)]"
                }`}
              >
                {done ? <Check className="w-5 h-5" /> : ""}
              </button>
            );
          })}
          <span className="font-mono text-xs text-[var(--text-sub)] ml-2">
            {completedSets}/{targetSets}
          </span>
        </div>
      </div>
    </div>
  );
}
