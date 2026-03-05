'use client';

import { useState, useCallback } from 'react';
import type { FreeExercise, SetRecord } from '@/types';
import { useToast } from '@/components/ui/Toast';

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useFreeExercises(
  prData: Record<string, number>,
  showPR: (name: string, diff: number) => void
) {
  const { showToast } = useToast();
  const [freeExercises, setFreeExercises] = useState<Record<string, FreeExercise>>({});

  const selectedFavNames = new Set(Object.values(freeExercises).map((e) => e.name));
  const strengthComplete =
    Object.keys(freeExercises).length >= 1 &&
    Object.values(freeExercises).some((ex) => ex.sets.some((s) => s.weight > 0 && s.reps > 0));

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
      const newSet: SetRecord = { id: nextId('fs'), weight, reps };
      return { ...prev, [exId]: { ...ex, sets: [...ex.sets, newSet] } };
    });
  }, []);

  const copyLastFreeSet = useCallback((exId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex || !ex.sets.length) return prev;
      const last = ex.sets[ex.sets.length - 1];
      return {
        ...prev,
        [exId]: { ...ex, sets: [...ex.sets, { id: nextId('fs'), weight: last.weight, reps: last.reps }] },
      };
    });
  }, []);

  const delFreeSet = useCallback((exId: string, setId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex) return prev;
      return { ...prev, [exId]: { ...ex, sets: ex.sets.filter((s) => s.id !== setId) } };
    });
  }, []);

  const onFSetChange = useCallback(
    (exId: string, setId: string, weight: number, reps: number) => {
      setFreeExercises((prev) => {
        const ex = prev[exId];
        if (!ex) return prev;
        const sets = ex.sets.map((s) => (s.id === setId ? { ...s, weight, reps } : s));
        return { ...prev, [exId]: { ...ex, sets } };
      });
      setFreeExercises((prev) => {
        const ex = prev[exId];
        const pr = ex ? prData[ex.name] : undefined;
        if (pr != null && weight > pr) showPR(ex!.name, weight - pr);
        return prev;
      });
    },
    [prData, showPR]
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

  const resetExercises = useCallback(() => {
    setFreeExercises({});
  }, []);

  return {
    freeExercises,
    selectedFavNames,
    strengthComplete,
    toggleFav,
    addCustomEx,
    addFreeSet,
    copyLastFreeSet,
    delFreeSet,
    onFSetChange,
    removeFreeEx,
    copyPrevRecord,
    resetExercises,
  };
}
