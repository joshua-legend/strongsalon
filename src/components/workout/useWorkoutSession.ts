'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export function useWorkoutSession(isRunning = false) {
  const { showToast } = useToast();
  const [elapsedSec, setElapsedSec] = useState(0);
  const [prBadge, setPrBadge] = useState<{ name: string; diff: number } | null>(null);
  const prTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    setElapsedSec(0);
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRunning]);

  const showPR = useCallback(
    (name: string, diff: number) => {
      if (prTimeoutRef.current) clearTimeout(prTimeoutRef.current);
      setPrBadge({ name, diff });
      prTimeoutRef.current = setTimeout(() => {
        setPrBadge(null);
        prTimeoutRef.current = null;
      }, 6000);
      showToast(`🏅 ${name} 신기록 +${diff.toFixed(1)}kg!`);
    },
    [showToast]
  );

  const resetSession = useCallback(() => {
    setElapsedSec(0);
    setPrBadge(null);
  }, []);

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}분 ${s}초` : `${s}초`;
  };

  return { elapsedSec, prBadge, showPR, resetSession, formatElapsed };
}
