'use client';

import { useState, useCallback } from 'react';
import type { WorkoutCondition, CardioEntry, CardioType, SetRecord } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { useWorkoutSession } from './useWorkoutSession';
import { useFreeExercises } from './useFreeExercises';

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useWorkoutLog() {
  const { showToast } = useToast();
  const [workoutDate, setWorkoutDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState<WorkoutCondition>('좋음');
  const [cardioEntries, setCardioEntries] = useState<CardioEntry[]>([]);
  const [prData] = useState<Record<string, number>>({});

  const { elapsedSec, prBadge, showPR, resetSession } = useWorkoutSession();
  const exercises = useFreeExercises(prData, showPR);

  const cardioComplete = cardioEntries.some((e) => e.distanceKm > 0 && e.timeMinutes > 0);
  const canComplete = exercises.strengthComplete && cardioComplete;

  const clearAll = useCallback(() => {
    if (!confirm('모든 기록을 초기화할까요?')) return;
    exercises.resetExercises();
    setCardioEntries([]);
    resetSession();
    showToast('🗑 초기화 완료');
  }, [exercises, resetSession, showToast]);

  const completeWorkout = useCallback(() => {
    const validSet = (s: SetRecord) => s.weight > 0 && s.reps > 0;

    const 근력 = Object.values(exercises.freeExercises)
      .map((ex) => {
        const sets = ex.sets.filter(validSet).map((s) => ({ weight: s.weight, reps: s.reps }));
        return sets.length ? { name: ex.name, icon: ex.icon, sets } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const 유산소 = cardioEntries
      .filter((e) => e.distanceKm > 0 && e.timeMinutes > 0)
      .map((e) => ({ type: e.type, distanceKm: e.distanceKm, timeMinutes: e.timeMinutes }));

    console.log(JSON.stringify({ 근력, 유산소 }, null, 2));
    showToast('✅ 오운완! 챌린지 +1회 🥕');
  }, [exercises.freeExercises, cardioEntries, showToast]);

  const addCardio = useCallback((type: CardioType) => {
    setCardioEntries((prev) => [
      ...prev,
      { id: nextId('cardio'), type, distanceKm: 0, timeMinutes: 0 },
    ]);
  }, []);

  const updateCardio = useCallback(
    (id: string, patch: Partial<Pick<CardioEntry, 'distanceKm' | 'timeMinutes'>>) => {
      setCardioEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    []
  );

  const removeCardio = useCallback((id: string) => {
    setCardioEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return {
    workoutDate,
    setWorkoutDate,
    condition,
    setCondition,
    cardioEntries,
    elapsedSec,
    prData,
    prBadge,
    showPR,
    canComplete,
    cardioComplete,
    clearAll,
    completeWorkout,
    addCardio,
    updateCardio,
    removeCardio,
    ...exercises,
  };
}
