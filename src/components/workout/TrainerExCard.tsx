'use client';

import { useState } from 'react';
import type { TrainerExercise } from '@/types';
import SetRow from './SetRow';

interface TrainerExCardProps {
  index: number;
  exercise: TrainerExercise;
  onAddSet: (exId: string) => void;
  onCopyLastSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
  onCheckPR: (name: string, weight: number) => void;
}

export default function TrainerExCard({
  index,
  exercise,
  onAddSet,
  onCopyLastSet,
  onDeleteSet,
  onSetChange,
  onCheckPR,
}: TrainerExCardProps) {
  const [open, setOpen] = useState(true);

  const doneSets = exercise.sets.filter((s) => s.weight > 0 && s.reps > 0).length;
  const isAllDone = doneSets >= exercise.tSets;

  const handleAdj = (setId: string, weight: number, reps: number, dw: number, dr: number) => {
    const s = exercise.sets.find((x) => x.id === setId);
    if (!s) return;
    const nw = Math.max(0, weight + dw);
    const nr = Math.max(0, reps + dr);
    onSetChange(exercise.id, setId, nw, nr);
    if (exercise.prevPR != null && nw > exercise.prevPR) onCheckPR(exercise.name, nw - exercise.prevPR);
  };

  return (
    <div className="rounded-2xl border border-purple-500/20 overflow-hidden transition-all hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,.15)] bg-neutral-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 py-3 px-4 cursor-pointer border-b border-transparent hover:bg-white/[0.015] transition-colors text-left ${open ? 'border-neutral-800' : ''}`}
      >
        <div className="font-bebas text-[22px] leading-none w-6 flex-shrink-0 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,.5)]">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bebas text-[15px] leading-none truncate tracking-wider drop-shadow-[0_0_4px_rgba(255,255,255,.2)]">
            {exercise.icon} {exercise.name}
          </div>
        </div>
        <div
          className={`text-[9px] font-bebas px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
            isAllDone ? 'bg-green-500/10 text-green-500 border-green-500/25 shadow-[0_0_10px_rgba(34,197,94,.3)]' : 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,.2)]'
          }`}
        >
          {doneSets} / {exercise.tSets} SET
        </div>
        <div className="w-[18px] text-center flex-shrink-0 text-sm">
          {isAllDone ? '✅' : doneSets > 0 ? '⏳' : ''}
        </div>
        <div className={`text-[12px] flex-shrink-0 transition-transform text-neutral-400 ${open ? 'rotate-180' : ''}`}>
          ▾
        </div>
      </button>
      {open && (
        <div className="p-2.5 pt-2 pb-3.5">
          <div
            className="flex items-center gap-2 py-2 px-3 rounded-lg mb-2.5 shadow-[0_0_15px_rgba(168,85,247,.12)]"
            style={{
              background: 'rgba(168,85,247,.06)',
              border: '1px solid rgba(168,85,247,.25)',
            }}
          >
            <span className="text-sm">📋</span>
            <span className="text-[10px] flex-1 text-neutral-400">
              트레이너 처방
            </span>
            <span className="text-[11px] font-bebas font-bold whitespace-nowrap text-purple-500 drop-shadow-[0_0_6px_rgba(168,85,247,.5)]">
              {exercise.rx}
            </span>
          </div>
          {exercise.prevPR != null && (
            <div className="flex items-center gap-1.5 text-[10px] font-bebas text-lime-400 mb-2 px-1 drop-shadow-[0_0_6px_rgba(163,230,53,.4)]">
              🏅 현재 PR · {exercise.prevPR}kg — 이걸 넘어봐요!
            </div>
          )}
          <div
            className="grid gap-2 mb-1 px-1"
            style={{ gridTemplateColumns: '28px 1fr 1fr 52px 28px' }}
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
              onWeightChange={(v) => onSetChange(exercise.id, set.id, v, set.reps)}
              onRepsChange={(v) => onSetChange(exercise.id, set.id, set.weight, v)}
              onAdjWeight={(d) => handleAdj(set.id, set.weight, set.reps, d, 0)}
              onAdjReps={(d) => handleAdj(set.id, set.weight, set.reps, 0, d)}
              onDelete={() => onDeleteSet(exercise.id, set.id)}
              accentColor="purple"
            />
          ))}
          <div className="flex items-center gap-2 pt-1.5 mt-1 border-t border-dashed border-white/5">
            <button
              type="button"
              onClick={() => onAddSet(exercise.id)}
              className="flex items-center gap-1 py-1.5 px-3 rounded-md border border-dashed text-[11px] font-bold transition-all hover:bg-orange-500/5 border-orange-500/25 text-orange-400 hover:shadow-[0_0_12px_rgba(249,115,22,.2)]"
            >
              ＋ 세트 추가
            </button>
            <button
              type="button"
              onClick={() => onCopyLastSet(exercise.id)}
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
