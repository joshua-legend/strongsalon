'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export function useWorkoutSession() {
  const { showToast } = useToast();
  const [elapsedSec, setElapsedSec] = useState(0);
  const [prBadge, setPrBadge] = useState<{ name: string; diff: number } | null>(null);
  const prTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

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

  return { elapsedSec, prBadge, showPR, resetSession };
}
