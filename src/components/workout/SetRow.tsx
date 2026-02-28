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
  const isOrange = accentColor === 'orange';

  const inputCellClass = isOrange
    ? 'focus-within:border-lime-400/70 focus-within:shadow-[0_0_18px_rgba(163,230,53,.3)]'
    : 'focus-within:border-purple-500/70 focus-within:shadow-[0_0_18px_rgba(192,132,252,.3)]';

  return (
    <div
      className="grid items-center p-1 rounded-lg transition-colors hover:bg-white/[0.015]"
      style={{ gridTemplateColumns: '28px 1fr 1fr 52px 28px', gap: '8px' }}
    >
      {/* Set number */}
      <div
        className="flex items-center justify-center rounded-md border flex-shrink-0 w-7 h-7 font-bebas text-[10px] transition-all"
        style={
          done
            ? {
                background: 'rgba(163,230,53,.12)',
                borderColor: '#a3e635',
                color: '#a3e635',
                boxShadow: '0 0 10px rgba(163,230,53,.4)',
                textShadow: '0 0 10px #a3e635, 0 0 22px rgba(163,230,53,.6)',
              }
            : {
                background: '#0a0a0a',
                borderColor: 'rgba(255,255,255,.08)',
                color: '#fff',
              }
        }
      >
        {setNumber}
      </div>

      {/* Weight input */}
      <div
        className={`flex items-center rounded-lg border overflow-hidden transition-all ${inputCellClass}`}
        style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
      >
        <button
          type="button"
          onClick={() => onAdjWeight(-2.5)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-600"
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
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-600"
        >
          ＋
        </button>
      </div>

      {/* Reps input */}
      <div
        className={`flex items-center rounded-lg border overflow-hidden transition-all ${inputCellClass}`}
        style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
      >
        <button
          type="button"
          onClick={() => onAdjReps(-1)}
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-600"
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
          className="w-7 h-8 flex items-center justify-center flex-shrink-0 text-[14px] transition-colors hover:bg-white/5 text-neutral-600"
        >
          ＋
        </button>
      </div>

      {/* Volume */}
      <div
        className="text-center font-bebas text-[10px] transition-all"
        style={
          volume > 0
            ? isOrange
              ? { color: 'rgb(163, 230, 53)', textShadow: '0 0 8px rgba(163,230,53,.8)' }
              : { color: '#c084fc', textShadow: '0 0 8px rgba(192,132,252,.8)' }
            : { color: '#fff' }
        }
      >
        {volume > 0 ? `${volume.toLocaleString()}` : '—'}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all hover:bg-red-500/10 hover:text-red-500 flex-shrink-0 text-neutral-700"
      >
        ✕
      </button>
    </div>
  );
}
