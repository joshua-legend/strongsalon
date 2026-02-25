'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useWorkout } from '@/context/WorkoutContext';
import { formatTime } from '@/utils/format';

export default function WorkoutTopbar() {
  const { exitWorkout } = useApp();
  const { elapsedSec, dispatch } = useWorkout();

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK_ELAPSED' }), 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: 56,
        background: 'var(--og, var(--orange))',
      }}
    >
      <button
        onClick={exitWorkout}
        className="text-[16px] text-white/80 hover:text-white"
      >
        ‹ 뒤로
      </button>

      <div className="text-center">
        <p className="text-[11px] font-medium text-white/90">가슴 + 삼두</p>
        <p className="font-space text-[8px] text-white/60">{new Date().toLocaleDateString('ko-KR')}</p>
      </div>

      <span className="font-bebas text-[22px] text-white tracking-wide">
        {formatTime(elapsedSec)}
      </span>
    </div>
  );
}
