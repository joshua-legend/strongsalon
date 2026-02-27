"use client";

import type { ExerciseInfoItem } from "@/types";

interface ExerciseListProps {
  items: ExerciseInfoItem[];
  onSelect: (item: ExerciseInfoItem) => void;
}

export default function ExerciseList({ items, onSelect }: ExerciseListProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((ex) => (
        <button
          key={ex.id}
          onClick={() => onSelect(ex)}
          className="rounded-xl p-4 text-left bg-neutral-900 border border-neutral-800"
        >
          <span className="text-[28px]">{ex.icon}</span>
          <p className="font-bebas text-[12px] font-medium mt-2 text-white">
            {ex.name}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[8px] bg-neutral-950/50 text-neutral-400">
            {ex.category}
          </span>
          <div className="flex flex-wrap gap-1 mt-2">
            {ex.targetMuscles.primary.slice(0, 2).map((m) => (
              <span
                key={m}
                className="text-[8px] px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-500"
              >
                {m}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
