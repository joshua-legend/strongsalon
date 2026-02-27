"use client";

import type { ExerciseCategory } from "@/types";

const ALL = "전체" as const;
const categories: (ExerciseCategory | typeof ALL)[] = [
  ALL,
  "가슴",
  "등",
  "어깨",
  "팔",
  "하체",
  "코어",
  "유산소",
];

interface CategoryChipsProps {
  value: string;
  onChange: (v: string) => void;
}

export default function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1">
      {categories.map((c) => {
        const isActive = value === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium ${
              isActive
                ? "bg-orange-500/20 border border-orange-500/50 text-orange-500"
                : "bg-neutral-950/50 border border-transparent text-neutral-400"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
