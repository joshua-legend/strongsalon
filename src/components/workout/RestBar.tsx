'use client';

import { useEffect, useRef } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { useToast } from '@/components/ui/Toast';

export default function RestBar() {
  const { restActive, restSeconds, dispatch } = useWorkout();
  const { showToast } = useToast();
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!restActive) return;
    const id = setInterval(() => dispatch({ type: 'TICK_REST' }), 1000);
    return () => clearInterval(id);
  }, [restActive, dispatch]);

  useEffect(() => {
    if (restActive && restSeconds <= 0) {
      showToast('🔔 휴식 완료! 다음 세트 준비하세요');
      dispatch({ type: 'STOP_REST' });

      try {
        if (!audioRef.current) audioRef.current = new AudioContext();
        const ctx = audioRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {}

      try { navigator.vibrate?.([200, 100, 200]); } catch {}
    }
  }, [restActive, restSeconds, dispatch, showToast]);

  if (!restActive) return null;

  const pct = (restSeconds / 90) * 100;

  return (
    <div
      className="px-4 flex items-center gap-3 transition-all duration-300"
      style={{
        height: 48,
        background: 'var(--og-s1, #220c00)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span className="font-space text-[8px] tracking-wider" style={{ color: 'var(--og, var(--orange))' }}>
        REST
      </span>
      <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: 'var(--og-s3, var(--s3))' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'var(--og, var(--orange))',
            transition: 'width 1s linear',
          }}
        />
      </div>
      <span className="font-bebas text-[20px]" style={{ color: 'var(--text)' }}>
        {restSeconds}
      </span>
      <button
        onClick={() => dispatch({ type: 'STOP_REST' })}
        className="font-space text-[8px] px-2 py-1 rounded"
        style={{ background: 'var(--og-s2, var(--s2))', color: 'var(--text3, var(--muted))' }}
      >
        SKIP
      </button>
    </div>
  );
}
