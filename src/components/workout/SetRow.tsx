'use client';

interface SetRowProps {
  setNumber: number;
  weight: number;
  reps: number;
  volume: number;
  onWeightChange: (v: number) => void;
  onRepsChange: (v: number) => void;
  onAdjWeight: (delta: number) => void;
  onAdjReps: (delta: number) => void;
  onDelete: () => void;
  accentColor?: 'orange' | 'purple';
}

export default function SetRow({
  setNumber,
  weight,
  reps,
  volume,
  onWeightChange,
  onRepsChange,
  onAdjWeight,
  onAdjReps,
  onDelete,
  accentColor = 'orange',
}: SetRowProps) {
  const done = weight > 0 && reps > 0;
  const focusBorder = accentColor === 'orange' ? 'rgba(255,77,0,.4)' : 'rgba(168,85,247,.4)';

  return (
    <div
      className="grid grid-cols-[28px_1fr_1fr_52px_28px] gap-2 items-center p-1 rounded-lg hover:bg-white/[0.02] transition-colors"
      style={{ gridTemplateColumns: '28px 1fr 1fr 52px 28px' }}
    >
      <div
        className="flex items-center justify-center rounded-md border flex-shrink-0 w-7 h-7 font-[family-name:var(--font-space)] text-[10px] transition-colors"
        style={{
          background: done ? 'rgba(34,197,94,.1)' : 'var(--s3)',
          borderColor: done ? 'rgba(34,197,94,.25)' : 'var(--border)',
          color: done ? 'var(--green)' : 'var(--muted2)',
        }}
      >
        {setNumber}
      </div>
      <div
        className="flex items-center rounded-lg border overflow-hidden transition-[border-color] focus-within:border-[length:1px] focus-within:border-solid"
        style={{ background: 'var(--s3)', borderColor: 'var(--border)' }}
      >
        <button
          type="button"
          onClick={() => onAdjWeight(-2.5)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5"
          style={{ color: 'var(--muted2)' }}
        >
          −
        </button>
        <input
          type="number"
          value={weight || ''}
          onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
          placeholder="kg"
          min={0}
          step={2.5}
          className="flex-1 text-center bg-transparent border-none outline-none min-w-0 py-0 font-[family-name:var(--font-space)] text-xs"
          style={{ color: 'var(--text)' }}
        />
        <button
          type="button"
          onClick={() => onAdjWeight(2.5)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5"
          style={{ color: 'var(--muted2)' }}
        >
          ＋
        </button>
      </div>
      <div
        className="flex items-center rounded-lg border overflow-hidden transition-[border-color] focus-within:border-[length:1px] focus-within:border-solid"
        style={{ background: 'var(--s3)', borderColor: 'var(--border)' }}
      >
        <button
          type="button"
          onClick={() => onAdjReps(-1)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5"
          style={{ color: 'var(--muted2)' }}
        >
          −
        </button>
        <input
          type="number"
          value={reps || ''}
          onChange={(e) => onRepsChange(parseInt(e.target.value, 10) || 0)}
          placeholder="회"
          min={0}
          step={1}
          className="flex-1 text-center bg-transparent border-none outline-none min-w-0 py-0 font-[family-name:var(--font-space)] text-xs"
          style={{ color: 'var(--text)' }}
        />
        <button
          type="button"
          onClick={() => onAdjReps(1)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5"
          style={{ color: 'var(--muted2)' }}
        >
          ＋
        </button>
      </div>
      <div
        className="text-center font-[family-name:var(--font-space)] text-[10px] transition-colors"
        style={{ color: volume > 0 ? 'var(--og3)' : 'var(--muted2)', fontWeight: volume > 0 ? 700 : undefined }}
      >
        {volume > 0 ? `${volume.toLocaleString()}kg` : '—'}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-colors hover:bg-red-500/10 hover:text-red-500 flex-shrink-0"
        style={{ color: 'var(--muted2)' }}
      >
        ✕
      </button>
    </div>
  );
}
