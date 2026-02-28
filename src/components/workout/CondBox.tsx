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
      className="rounded-2xl border p-5"
      style={{
        background: '#050505',
        borderColor: 'rgba(163,230,53,.35)',
        boxShadow: '0 0 12px rgba(163,230,53,.2)',
      }}
    >
      <div
        className="font-bebas text-[11px] mb-3 tracking-widest uppercase"
        style={{ color: 'rgba(163,230,53,.6)', textShadow: '0 0 10px rgba(163,230,53,.3)' }}
      >
        CONDITION
      </div>

      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1.5 rounded-xl border transition-all"
              style={
                active
                  ? {
                      borderColor: 'rgb(163, 230, 53)',
                      background: 'rgba(163,230,53,.1)',
                      boxShadow: '0 0 10px rgba(163,230,53,.25)',
                    }
                  : {
                      borderColor: 'rgba(255,255,255,.08)',
                      background: '#0a0a0a',
                    }
              }
            >
              <span className="text-xl leading-none">{opt.emoji}</span>
              <span
                className="text-[8px] font-bebas"
                style={
                  active
                    ? { color: 'rgb(163, 230, 53)', textShadow: '0 0 8px rgba(163,230,53,.8)' }
                    : { color: '#fff' }
                }
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
