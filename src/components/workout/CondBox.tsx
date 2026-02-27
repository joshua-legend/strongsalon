'use client';

import type { WorkoutCondition } from '@/types';

const OPTIONS: { value: WorkoutCondition; emoji: string; label: string }[] = [
  { value: '최악', emoji: '😫', label: '최악' },
  { value: '나쁨', emoji: '😕', label: '나쁨' },
  { value: '좋음', emoji: '😊', label: '좋음' },
  { value: '최고', emoji: '💪', label: '최고' },
  { value: '불타', emoji: '🔥', label: '불타' },
];

interface CondBoxProps {
  value: WorkoutCondition;
  onChange: (v: WorkoutCondition) => void;
}

export default function CondBox({ value, onChange }: CondBoxProps) {
  return (
    <div className="flex-1 rounded-xl border border-neutral-800 p-3.5 bg-neutral-900">
      <div className="text-xs font-semibold mb-2.5 text-white tracking-wide">
        오늘 컨디션
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1.5 rounded-[10px] border transition-all ${
              value === opt.value
                ? 'border-orange-500/40 bg-orange-500/10 shadow-[0_0_14px_rgba(249,115,22,.12)]'
                : 'border-neutral-800 bg-neutral-900'
            }`}
          >
            <span className="text-xl leading-none">{opt.emoji}</span>
            <span
              className={`text-[8px] font-bebas ${value === opt.value ? 'text-orange-400' : 'text-neutral-400'}`}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
