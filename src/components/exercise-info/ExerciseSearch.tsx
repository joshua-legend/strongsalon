"use client";

import { Search } from "lucide-react";

interface ExerciseSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export default function ExerciseSearch({ value, onChange }: ExerciseSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-sub)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="종목 검색..."
        className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] shadow-inner focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--accent-bg)] transition-colors"
      />
    </div>
  );
}
