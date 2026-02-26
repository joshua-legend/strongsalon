'use client';

import { useApp } from '@/context/AppContext';

const WORKOUT_NAV_BG = {
  dark: 'rgba(26,9,0,.93)',
  light: 'rgba(248,244,240,.97)',
} as const;

interface WorkoutTopbarProps {
  elapsedSec: number;
}

export default function WorkoutTopbar({ elapsedSec }: WorkoutTopbarProps) {
  const { colorMode } = useApp();
  const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const s = String(elapsedSec % 60).padStart(2, '0');

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 gap-3 border-b"
      style={{
        background: WORKOUT_NAV_BG[colorMode],
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="font-[family-name:var(--font-bebas)] text-xl tracking-widest" style={{ color: 'var(--orange)' }}>
          Fit<span style={{ color: 'var(--muted2)' }}>Log</span>
        </div>
      </div>
      <div
        className="flex items-center gap-2 rounded-full border px-3.5 py-1.5"
        style={{ background: 'var(--s2)', borderColor: 'var(--border2)' }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'var(--orange)' }}
        />
        <div>
          <div
            className="font-[family-name:var(--font-bebas)] text-xl tracking-wider leading-none"
            style={{ color: 'var(--orange)' }}
          >
            {m}:{s}
          </div>
          <div className="text-[8px] font-[family-name:var(--font-space)]" style={{ color: 'var(--muted2)' }}>
            WORKOUT TIME
          </div>
        </div>
      </div>
    </header>
  );
}
