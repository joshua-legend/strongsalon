'use client';

import { useWorkout } from '@/context/WorkoutContext';
import type { Condition } from '@/types';

const conditions: { cond: Condition; emoji: string }[] = [
  { cond: '최고', emoji: '🔥' },
  { cond: '좋음', emoji: '😊' },
  { cond: '보통', emoji: '😐' },
  { cond: '피로', emoji: '😩' },
  { cond: '최악', emoji: '💀' },
];

export default function CondPicker() {
  const { condition, dispatch } = useWorkout();

  const handleStart = () => {
    if (!condition) return;
    dispatch({ type: 'START_WORKOUT' });
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'var(--og-s1, #220c00)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-space text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--text3, var(--muted))' }}>
          🔥 오늘 컨디션
        </p>
        <span
          className="px-2 py-0.5 rounded text-[8px] font-medium"
          style={{
            background: 'rgba(255,77,0,.12)',
            color: 'var(--og, var(--orange))',
            border: '1px solid rgba(255,77,0,.25)',
          }}
        >
          필수 선택
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {conditions.map(c => {
          const isSelected = condition === c.cond;
          return (
            <button
              key={c.cond}
              onClick={() => dispatch({ type: 'SET_CONDITION', cond: c.cond })}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(255,77,0,.15)' : 'var(--og-s2, var(--s2))',
                border: `1.5px solid ${isSelected ? 'var(--og, var(--orange))' : 'var(--border)'}`,
              }}
            >
              <span
                className="text-[22px] transition-transform duration-200"
                style={{ transform: isSelected ? 'scale(1.2)' : 'scale(1)' }}
              >
                {c.emoji}
              </span>
              <span className="text-[9px] font-medium" style={{ color: isSelected ? 'var(--og, var(--orange))' : 'var(--text3, var(--muted))' }}>
                {c.cond}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={!condition}
        className="w-full py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200"
        style={{
          background: condition ? 'white' : 'var(--og-s2, var(--s3))',
          color: condition ? 'var(--og, var(--orange))' : 'var(--text3, var(--muted))',
          opacity: condition ? 1 : 0.5,
        }}
      >
        {condition
          ? `${conditions.find(c => c.cond === condition)?.emoji} 컨디션 ${condition} · 운동 시작!`
          : '컨디션을 먼저 선택해주세요'}
      </button>
    </div>
  );
}
