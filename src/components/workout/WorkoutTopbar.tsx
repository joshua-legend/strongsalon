'use client';

interface WorkoutTopbarProps {
  elapsedSec: number;
}

export default function WorkoutTopbar({ elapsedSec }: WorkoutTopbarProps) {
  const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const s = String(elapsedSec % 60).padStart(2, '0');

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 gap-3 border-b border-neutral-800 bg-neutral-950/97 backdrop-blur-[20px]"
    >
      <div className="flex items-center gap-3">
        <div className="font-bebas text-xl tracking-widest text-orange-500">
          Fit<span className="text-neutral-400">Log</span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-neutral-700 px-3.5 py-1.5 bg-neutral-900">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-orange-500" />
        <div>
          <div className="font-bebas text-xl tracking-wider leading-none text-orange-500">
            {m}:{s}
          </div>
          <div className="text-[8px] font-bebas text-neutral-400">
            WORKOUT TIME
          </div>
        </div>
      </div>
    </header>
  );
}
