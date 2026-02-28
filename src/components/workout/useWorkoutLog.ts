'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  WorkoutCondition,
  FreeExercise,
  SetRecord,
  CardioEntry,
  CardioType,
} from '@/types';
import { useToast } from '@/components/ui/Toast';

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useWorkoutLog() {
  const { showToast } = useToast();
  const [workoutDate, setWorkoutDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [condition, setCondition] = useState<WorkoutCondition>('좋음');
  const [freeExercises, setFreeExercises] = useState<Record<string, FreeExercise>>(
    {}
  );
  const [cardioEntries, setCardioEntries] = useState<CardioEntry[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [prData] = useState<Record<string, number>>({});
  const [prBadge, setPrBadge] = useState<{ name: string; diff: number } | null>(
    null
  );
  const prTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedFavNames = new Set(
    Object.values(freeExercises).map((e) => e.name)
  );

  const strengthComplete =
    Object.keys(freeExercises).length >= 1 &&
    Object.values(freeExercises).some((ex) =>
      ex.sets.some((s) => s.weight > 0 && s.reps > 0)
    );

  const cardioComplete = cardioEntries.some(
    (e) => e.distanceKm > 0 && e.timeMinutes > 0
  );

  const canComplete = strengthComplete && cardioComplete;

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

  const clearAll = useCallback(() => {
    if (!confirm('모든 기록을 초기화할까요?')) return;
    setFreeExercises({});
    setCardioEntries([]);
    setPrBadge(null);
    setElapsedSec(0);
    showToast('🗑 초기화 완료');
  }, [showToast]);

  const completeWorkout = useCallback(() => {
    const validSet = (s: SetRecord) => s.weight > 0 && s.reps > 0;

    const 근력 = Object.values(freeExercises)
      .map((ex) => {
        const sets = ex.sets.filter(validSet).map((s) => ({ weight: s.weight, reps: s.reps }));
        return sets.length ? { name: ex.name, icon: ex.icon, sets } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const 유산소 = cardioEntries
      .filter((e) => e.distanceKm > 0 && e.timeMinutes > 0)
      .map((e) => ({ type: e.type, distanceKm: e.distanceKm, timeMinutes: e.timeMinutes }));

    const payload = { 근력, 유산소 };
    console.log(JSON.stringify(payload, null, 2));

    showToast('✅ 오운완! 챌린지 +1회 🥕');
  }, [showToast, freeExercises, cardioEntries]);

  const addCardio = useCallback((type: CardioType) => {
    setCardioEntries((prev) => [
      ...prev,
      {
        id: nextId('cardio'),
        type,
        distanceKm: 0,
        timeMinutes: 0,
      },
    ]);
  }, []);

  const updateCardio = useCallback(
    (id: string, patch: Partial<Pick<CardioEntry, 'distanceKm' | 'timeMinutes'>>) => {
      setCardioEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    },
    []
  );

  const removeCardio = useCallback((id: string) => {
    setCardioEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleFav = useCallback((icon: string, name: string) => {
    setFreeExercises((prev) => {
      const has = Object.values(prev).some((e) => e.name === name);
      if (has) {
        const next = { ...prev };
        const id = Object.keys(next).find((k) => next[k].name === name);
        if (id) delete next[id];
        return next;
      }
      const id = nextId('fx');
      const newSet: SetRecord = { id: nextId('fs'), weight: 0, reps: 0 };
      return { ...prev, [id]: { icon, name, sets: [newSet] } };
    });
  }, []);

  const addCustomEx = useCallback((name: string) => {
    setFreeExercises((prev) => {
      if (Object.values(prev).some((e) => e.name === name)) return prev;
      const id = nextId('fx');
      const newSet: SetRecord = { id: nextId('fs'), weight: 0, reps: 0 };
      return { ...prev, [id]: { icon: '💪', name, sets: [newSet] } };
    });
  }, []);

  const addFreeSet = useCallback((exId: string, weight = 0, reps = 0) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex) return prev;
      const newSet: SetRecord = {
        id: nextId('fs'),
        weight,
        reps,
      };
      return {
        ...prev,
        [exId]: { ...ex, sets: [...ex.sets, newSet] },
      };
    });
  }, []);

  const copyLastFreeSet = useCallback((exId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex || !ex.sets.length) return prev;
      const last = ex.sets[ex.sets.length - 1];
      return {
        ...prev,
        [exId]: {
          ...ex,
          sets: [
            ...ex.sets,
            { id: nextId('fs'), weight: last.weight, reps: last.reps },
          ],
        },
      };
    });
  }, []);

  const delFreeSet = useCallback((exId: string, setId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex) return prev;
      return {
        ...prev,
        [exId]: { ...ex, sets: ex.sets.filter((s) => s.id !== setId) },
      };
    });
  }, []);

  const onFSetChange = useCallback(
    (exId: string, setId: string, weight: number, reps: number) => {
      setFreeExercises((prev) => {
        const ex = prev[exId];
        if (!ex) return prev;
        const sets = ex.sets.map((s) =>
          s.id === setId ? { ...s, weight, reps } : s
        );
        return { ...prev, [exId]: { ...ex, sets } };
      });
      const ex = freeExercises[exId];
      const pr = ex ? prData[ex.name] : undefined;
      if (pr != null && weight > pr) showPR(ex!.name, weight - pr);
    },
    [prData, freeExercises, showPR]
  );

  const removeFreeEx = useCallback((exId: string) => {
    setFreeExercises((prev) => {
      const next = { ...prev };
      delete next[exId];
      return next;
    });
  }, []);

  const copyPrevRecord = useCallback(() => {
      setFreeExercises((p) => {
        const benchId = Object.keys(p).find((k) => p[k].name === '벤치프레스');
        const id = benchId ?? nextId('fx');
        const ex = p[id] ?? { icon: '🏋️', name: '벤치프레스', sets: [] };
        const sets: SetRecord[] = [
          { id: nextId('fs'), weight: 60, reps: 12 },
          { id: nextId('fs'), weight: 80, reps: 8 },
          { id: nextId('fs'), weight: 95, reps: 5 },
          { id: nextId('fs'), weight: 100, reps: 3 },
        ];
        return { ...p, [id]: { ...ex, sets } };
      });
    showToast('📋 이전 기록 복사 완료!');
  }, [showToast]);

  return {
    workoutDate,
    setWorkoutDate,
    condition,
    setCondition,
    freeExercises,
    cardioEntries,
    elapsedSec,
    prData,
    prBadge,
    selectedFavNames,
    canComplete,
    strengthComplete,
    cardioComplete,
    clearAll,
    completeWorkout,
    addCardio,
    updateCardio,
    removeCardio,
    showPR,
    toggleFav,
    addCustomEx,
    addFreeSet,
    copyLastFreeSet,
    delFreeSet,
    onFSetChange,
    removeFreeEx,
    copyPrevRecord,
  };
}

