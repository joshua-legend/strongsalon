'use client';

import { useState } from 'react';
import type { WorkoutSet } from '@/types';
import NumberModal from './NumberModal';

interface SetTableProps {
  sets: WorkoutSet[];
  exerciseIdx: number;
  exerciseName: string;
  onToggle: (setIdx: number) => void;
  onUpdateWeight: (setIdx: number, kg: number) => void;
  onUpdateReps: (setIdx: number, reps: number) => void;
}

export default function SetTable({
  sets,
  exerciseIdx,
  exerciseName,
  onToggle,
  onUpdateWeight,
  onUpdateReps,
}: SetTableProps) {
  const [modal, setModal] = useState<{ type: 'kg' | 'reps'; setIdx: number } | null>(null);
  const firstUndone = sets.findIndex(s => !s.done);

  return (
    <>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div
          className="grid grid-cols-4 text-center py-2 text-[10px] font-medium"
          style={{ background: 'var(--og, var(--orange))', color: 'white' }}
        >
          <span>구분</span>
          <span>무게(kg)</span>
          <span>횟수(회)</span>
          <span>체크</span>
        </div>

        {sets.map((s, i) => {
          const isCurrent = i === firstUndone;
          return (
            <div
              key={i}
              className="grid grid-cols-4 text-center items-center py-2.5 text-[12px] relative"
              style={{
                background: s.done
                  ? 'rgba(34,197,94,.08)'
                  : isCurrent
                    ? 'rgba(255,77,0,.08)'
                    : 'var(--og-s1, #220c00)',
                borderTop: '1px solid var(--border)',
                opacity: s.done ? 0.6 : 1,
              }}
            >
              {isCurrent && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'var(--og, var(--orange))' }}
                />
              )}

              <span className="font-space text-[10px]" style={{ color: 'var(--text3, var(--muted))' }}>
                {s.label}
              </span>

              <button
                onClick={() => !s.done && setModal({ type: 'kg', setIdx: i })}
                className="font-bebas text-[18px]"
                style={{ color: s.done ? 'var(--green)' : 'var(--text)' }}
              >
                {s.kg}
              </button>

              <button
                onClick={() => !s.done && setModal({ type: 'reps', setIdx: i })}
                className="font-bebas text-[18px]"
                style={{ color: s.done ? 'var(--green)' : 'var(--text)' }}
              >
                {s.reps}
              </button>

              <button
                onClick={() => onToggle(i)}
                className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-[14px] transition-all duration-200"
                style={{
                  background: s.done ? 'rgba(34,197,94,.2)' : 'var(--og-s2, var(--s2))',
                  border: `1.5px solid ${s.done ? 'var(--green)' : 'var(--border2)'}`,
                  color: s.done ? 'var(--green)' : 'var(--muted)',
                }}
              >
                {s.done ? '✓' : '○'}
              </button>
            </div>
          );
        })}
      </div>

      {modal && (
        <NumberModal
          open
          title={`${exerciseName} · ${sets[modal.setIdx].label}`}
          unit={modal.type === 'kg' ? 'kg' : '회'}
          initial={modal.type === 'kg' ? sets[modal.setIdx].kg : sets[modal.setIdx].reps}
          onConfirm={(val) => {
            if (modal.type === 'kg') onUpdateWeight(modal.setIdx, val);
            else onUpdateReps(modal.setIdx, val);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
