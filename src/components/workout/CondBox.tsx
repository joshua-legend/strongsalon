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
    <div
      className="flex-1 rounded-xl border p-3.5"
      style={{ background: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div
        className="text-[8px] font-[family-name:var(--font-space)] mb-2.5"
        style={{ color: 'var(--muted2)', letterSpacing: '2px' }}
      >
        // 오늘 컨디션
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1.5 rounded-[10px] border transition-all"
            style={{
              borderColor: value === opt.value ? 'rgba(255,77,0,.4)' : 'var(--border)',
              background: value === opt.value ? 'rgba(255,77,0,.1)' : 'var(--s2)',
              boxShadow: value === opt.value ? '0 0 14px rgba(255,77,0,.12)' : undefined,
            }}
          >
            <span className="text-xl leading-none">{opt.emoji}</span>
            <span
              className="text-[8px] font-[family-name:var(--font-space)]"
              style={{ color: value === opt.value ? 'var(--og3)' : 'var(--muted2)' }}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
