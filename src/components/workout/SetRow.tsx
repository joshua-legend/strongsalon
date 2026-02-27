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
        className={`flex items-center justify-center rounded-md border flex-shrink-0 w-7 h-7 font-bebas text-[10px] transition-colors ${
          done ? 'bg-lime-500/10 border-lime-500/25 text-lime-400' : 'bg-neutral-950/50 border-neutral-800 text-neutral-400'
        }`}
      >
        {setNumber}
      </div>
      <div className="flex items-center rounded-lg border border-neutral-800 overflow-hidden transition-[border-color] focus-within:border-orange-500/40 bg-neutral-950/50">
        <button
          type="button"
          onClick={() => onAdjWeight(-2.5)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-400"
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
          className="flex-1 text-center bg-transparent border-none outline-none min-w-0 py-0 font-bebas text-xs text-white"
        />
        <button
          type="button"
          onClick={() => onAdjWeight(2.5)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-400"
        >
          ＋
        </button>
      </div>
      <div className="flex items-center rounded-lg border border-neutral-800 overflow-hidden transition-[border-color] focus-within:border-orange-500/40 bg-neutral-950/50">
        <button
          type="button"
          onClick={() => onAdjReps(-1)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-400"
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
          className="flex-1 text-center bg-transparent border-none outline-none min-w-0 py-0 font-bebas text-xs text-white"
        />
        <button
          type="button"
          onClick={() => onAdjReps(1)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-400"
        >
          ＋
        </button>
      </div>
      <div
        className={`text-center font-bebas text-[10px] transition-colors ${volume > 0 ? 'text-orange-400 font-bold' : 'text-neutral-400'}`}
      >
        {volume > 0 ? `${volume.toLocaleString()}kg` : '—'}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-colors hover:bg-red-500/10 hover:text-red-500 flex-shrink-0 text-neutral-400"
      >
        ✕
      </button>
    </div>
  );
}
