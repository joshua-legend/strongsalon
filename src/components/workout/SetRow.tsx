'use client';

import type { SetStatus } from '@/types';

interface SetRowProps {
  setNumber: number;
  weight: number;
  reps: number;
  volume: number;
  status: SetStatus;
  isWorkoutActive: boolean;
  onWeightChange: (v: number) => void;
  onRepsChange: (v: number) => void;
  onAdjWeight: (delta: number) => void;
  onAdjReps: (delta: number) => void;
  onDelete: () => void;
  onStatusChange: (status: SetStatus) => void;
  accentColor?: 'orange' | 'purple';
}

export default function SetRow({
  setNumber,
  weight,
  reps,
  volume,
  status,
  isWorkoutActive,
  onWeightChange,
  onRepsChange,
  onAdjWeight,
  onAdjReps,
  onDelete,
  onStatusChange,
  accentColor = 'orange',
}: SetRowProps) {
  const done = weight > 0 && reps > 0;
  const isOrange = accentColor === 'orange';
  const isClear = status === 'clear';
  const isFail = status === 'fail';
  const showCheck = isWorkoutActive && done;

  const inputCellClass = isOrange
    ? 'focus-within:border-lime-400/70 focus-within:shadow-[0_0_18px_rgba(163,230,53,.3)]'
    : 'focus-within:border-purple-500/70 focus-within:shadow-[0_0_18px_rgba(192,132,252,.3)]';

  const numberStyle = (() => {
    if (isClear) return {
      background: 'rgba(163,230,53,.15)',
      borderColor: '#a3e635',
      color: '#a3e635',
      boxShadow: '0 0 10px rgba(163,230,53,.4)',
    };
    if (isFail) return {
      background: 'rgba(239,68,68,.15)',
      borderColor: '#ef4444',
      color: '#ef4444',
      boxShadow: '0 0 10px rgba(239,68,68,.4)',
    };
    if (done) return {
      background: 'rgba(163,230,53,.12)',
      borderColor: '#a3e635',
      color: '#a3e635',
      boxShadow: '0 0 10px rgba(163,230,53,.4)',
      textShadow: '0 0 10px #a3e635, 0 0 22px rgba(163,230,53,.6)',
    };
    return {
      background: 'var(--bg-body)',
      borderColor: 'var(--border-light)',
      color: 'var(--text-main)',
    };
  })();

  return (
    <div
      className="rounded-lg transition-all"
      style={{
        opacity: isFail ? 0.5 : 1,
        background: isClear ? 'rgba(163,230,53,.04)' : isFail ? 'rgba(239,68,68,.03)' : 'transparent',
      }}
    >
      {/* 메인 세트 행 */}
      <div
        className="grid items-center p-1"
        style={{ gridTemplateColumns: '28px 1fr 1fr 52px 28px', gap: '8px' }}
      >
        <div
          className="flex items-center justify-center rounded-md border shrink-0 w-7 h-7 font-bebas text-[10px] transition-all"
          style={numberStyle}
        >
          {isClear ? '✓' : isFail ? '✗' : setNumber}
        </div>

        <div
          className={`flex items-center rounded-lg border overflow-hidden transition-all ${inputCellClass}`}
          style={{ background: 'var(--bg-body)', borderColor: 'var(--border-light)' }}
        >
          <button type="button" onClick={() => onAdjWeight(-2.5)}
            className="w-7 h-8 flex items-center justify-center shrink-0 text-[14px] transition-colors hover:bg-[var(--bg-card-hover)]/50 text-[var(--text-sub)]">−</button>
          <input type="number" value={weight || ''} onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
            placeholder="kg" min={0} step={2.5}
            className="flex-1 text-center bg-transparent border-none outline-none min-w-0 py-0 font-bebas text-xs text-[var(--text-main)]" />
          <button type="button" onClick={() => onAdjWeight(2.5)}
            className="w-7 h-8 flex items-center justify-center shrink-0 text-[14px] transition-colors hover:bg-[var(--bg-card-hover)]/50 text-[var(--text-sub)]">＋</button>
        </div>

        <div
          className={`flex items-center rounded-lg border overflow-hidden transition-all ${inputCellClass}`}
          style={{ background: 'var(--bg-body)', borderColor: 'var(--border-light)' }}
        >
          <button type="button" onClick={() => onAdjReps(-1)}
            className="w-7 h-8 flex items-center justify-center shrink-0 text-[14px] transition-colors hover:bg-[var(--bg-card-hover)]/50 text-[var(--text-sub)]">−</button>
          <input type="number" value={reps || ''} onChange={(e) => onRepsChange(parseInt(e.target.value, 10) || 0)}
            placeholder="회" min={0} step={1}
            className="flex-1 text-center bg-transparent border-none outline-none min-w-0 py-0 font-bebas text-xs text-[var(--text-main)]" />
          <button type="button" onClick={() => onAdjReps(1)}
            className="w-7 h-8 flex items-center justify-center shrink-0 text-[14px] transition-colors hover:bg-[var(--bg-card-hover)]/50 text-[var(--text-sub)]">＋</button>
        </div>

        <div className="text-center font-bebas text-[10px] transition-all"
          style={volume > 0
            ? isOrange
              ? { color: 'rgb(163, 230, 53)', textShadow: '0 0 8px rgba(163,230,53,.8)' }
              : { color: '#c084fc', textShadow: '0 0 8px rgba(192,132,252,.8)' }
            : { color: 'var(--text-main)' }}>
          {volume > 0 ? `${volume.toLocaleString()}` : '—'}
        </div>

        <button type="button" onClick={onDelete}
          className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all hover:bg-red-500/10 hover:text-red-500 shrink-0 text-[var(--text-sub)]">
          ✕
        </button>
      </div>

      {/* 세트 완료 체크 - 운동 중 + 값 입력됨 */}
      {showCheck && (
        <div className="flex items-center gap-2 px-2 pb-2 pt-0.5">
          <button
            type="button"
            onClick={() => onStatusChange(isClear ? 'pending' : 'clear')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bebas text-[11px] tracking-wider transition-all active:scale-95"
            style={isClear ? {
              background: 'rgba(163,230,53,.12)',
              border: '1.5px solid rgba(163,230,53,.7)',
              color: '#a3e635',
              boxShadow: '0 0 12px rgba(163,230,53,.25)',
            } : {
              background: 'rgba(255,255,255,.03)',
              border: '1.5px solid rgba(255,255,255,.1)',
              color: 'rgba(255,255,255,.5)',
            }}
          >
            <span className="text-[14px]">{isClear ? '✅' : '⬜'}</span>
            <span>성공</span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(isFail ? 'pending' : 'fail')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bebas text-[11px] tracking-wider transition-all active:scale-95"
            style={isFail ? {
              background: 'rgba(239,68,68,.12)',
              border: '1.5px solid rgba(239,68,68,.7)',
              color: '#ef4444',
              boxShadow: '0 0 12px rgba(239,68,68,.25)',
            } : {
              background: 'rgba(255,255,255,.03)',
              border: '1.5px solid rgba(255,255,255,.1)',
              color: 'rgba(255,255,255,.5)',
            }}
          >
            <span className="text-[14px]">{isFail ? '❌' : '⬜'}</span>
            <span>실패</span>
          </button>
        </div>
      )}
    </div>
  );
}
