'use client';

import { useState, useCallback } from 'react';
import type { WorkoutCondition, CardioEntry, CardioType, SetRecord } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { useWorkoutSession } from './useWorkoutSession';
import { useFreeExercises } from './useFreeExercises';
import { loadCategorySettings } from '@/context/useCategoryStorage';
import { appendChartPoint } from '@/context/useChartDataStorage';
import { estimate1RM } from '@/utils/estimate1RM';
import type { ChartMetricKey } from '@/types/chartData';

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 운동 이름 → 3대 매핑 (한글 이름 기준) */
const STRENGTH_NAME_MAP: Record<string, 'squat' | 'bench' | 'deadlift'> = {
  스쿼트: 'squat',
  퍼팩트스쿼트: 'squat',
  레그프레스: 'squat',
  파워레그프레스: 'squat',
  벤치프레스: 'bench',
  체스트프레스: 'bench',
  인클라인프레스: 'bench',
  데드리프트: 'deadlift',
  랫풀다운: 'deadlift',
  시티드로우: 'deadlift',
  티바로우: 'deadlift',
};

const CARDI_TYPE_MAP: Record<CardioType, 'running' | 'rowing' | 'skierg' | null> = {
  run: 'running',
  row: 'rowing',
  skierg: 'skierg',
  cycle: null,
};

function mapNameToStrength(name: string): 'squat' | 'bench' | 'deadlift' | null {
  const normalized = name.replace(/\s/g, '');
  const entries = Object.entries(STRENGTH_NAME_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [key, val] of entries) {
    if (normalized.includes(key)) return val;
  }
  return null;
}

function calcPace(distanceKm: number, timeMin: number): number | null {
  if (distanceKm <= 0 || timeMin <= 0) return null;
  return Math.round((timeMin * 60 / distanceKm / 60) * 100) / 100;
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

    const date = workoutDate;

    // chartDataHistory 저장
    const categorySettings = loadCategorySettings();

    // 스트렝스: 3대 1RM 추정 → strength.squat/bench/deadlift/total
    const strengthPoints: Record<string, number> = { squat: 0, bench: 0, deadlift: 0 };
    for (const ex of 근력) {
      const metric = mapNameToStrength(ex.name);
      if (!metric) continue;
      const best1RM = Math.max(
        ...ex.sets.map((s) => estimate1RM(s.weight, s.reps)),
        0
      );
      if (best1RM > strengthPoints[metric]) strengthPoints[metric] = best1RM;
    }
    const total1RM = strengthPoints.squat + strengthPoints.bench + strengthPoints.deadlift;
    const strengthConfiguredAt = categorySettings.strength?.configuredAt;
    if (strengthConfiguredAt) {
      if (strengthPoints.squat > 0)
        appendChartPoint('strength.squat', { day: 0, value: strengthPoints.squat, date }, strengthConfiguredAt);
      if (strengthPoints.bench > 0)
        appendChartPoint('strength.bench', { day: 0, value: strengthPoints.bench, date }, strengthConfiguredAt);
      if (strengthPoints.deadlift > 0)
        appendChartPoint('strength.deadlift', { day: 0, value: strengthPoints.deadlift, date }, strengthConfiguredAt);
      if (total1RM > 0)
        appendChartPoint('strength.total', { day: 0, value: total1RM, date }, strengthConfiguredAt);
    }

    // 체력: 페이스(분/km) → fitness.running/rowing/skierg/total
    const fitnessPaces: Record<string, number> = { running: 0, rowing: 0, skierg: 0 };
    for (const e of 유산소) {
      const metric = CARDI_TYPE_MAP[e.type];
      if (!metric) continue;
      const pace = calcPace(e.distanceKm, e.timeMinutes);
      if (pace != null && (fitnessPaces[metric] === 0 || pace < fitnessPaces[metric]))
        fitnessPaces[metric] = pace;
    }
    const pacesArr = Object.values(fitnessPaces).filter((p) => p > 0);
    const totalPace = pacesArr.length > 0 ? pacesArr.reduce((a, b) => a + b, 0) / pacesArr.length : 0;
    const fitnessConfiguredAt = categorySettings.fitness?.configuredAt;
    if (fitnessConfiguredAt) {
      if (fitnessPaces.running > 0)
        appendChartPoint('fitness.running', { day: 0, value: fitnessPaces.running, date }, fitnessConfiguredAt);
      if (fitnessPaces.rowing > 0)
        appendChartPoint('fitness.rowing', { day: 0, value: fitnessPaces.rowing, date }, fitnessConfiguredAt);
      if (fitnessPaces.skierg > 0)
        appendChartPoint('fitness.skierg', { day: 0, value: fitnessPaces.skierg, date }, fitnessConfiguredAt);
      if (totalPace > 0)
        appendChartPoint('fitness.total', { day: 0, value: totalPace, date }, fitnessConfiguredAt);
    }

    showToast('✅ 오운완! 챌린지 +1회 🥕');
  }, [exercises.freeExercises, cardioEntries, workoutDate, showToast]);

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
