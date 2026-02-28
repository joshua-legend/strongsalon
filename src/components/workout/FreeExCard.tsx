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
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        background: '#050505',
        borderColor: 'rgba(163,230,53,.35)',
        boxShadow: '0 0 12px rgba(163,230,53,.2)',
      }}
    >
      {/* Header row */}
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
        className={`w-full flex items-center gap-2.5 py-3 px-4 cursor-pointer border-b transition-colors text-left hover:bg-white/[0.015] ${
          open ? 'border-white/[0.04]' : 'border-transparent'
        }`}
      >
        {/* Exercise number */}
        <div
          className="font-bebas text-[21px] leading-none w-6 flex-shrink-0"
          style={{
            color: 'rgb(163, 230, 53)',
            textShadow: '0 0 8px rgba(163,230,53,.5)',
          }}
        >
          {index + 1}
        </div>

        {/* Exercise name */}
        <div
          className="flex-1 min-w-0 font-bebas text-[15px] leading-none truncate tracking-wider text-white"
          style={{ textShadow: '0 0 8px rgba(255,255,255,.15)' }}
        >
          {exercise.icon} {exercise.name}
        </div>

        {/* PR badge */}
        {prWeight != null && (
          <div
            className="text-[9px] font-bebas flex-shrink-0"
            style={{
              color: '#a3e635',
              textShadow: '0 0 10px #a3e635, 0 0 22px rgba(163,230,53,.6)',
            }}
          >
            PR {prWeight}kg
          </div>
        )}

        {/* Set count */}
        <div
          className="text-[9px] font-bebas px-2.5 py-0.5 rounded-full border flex-shrink-0"
          style={{
            borderColor: 'rgba(163,230,53,.5)',
            background: 'rgba(163,230,53,.1)',
            color: 'rgb(163, 230, 53)',
            boxShadow: '0 0 8px rgba(163,230,53,.25)',
            textShadow: '0 0 6px rgba(163,230,53,.5)',
          }}
        >
          {exercise.sets.length} SET
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="w-7 h-7 rounded-md border border-transparent flex items-center justify-center text-[13px] transition-all hover:border-red-500/60 hover:text-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,.3)] flex-shrink-0 text-neutral-700"
          aria-label="종목 삭제"
        >
          ✕
        </button>

        {/* Chevron */}
        <div
          className={`text-[12px] flex-shrink-0 transition-transform`}
          style={{
            color: open ? 'rgb(163, 230, 53)' : '#fff',
            textShadow: open ? '0 0 8px rgba(163,230,53,.5)' : 'none',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </div>
      </div>

      {/* Expanded body */}
      {open && (
        <div
          className="p-2.5 pt-2 pb-3"
          style={{ background: '#030303' }}
        >
          {/* Column headers */}
          <div
            className="grid gap-2 mb-1 px-1"
            style={{ gridTemplateColumns: '32px 1fr 1fr 56px 28px' }}
          >
            {['SET', '무게 kg', '횟수 회', '볼륨', ''].map((label, i) => (
              <span
                key={i}
                className="text-[8px] font-bebas text-center"
                style={{ color: '#fff' }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Set rows */}
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

          {/* Action buttons */}
          <div
            className="flex items-center gap-2 pt-1.5 mt-1 border-t border-dashed"
            style={{ borderColor: 'rgba(255,255,255,.04)' }}
          >
            <button
              type="button"
              onClick={() => onAddSet(id)}
              className="flex items-center gap-1 py-1.5 px-3 rounded-md border border-dashed font-bebas text-[11px] transition-all hover:shadow-[0_0_15px_rgba(163,230,53,.25)] hover:bg-lime-400/5"
              style={{
                borderColor: 'rgba(163,230,53,.35)',
                color: 'rgb(163, 230, 53)',
                textShadow: '0 0 6px rgba(163,230,53,.4)',
              }}
            >
              ＋ 세트 추가
            </button>
            <button
              type="button"
              onClick={() => onCopyLastSet(id)}
              className="py-1.5 px-2.5 rounded-md font-bebas text-[10px] transition-colors hover:border-white/[0.12]"
              style={{
                border: '1px solid rgba(255,255,255,.06)',
                color: '#fff',
              }}
            >
              ↕ 이전 복사
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
