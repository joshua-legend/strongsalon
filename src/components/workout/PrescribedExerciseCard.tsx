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
          ? "bg-neutral-900/80 border-lime-400/40"
          : "bg-neutral-900 border-neutral-800"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bebas text-base text-white">
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
              className="font-mono text-lg bg-neutral-800 border border-neutral-700 w-20 px-2 py-1 rounded-lg text-white focus:border-lime-400 focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setWeightInput(String(displayWeight));
                setEditingWeight(true);
              }}
              className="font-mono text-lg text-white hover:text-lime-400 transition-colors"
            >
              {displayWeight}kg
            </button>
          )}
          <span className="font-mono text-sm text-neutral-500">
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
                    ? "bg-lime-400 text-black"
                    : isNext
                      ? "border-2 border-lime-400 text-lime-400 hover:bg-lime-400/20"
                      : "bg-neutral-800 text-neutral-600"
                }`}
              >
                {done ? <Check className="w-5 h-5" /> : ""}
              </button>
            );
          })}
          <span className="font-mono text-xs text-neutral-500 ml-2">
            {completedSets}/{targetSets}
          </span>
        </div>
      </div>
    </div>
  );
}
