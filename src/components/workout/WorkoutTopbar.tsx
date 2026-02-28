'use client';

interface WorkoutTopbarProps {
  elapsedSec: number;
}

export default function WorkoutTopbar({ elapsedSec }: WorkoutTopbarProps) {
  const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const s = String(elapsedSec % 60).padStart(2, '0');

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 gap-3"
      style={{
        background: '#000',
        borderBottom: '1px solid rgba(163,230,53,.4)',
        boxShadow: '0 0 12px rgba(163,230,53,.25)',
      }}
    >
      {/* Logo + live dot */}
      <div className="flex items-center gap-3">
        <div
          className="font-bebas text-xl tracking-widest"
          style={{
            color: 'rgb(163, 230, 53)',
            textShadow: '0 0 8px rgba(163,230,53,.5)',
          }}
        >
          Fit<span style={{ color: 'rgba(163,230,53,.35)', textShadow: '0 0 8px rgba(163,230,53,.2)' }}>Log</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: 'rgb(163, 230, 53)',
              boxShadow: '0 0 6px rgba(163,230,53,.5)',
            }}
          />
          <span
            className="font-bebas text-[9px] tracking-widest"
            style={{ color: 'rgba(163,230,53,.45)' }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Elapsed timer */}
      <div
        className="flex items-center gap-2.5 rounded-xl px-4 py-2 border"
        style={{
          background: 'rgba(0,0,0,.8)',
          borderColor: 'rgba(163,230,53,.5)',
          boxShadow: '0 0 12px rgba(163,230,53,.3)',
        }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse shrink-0"
          style={{ background: 'rgb(163, 230, 53)', boxShadow: '0 0 6px rgba(163,230,53,.5)' }}
        />
        <div>
          <div
            className="font-bebas text-2xl tracking-wider leading-none"
            style={{
              color: 'rgb(163, 230, 53)',
              textShadow: '0 0 8px rgba(163,230,53,.5)',
            }}
          >
            {m}:{s}
          </div>
          <div
            className="text-[8px] font-bebas tracking-widest text-center"
            style={{ color: 'rgba(163,230,53,.5)', textShadow: '0 0 6px rgba(163,230,53,.3)' }}
          >
            ELAPSED
          </div>
        </div>
      </div>
    </header>
  );
}
