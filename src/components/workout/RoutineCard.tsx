"use client";

import { Trash2 } from "lucide-react";
import type { FreeExercise } from "@/types";
import { exercisesInfo } from "@/data/exercises-info";

const nameToCategory: Record<string, string> = Object.fromEntries(
  exercisesInfo.map((e) => [e.name, e.category])
);

interface RoutineCardProps {
  id: string;
  exercise: FreeExercise;
  onCardClick: () => void;
  onRemove: (exId: string) => void;
}

export default function RoutineCard({ id, exercise, onCardClick, onRemove }: RoutineCardProps) {
  const category = nameToCategory[exercise.name] ?? "기타";
  const firstSet = exercise.sets[0];
  const setCount = exercise.sets.length;
  const summary =
    setCount > 0 && firstSet
      ? `${setCount} SET · ${firstSet.weight > 0 ? firstSet.weight : "—"} KG · ${firstSet.reps > 0 ? firstSet.reps : "—"} REPS`
      : `0 SET · — · —`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
      className="rounded-2xl border p-4 cursor-pointer transition-all duration-300 hover:bg-[var(--bg-card-hover)] active:scale-[0.99]"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-light)",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="font-bebas text-[12px] font-bold px-2 py-0.5 rounded-md tracking-wider"
              style={{
                backgroundColor: "var(--accent-bg)",
                color: "var(--accent-main)",
                border: "1px solid var(--border-light)",
              }}
            >
              {category}
            </span>
            <span className="font-bebas text-[16px] font-bold tracking-wider truncate" style={{ color: "var(--text-main)" }}>
              {exercise.icon} {exercise.name}
            </span>
          </div>
          <div
            className="font-bebas text-[13px] font-bold tracking-widest"
            style={{ color: "var(--text-sub)" }}
          >
            {summary}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 hover:bg-[var(--bg-body)]"
          style={{ color: "var(--text-sub)" }}
          aria-label="종목 삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
