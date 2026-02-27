"use client";

interface ExerciseSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export default function ExerciseSearch({ value, onChange }: ExerciseSearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="종목 검색..."
      className="w-full px-4 py-3 rounded-xl text-[14px] bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500"
    />
  );
}
