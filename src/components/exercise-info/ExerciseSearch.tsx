"use client";

import { Search } from "lucide-react";

interface ExerciseSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export default function ExerciseSearch({ value, onChange }: ExerciseSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="종목 검색..."
        className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 shadow-inner focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30 transition-colors"
      />
    </div>
  );
}
