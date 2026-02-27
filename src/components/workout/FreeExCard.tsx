'use client';

import { useState } from 'react';
import type { FreeExercise } from '@/types';
import SetRow from './SetRow';

interface FreeExCardProps {
  id: string;
  index: number;
  exercise: FreeExercise;
  prWeight?: number;
  onAddSet: (exId: string) => void;
  onCopyLastSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
  onRemove: (exId: string) => void;
  onCheckPR: (name: string, diff: number) => void;
}

export default function FreeExCard({
  id,
  index,
  exercise,
  prWeight,
  onAddSet,
  onCopyLastSet,
  onDeleteSet,
  onSetChange,
  onRemove,
  onCheckPR,
}: FreeExCardProps) {
  const [open, setOpen] = useState(true);

  const handleAdj = (setId: string, weight: number, reps: number, dw: number, dr: number) => {
    const s = exercise.sets.find((x) => x.id === setId);
    if (!s) return;
    const nw = Math.max(0, weight + dw);
    const nr = Math.max(0, reps + dr);
    onSetChange(id, setId, nw, nr);
    if (prWeight != null && nw > prWeight) onCheckPR(exercise.name, nw - prWeight);
  };

  return (
    <div className="rounded-xl border border-neutral-800 overflow-hidden transition-[border-color] hover:border-neutral-700 bg-neutral-900">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className={`w-full flex items-center gap-2.5 py-3 px-4 cursor-pointer border-b hover:bg-white/[0.02] transition-colors text-left ${open ? 'border-neutral-800' : 'border-transparent'}`}
      >
        <div className="font-bebas text-[21px] leading-none w-6 flex-shrink-0 text-orange-500">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0 text-[13px] font-bold truncate">
          {exercise.icon} {exercise.name}
        </div>
        {prWeight != null && (
          <div className="text-[9px] font-bebas text-lime-400 flex-shrink-0">
            PR {prWeight}kg
          </div>
        )}
        <div className="text-[9px] font-bebas px-2.5 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 flex-shrink-0">
          {exercise.sets.length} SET
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="w-7 h-7 rounded-md border border-transparent flex items-center justify-center text-[13px] transition-colors hover:border-red-500 hover:text-red-500 flex-shrink-0 text-neutral-400"
          aria-label="종목 삭제"
        >
          ✕
        </button>
        <div className={`text-[12px] flex-shrink-0 transition-transform text-neutral-400 ${open ? 'rotate-180' : ''}`}>
          ▾
        </div>
      </div>
      {open && (
        <div className="p-2.5 pt-2 pb-3">
          <div
            className="grid gap-2 mb-1 px-1"
            style={{ gridTemplateColumns: '32px 1fr 1fr 56px 28px' }}
          >
            <span className="text-[8px] font-bebas text-center text-neutral-400">
              SET
            </span>
            <span className="text-[8px] font-bebas text-center text-neutral-400">
              무게 kg
            </span>
            <span className="text-[8px] font-bebas text-center text-neutral-400">
              횟수 회
            </span>
            <span className="text-[8px] font-bebas text-center text-neutral-400">
              볼륨
            </span>
            <span />
          </div>
          {exercise.sets.map((set, idx) => (
            <SetRow
              key={set.id}
              setNumber={idx + 1}
              weight={set.weight}
              reps={set.reps}
              volume={set.weight * set.reps}
              onWeightChange={(v) => onSetChange(id, set.id, v, set.reps)}
              onRepsChange={(v) => onSetChange(id, set.id, set.weight, v)}
              onAdjWeight={(d) => handleAdj(set.id, set.weight, set.reps, d, 0)}
              onAdjReps={(d) => handleAdj(set.id, set.weight, set.reps, 0, d)}
              onDelete={() => onDeleteSet(id, set.id)}
              accentColor="orange"
            />
          ))}
          <div className="flex items-center gap-2 pt-1.5 mt-1 border-t border-dashed border-white/5">
            <button
              type="button"
              onClick={() => onAddSet(id)}
              className="flex items-center gap-1 py-1.5 px-3 rounded-md border border-dashed text-[11px] font-bold transition-colors hover:bg-orange-500/5"
              className="border-orange-500/25 text-orange-400"
            >
              ＋ 세트 추가
            </button>
            <button
              type="button"
              onClick={() => onCopyLastSet(id)}
              className="py-1.5 px-2.5 rounded-md border border-neutral-800 text-neutral-400 text-[10px] font-bebas transition-colors hover:border-neutral-700"
            >
              ↕ 이전 복사
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
