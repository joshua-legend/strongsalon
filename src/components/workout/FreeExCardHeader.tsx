'use client';

import type { FreeExercise } from '@/types';

interface FreeExCardHeaderProps {
  id: string;
  index: number;
  exercise: FreeExercise;
  prWeight?: number;
  open: boolean;
  onToggle: () => void;
  onRemove: (exId: string) => void;
}

export function FreeExCardHeader({ id, index, exercise, prWeight, open, onToggle, onRemove }: FreeExCardHeaderProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
      }}
      className={`w-full flex items-center gap-2.5 py-3 px-4 cursor-pointer border-b transition-colors text-left hover:bg-white/[0.015] ${
        open ? 'border-white/[0.04]' : 'border-transparent'
      }`}
    >
      <div className="font-bebas text-[21px] leading-none w-6 flex-shrink-0"
        style={{ color: 'rgb(163, 230, 53)', textShadow: '0 0 8px rgba(163,230,53,.5)' }}>
        {index + 1}
      </div>

      <div className="flex-1 min-w-0 font-bebas text-[15px] leading-tight truncate tracking-wider text-white"
        style={{ textShadow: '0 0 8px rgba(255,255,255,.15)' }}>
        {exercise.icon} {exercise.name}
      </div>

      {prWeight != null && (
        <div className="text-[9px] font-bebas flex-shrink-0"
          style={{ color: '#a3e635', textShadow: '0 0 10px #a3e635, 0 0 22px rgba(163,230,53,.6)' }}>
          PR {prWeight}kg
        </div>
      )}

      <div className="text-[9px] font-bebas px-2.5 py-0.5 rounded-full border flex-shrink-0"
        style={{
          borderColor: 'rgba(163,230,53,.5)', background: 'rgba(163,230,53,.1)',
          color: 'rgb(163, 230, 53)', boxShadow: '0 0 8px rgba(163,230,53,.25)',
          textShadow: '0 0 6px rgba(163,230,53,.5)',
        }}>
        {exercise.sets.length} SET
      </div>

      <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(id); }}
        className="w-7 h-7 rounded-md border border-transparent flex items-center justify-center text-[13px] transition-all hover:border-red-500/60 hover:text-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,.3)] flex-shrink-0 text-neutral-700"
        aria-label="종목 삭제">
        ✕
      </button>

      <div className="text-[12px] flex-shrink-0 transition-transform"
        style={{
          color: open ? 'rgb(163, 230, 53)' : '#fff',
          textShadow: open ? '0 0 8px rgba(163,230,53,.5)' : 'none',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
        ▾
      </div>
    </div>
  );
}
