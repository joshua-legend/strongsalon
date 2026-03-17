'use client';

import { useState, useCallback, useEffect } from 'react';
import type { WorkoutCondition, CardioEntry, CardioType, SetRecord } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { useWorkoutSession } from './useWorkoutSession';
import { useFreeExercises } from './useFreeExercises';
import { useChartData } from '@/context/ChartDataContext';
import { useAttendance } from '@/context/AttendanceContext';
import { useWorkoutRecords } from '@/context/WorkoutRecordContext';
import type { DayWorkoutRecord } from '@/data/workoutHistory';
import { workoutHistory } from '@/data/workoutHistory';
import { estimate1RM } from '@/utils/estimate1RM';
import type { ChartMetricKey } from '@/types/chartData';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useGoal } from '@/context/GoalContext';
import { SPLIT_PRESETS, getCardioAutoFill } from '@/data/workoutPresets';

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** YYYY-MM-DD → YYYY-M-D (캘린더 attendMap 키 형식) */
function toAttendanceDateKey(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}-${m}-${d}`;
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

const CARDI_LABELS: Record<CardioType, string> = {
  run: '런닝',
  row: '로잉',
  skierg: '스키에르그',
  cycle: '싸이클',
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

export type WorkoutPhase = 'ready' | 'inProgress' | 'completed';

/** 데모 workoutHistory를 사용하지 않는 계정 (본인 기록만 사용) */
const ACCOUNTS_WITHOUT_DEMO_HISTORY = ['민준'] as const;

export function useWorkoutLog() {
  const { showToast } = useToast();
  const { addAttendance } = useAttendance();
  const { appendChartPoint, chartDataPoints } = useChartData();
  const { selectedSplit } = useApp();
  const { currentAccountId } = useAuth();
  const { categorySettings, extendCategory } = useGoal();
  const { appendWorkoutRecord, getLastRecordForExercise, getUserWorkoutRecords } = useWorkoutRecords();
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>('ready');
  const [completedElapsedSec, setCompletedElapsedSec] = useState(0);
  const [workoutDate, setWorkoutDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState<WorkoutCondition>('좋음');
  const [estMinutes, setEstMinutes] = useState<number>(60);
  const [cardioEntries, setCardioEntries] = useState<CardioEntry[]>([]);
  const [prData] = useState<Record<string, number>>({});

  const strength1RM = (() => {
    const sv = categorySettings.strength?.startValues;
    const fallback = { squat: 0, bench: 0, deadlift: 0 };
    if (!sv) return fallback;

    const getLatest1RM = (
      metricKey: 'squat' | 'bench' | 'deadlift',
    ): number | null => {
      const key: ChartMetricKey = `strength.${metricKey}`;
      const points = chartDataPoints?.[key] ?? [];
      if (points.length === 0) return null;
      const sorted = [...points].sort((a, b) => b.date.localeCompare(a.date));
      const latest = sorted[0];
      return latest.value > 0 ? latest.value : null;
    };

    return {
      squat: getLatest1RM('squat') ?? sv.squat ?? 0,
      bench: getLatest1RM('bench') ?? sv.bench ?? 0,
      deadlift: getLatest1RM('deadlift') ?? sv.deadlift ?? 0,
    };
  })();

  const workoutRecordsForLastRecord =
    currentAccountId && ACCOUNTS_WITHOUT_DEMO_HISTORY.includes(currentAccountId)
      ? getUserWorkoutRecords()
      : [...getUserWorkoutRecords(), ...workoutHistory];

  const getStrengthGoalTarget = useCallback(
    (lift: 'squat' | 'bench' | 'deadlift'): number | null => {
      const ap = categorySettings.strength?.autoPaces?.[lift];
      if (!ap?.start || !ap?.target || ap.target <= 0) {
        const g = categorySettings.strength?.goal;
        if (g?.metric === lift && g.targetValue > 0) return g.targetValue;
        return null;
      }
      const configuredAt = categorySettings.strength?.configuredAt;
      const cycleWeeks = categorySettings.strength?.cycleWeeks ?? 4;
      if (!configuredAt) return ap.target;
      const today = workoutDate || new Date().toISOString().split('T')[0];
      const startMs = new Date(configuredAt).getTime();
      const todayMs = new Date(today).getTime();
      const daysElapsed = Math.max(0, (todayMs - startMs) / (24 * 60 * 60 * 1000));
      const weeksElapsed = Math.min(daysElapsed / 7, cycleWeeks);
      const currentTarget = ap.start + ap.weeklyDelta * weeksElapsed;
      return Math.min(currentTarget, ap.target);
    },
    [categorySettings.strength, workoutDate]
  );

  const autoFillOptions = {
    getLastRecord: (name: string) =>
      getLastRecordForExercise(name, workoutRecordsForLastRecord),
    getStrength1RM: () => strength1RM,
    getStrengthGoalTarget,
    condition,
    estMinutes,
  };

  const { elapsedSec, prBadge, showPR, resetSession, formatElapsed } = useWorkoutSession(
    workoutPhase === 'inProgress'
  );
  const exercises = useFreeExercises(prData, showPR, autoFillOptions);

  useEffect(() => {
    if (selectedSplit && exercises.loadPreset) {
      const preset = SPLIT_PRESETS.find((p) => p.id === selectedSplit);
      if (preset && strength1RM.squat + strength1RM.bench + strength1RM.deadlift > 0) {
        exercises.loadPreset(
          preset.exercises,
          strength1RM,
          "hypertrophy",
          condition,
          estMinutes,
          getStrengthGoalTarget
        );
      }
    }
  }, [selectedSplit, condition, estMinutes, getStrengthGoalTarget, strength1RM.squat, strength1RM.bench, strength1RM.deadlift, exercises.loadPreset]);

  const startWorkout = useCallback(() => {
    setWorkoutPhase('inProgress');
  }, []);

  const cardioComplete = cardioEntries.some((e) => e.distanceKm > 0 && e.timeMinutes > 0);
  const canComplete = exercises.strengthComplete && cardioComplete;

  const hasAnyExercise = exercises.orderedIds.length > 0 || cardioEntries.length > 0;
  const allStrengthFilled =
    exercises.orderedIds.length === 0 ||
    exercises.orderedIds.every((id) =>
      (exercises.freeExercises[id]?.sets ?? []).some((s) => s.weight > 0 && s.reps > 0)
    );
  const allCardioFilled =
    cardioEntries.length === 0 ||
    cardioEntries.every((e) => e.distanceKm > 0 && e.timeMinutes > 0);
  const isWorkoutReady = hasAnyExercise && allStrengthFilled && allCardioFilled;

  const clearAll = useCallback(() => {
    if (!confirm('모든 기록을 초기화할까요?')) return;
    exercises.resetExercises();
    setCardioEntries([]);
    setWorkoutPhase('ready');
    resetSession();
    showToast('🗑 초기화 완료');
  }, [exercises, resetSession, showToast]);

  const completeWorkout = useCallback(() => {
    const clearedSet = (s: SetRecord) => s.weight > 0 && s.reps > 0 && s.status === 'clear';

    const 근력 = Object.values(exercises.freeExercises)
      .map((ex) => {
        const sets = ex.sets.filter(clearedSet).map((s) => ({ weight: s.weight, reps: s.reps }));
        return sets.length ? { name: ex.name, icon: ex.icon, sets } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const 유산소 = cardioEntries
      .filter((e) => e.distanceKm > 0 && e.timeMinutes > 0)
      .map((e) => ({ type: e.type, distanceKm: e.distanceKm, timeMinutes: e.timeMinutes }));

    const date = workoutDate;

    // chartDataHistory 저장
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
    const strengthConfiguredAt = (() => {
      if (categorySettings?.strength?.configuredAt) return categorySettings.strength.configuredAt;
      let minDate: string | null = null;
      for (const key of ['strength.squat', 'strength.bench', 'strength.deadlift'] as const) {
        const arr = chartDataPoints[key] ?? [];
        for (const p of arr) {
          if (!minDate || p.date < minDate) minDate = p.date;
        }
      }
      return minDate ?? date;
    })();
    if (strengthPoints.squat > 0)
      appendChartPoint('strength.squat', { day: 0, value: strengthPoints.squat, date }, strengthConfiguredAt);
    if (strengthPoints.bench > 0)
      appendChartPoint('strength.bench', { day: 0, value: strengthPoints.bench, date }, strengthConfiguredAt);
    if (strengthPoints.deadlift > 0)
      appendChartPoint('strength.deadlift', { day: 0, value: strengthPoints.deadlift, date }, strengthConfiguredAt);
    if (total1RM > 0)
      appendChartPoint('strength.total', { day: 0, value: total1RM, date }, strengthConfiguredAt);

    // 목표 초과 시 자동 갱신: 기록된 1RM이 목표를 넘으면 새 목표로 갱신
    const strengthGoal = categorySettings?.strength?.goal;
    const metric = strengthGoal?.metric;
    const exceeded =
      strengthGoal &&
      (metric === "total"
        ? total1RM >= strengthGoal.targetValue
        : metric === "squat"
          ? strengthPoints.squat >= strengthGoal.targetValue
          : metric === "bench"
            ? strengthPoints.bench >= strengthGoal.targetValue
            : metric === "deadlift"
              ? strengthPoints.deadlift >= strengthGoal.targetValue
              : false);
    if (exceeded) {
      const sv = categorySettings.strength?.startValues ?? {};
      const merged = {
        squat: strengthPoints.squat > 0 ? strengthPoints.squat : (sv.squat ?? 0),
        bench: strengthPoints.bench > 0 ? strengthPoints.bench : (sv.bench ?? 0),
        deadlift: strengthPoints.deadlift > 0 ? strengthPoints.deadlift : (sv.deadlift ?? 0),
        total: 0,
      };
      merged.total = merged.squat + merged.bench + merged.deadlift;
      const metricStart = merged[metric as keyof typeof merged] ?? merged.total;
      extendCategory('strength', metricStart, { strengthStartValues: merged });
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
    const fitnessConfiguredAt = (() => {
      if (categorySettings?.fitness?.configuredAt) return categorySettings.fitness.configuredAt;
      let minDate: string | null = null;
      for (const key of ['fitness.running', 'fitness.rowing', 'fitness.skierg'] as const) {
        const arr = chartDataPoints[key] ?? [];
        for (const p of arr) {
          if (!minDate || p.date < minDate) minDate = p.date;
        }
      }
      return minDate ?? date;
    })();
    if (fitnessPaces.running > 0)
      appendChartPoint('fitness.running', { day: 0, value: fitnessPaces.running, date }, fitnessConfiguredAt);
    if (fitnessPaces.rowing > 0)
      appendChartPoint('fitness.rowing', { day: 0, value: fitnessPaces.rowing, date }, fitnessConfiguredAt);
    if (fitnessPaces.skierg > 0)
      appendChartPoint('fitness.skierg', { day: 0, value: fitnessPaces.skierg, date }, fitnessConfiguredAt);
    if (totalPace > 0)
      appendChartPoint('fitness.total', { day: 0, value: totalPace, date }, fitnessConfiguredAt);

    addAttendance(toAttendanceDateKey(date), 'self');

    const workoutRecord: DayWorkoutRecord = {
      date: toAttendanceDateKey(date),
      type: 'self',
      exercises: 근력.map((ex) => ({
        icon: ex.icon,
        name: ex.name,
        sets: ex.sets.map((s) => ({ weight: s.weight, reps: s.reps })),
      })),
      durationSec: elapsedSec,
      condition,
    };
    if (유산소.length > 0) {
      const cardioValues = 유산소.map((e) =>
        e.distanceKm > 0 ? `${e.distanceKm}km / ${e.timeMinutes}분` : `${e.timeMinutes}분`
      );
      workoutRecord.cardio = {
        type: 유산소[0].type,
        label: CARDI_LABELS[유산소[0].type],
        value: cardioValues.join(', '),
      };
    }
    appendWorkoutRecord(workoutRecord);

    window.dispatchEvent(new Event('chartRefresh'));
    setCompletedElapsedSec(elapsedSec);
    setWorkoutPhase('completed');
    const goalExtended = !!exceeded;
    showToast(goalExtended ? '✅ 오운완! 목표 달성 → 새 목표로 갱신됐어요 🎯' : '✅ 오운완! 챌린지 +1회 🥕');
  }, [exercises.freeExercises, cardioEntries, workoutDate, showToast, addAttendance, elapsedSec, categorySettings, chartDataPoints, appendChartPoint, appendWorkoutRecord, extendCategory]);

  const addCardio = useCallback((type: CardioType) => {
    const { distanceKm, timeMinutes } = getCardioAutoFill(type, condition, estMinutes);
    setCardioEntries((prev) => [
      ...prev,
      { id: nextId('cardio'), type, distanceKm, timeMinutes, checked: false },
    ]);
  }, [condition, estMinutes]);

  /** 유산소 토글: 이미 있으면 제거, 없으면 추가 (운동시간·컨디션 기반 자동 입력) */
  const toggleCardio = useCallback((type: CardioType) => {
    setCardioEntries((prev) => {
      const exists = prev.some((e) => e.type === type);
      if (exists) return prev.filter((e) => e.type !== type);
      const { distanceKm, timeMinutes } = getCardioAutoFill(type, condition, estMinutes);
      return [...prev, { id: nextId('cardio'), type, distanceKm, timeMinutes, checked: false }];
    });
  }, [condition, estMinutes]);

  const updateCardio = useCallback(
    (id: string, patch: Partial<Pick<CardioEntry, 'distanceKm' | 'timeMinutes'>>) => {
      setCardioEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    []
  );

  const removeCardio = useCallback((id: string) => {
    setCardioEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleCardioCheck = useCallback((id: string) => {
    setCardioEntries((prev) => prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e)));
  }, []);

  const allCardioChecked =
    cardioEntries.length === 0 ||
    cardioEntries.every((e) => e.checked);

  return {
    workoutDate,
    setWorkoutDate,
    condition,
    setCondition,
    estMinutes,
    setEstMinutes,
    cardioEntries,
    elapsedSec,
    prData,
    prBadge,
    showPR,
    canComplete,
    cardioComplete,
    isWorkoutReady,
    workoutPhase,
    completedElapsedSec,
    formatElapsed,
    startWorkout,
    clearAll,
    completeWorkout,
    addCardio,
    toggleCardio,
    updateCardio,
    removeCardio,
    toggleCardioCheck,
    allCardioChecked,
    ...exercises,
  };
}
