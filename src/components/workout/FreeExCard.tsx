'use client';

import { useState } from 'react';
import type { FreeExercise } from '@/types';
import SetRow from './SetRow';
import { FreeExCardHeader } from './FreeExCardHeader';

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
  id, index, exercise, prWeight,
  onAddSet, onCopyLastSet, onDeleteSet, onSetChange, onRemove, onCheckPR,
}: FreeExCardProps) {
  const [open, setOpen] = useState(true);

  const handleAdj = (setId: string, weight: number, reps: number, dw: number, dr: number) => {
    const nw = Math.max(0, weight + dw);
    const nr = Math.max(0, reps + dr);
    onSetChange(id, setId, nw, nr);
    if (prWeight != null && nw > prWeight) onCheckPR(exercise.name, nw - prWeight);
  };

  return (
    <div className="rounded-2xl border overflow-hidden transition-all"
      style={{ background: '#050505', borderColor: 'rgba(163,230,53,.35)', boxShadow: '0 0 12px rgba(163,230,53,.2)' }}>
      <FreeExCardHeader
        id={id} index={index} exercise={exercise} prWeight={prWeight}
        open={open} onToggle={() => setOpen((o) => !o)} onRemove={onRemove}
      />

      {open && (
        <div className="p-2.5 pt-2 pb-3" style={{ background: '#030303' }}>
          <div className="grid gap-2 mb-1 px-1" style={{ gridTemplateColumns: '32px 1fr 1fr 56px 28px' }}>
            {['SET', '무게 kg', '횟수 회', '볼륨', ''].map((label, i) => (
              <span key={i} className="text-[8px] font-bebas text-center" style={{ color: '#fff' }}>
                {label}
              </span>
            ))}
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

          <div className="flex items-center gap-2 pt-1.5 mt-1 border-t border-dashed"
            style={{ borderColor: 'rgba(255,255,255,.04)' }}>
            <button type="button" onClick={() => onAddSet(id)}
              className="flex items-center gap-1 py-1.5 px-3 rounded-md border border-dashed font-bebas text-[11px] transition-all hover:shadow-[0_0_15px_rgba(163,230,53,.25)] hover:bg-lime-400/5"
              style={{ borderColor: 'rgba(163,230,53,.35)', color: 'rgb(163, 230, 53)', textShadow: '0 0 6px rgba(163,230,53,.4)' }}>
              ＋ 세트 추가
            </button>
            <button type="button" onClick={() => onCopyLastSet(id)}
              className="py-1.5 px-2.5 rounded-md font-bebas text-[10px] transition-colors hover:border-white/[0.12]"
              style={{ border: '1px solid rgba(255,255,255,.06)', color: '#fff' }}>
              ↕ 이전 복사
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
