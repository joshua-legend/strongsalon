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
    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 -mx-1">
      {categories.map((c) => {
        const isActive = value === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              isActive
                ? "bg-lime-400 text-black border border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]"
                : "bg-neutral-900 text-neutral-500 border border-neutral-800 hover:text-neutral-300"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
