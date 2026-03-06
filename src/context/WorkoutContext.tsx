"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type {
  WeeklyPlan,
  DayPlan,
  PrescriptionDailyLog,
  WeeklyProgress,
  PrescribedExercise,
  ExerciseLog,
  DayType,
} from "@/types";
import type { UserProfile } from "@/types/quest";
import { useQuest } from "./QuestContext";
import { loadAbilityResults } from "@/config/abilityConfig";
import {
  getSplitForTrainingDays,
  generateWorkout,
} from "@/config/workoutPrescription";

const DAILY_LOGS_KEY = "fitlog-daily-logs";
const WEEKLY_PLAN_KEY = "fitlog-weekly-plan";
const WEEKLY_PROGRESS_KEY = "fitlog-weekly-progress";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekNumber(date: Date): number {
  const start = getWeekStart(date);
  const startOfYear = new Date(start.getFullYear(), 0, 1);
  const diff = start.getTime() - startOfYear.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

function loadDailyLogs(): Record<string, PrescriptionDailyLog> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DAILY_LOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, PrescriptionDailyLog>;
      return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

function loadWeeklyPlan(): WeeklyPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WEEKLY_PLAN_KEY);
    if (raw) {
      return JSON.parse(raw) as WeeklyPlan;
    }
  } catch {
    // ignore
  }
  return null;
}

function loadWeeklyProgress(): WeeklyProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WEEKLY_PROGRESS_KEY);
    if (raw) {
      return JSON.parse(raw) as WeeklyProgress;
    }
  } catch {
    // ignore
  }
  return null;
}

function buildAbility1RMs(): Record<string, number> {
  const results = loadAbilityResults();
  const map: Record<string, number> = {};

  if (results.lowerStrength?.equipment) {
    map[results.lowerStrength.equipment] = results.lowerStrength.estimated1RM;
  }
  if (results.upperPush?.equipment) {
    map[results.upperPush.equipment] = results.upperPush.estimated1RM;
  }
  if (results.upperPull?.equipment) {
    map[results.upperPull.equipment] = results.upperPull.estimated1RM;
  }
  if (results.lowerBalance) {
    const { quad, ham, inner, outer } = results.lowerBalance;
    if (quad?.equipment) map[quad.equipment] = quad.est1RM;
    if (ham?.equipment) map[ham.equipment] = ham.est1RM;
    if (inner?.equipment) map[inner.equipment] = inner.est1RM;
    if (outer?.equipment) map[outer.equipment] = outer.est1RM;
  }

  return map;
}

interface WorkoutContextValue {
  weeklyPlan: WeeklyPlan | null;
  dailyLogs: Record<string, PrescriptionDailyLog>;
  weeklyProgress: WeeklyProgress | null;
  getTodayPlan: () => DayPlan | null;
  recordWorkoutComplete: (date: string, exercises: ExerciseLog[], dayType: DayType, dayLabel: string) => void;
  setExerciseCompletedSets: (date: string, equipmentId: string, completedSets: number) => void;
  regenerateWeeklyPlan: () => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useQuest();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [dailyLogs, setDailyLogsState] = useState<Record<string, PrescriptionDailyLog>>({});
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);

  useEffect(() => {
    setDailyLogsState(loadDailyLogs());
    setWeeklyPlan(loadWeeklyPlan());
    setWeeklyProgress(loadWeeklyProgress());
  }, []);

  const saveDailyLogs = useCallback((logs: Record<string, PrescriptionDailyLog>) => {
    setDailyLogsState(logs);
    try {
      localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, []);

  const saveWeeklyPlan = useCallback((plan: WeeklyPlan | null) => {
    setWeeklyPlan(plan);
    if (plan) {
      try {
        localStorage.setItem(WEEKLY_PLAN_KEY, JSON.stringify(plan));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(WEEKLY_PLAN_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const saveWeeklyProgress = useCallback((progress: WeeklyProgress | null) => {
    setWeeklyProgress(progress);
    if (progress) {
      try {
        localStorage.setItem(WEEKLY_PROGRESS_KEY, JSON.stringify(progress));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(WEEKLY_PROGRESS_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const regenerateWeeklyPlan = useCallback(() => {
    if (!userProfile) return;
    const trainingDays = userProfile.trainingDays ?? [1, 3, 5];
    const split = getSplitForTrainingDays(trainingDays);
    if (split.length === 0) return;

    const goalOrPurpose = userProfile.goal ?? userProfile.purpose;
    if (!goalOrPurpose) return;

    const purposeId = userProfile.goal
      ? (userProfile.goal.id === "diet" ? "cut" : userProfile.goal.id === "fitness" ? "endure" : "strength")
      : userProfile.purpose!.id;

    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekNum = getWeekNumber(today);
    const bodyWeight = userProfile.weight;
    const ability1RMs = buildAbility1RMs();

    const days: DayPlan[] = split.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      dayLabel: s.dayLabel,
      dayType: s.dayType,
      exercises: generateWorkout(
        purposeId,
        s.dayType,
        s.dayLabel,
        s.dayOfWeek,
        bodyWeight,
        ability1RMs
      ),
    }));

    const plan: WeeklyPlan = {
      weekNumber: weekNum,
      startDate: weekStart.toISOString().split("T")[0],
      days,
    };
    saveWeeklyPlan(plan);

    const totalTargetSets = days.reduce(
      (sum, d) =>
        sum + d.exercises.reduce((s, e) => s + e.targetSets, 0),
      0
    );
    const progress: WeeklyProgress = {
      weekNumber: weekNum,
      trainingDays,
      completedDays: [],
      totalTargetSets,
      totalCompletedSets: 0,
      dayCompletionRate: 0,
      setCompletionRate: 0,
    };
    saveWeeklyProgress(progress);
  }, [userProfile, saveWeeklyPlan, saveWeeklyProgress]);

  useEffect(() => {
    if (!userProfile) return;
    const trainingDays = userProfile.trainingDays ?? [1, 3, 5];
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const stored = loadWeeklyPlan();
    const storedProgress = loadWeeklyProgress();

    if (!stored || stored.startDate !== weekStartStr) {
      regenerateWeeklyPlan();
      return;
    }
    if (!storedProgress || storedProgress.weekNumber !== stored.weekNumber) {
      const totalTargetSets = stored.days.reduce(
        (sum, d) =>
          sum + d.exercises.reduce((s, e) => s + e.targetSets, 0),
        0
      );
      const logs = loadDailyLogs();
      const completedDays: number[] = [];
      let totalCompletedSets = 0;
      for (const [dateStr, log] of Object.entries(logs)) {
        const d = new Date(dateStr);
        if (d >= weekStart && d < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          completedDays.push(d.getDay() || 7);
          totalCompletedSets += log.totalCompletedSets;
        }
      }
      const progress: WeeklyProgress = {
        weekNumber: stored.weekNumber,
        trainingDays,
        completedDays,
        totalTargetSets,
        totalCompletedSets,
        dayCompletionRate: trainingDays.length > 0 ? completedDays.length / trainingDays.length : 0,
        setCompletionRate: totalTargetSets > 0 ? totalCompletedSets / totalTargetSets : 0,
      };
      saveWeeklyProgress(progress);
    }
  }, [userProfile, regenerateWeeklyPlan, saveWeeklyProgress]);

  const getTodayPlan = useCallback((): DayPlan | null => {
    if (!userProfile || !weeklyPlan) return null;
    const trainingDays = userProfile.trainingDays ?? [1, 3, 5];
    const today = new Date();
    const dow = today.getDay();
    if (!trainingDays.includes(dow)) return null;
    return weeklyPlan.days.find((d) => d.dayOfWeek === dow) ?? null;
  }, [userProfile, weeklyPlan]);

  const recordWorkoutComplete = useCallback(
    (date: string, exercises: ExerciseLog[], dayType: DayType, dayLabel: string) => {
      const totalTargetSets = exercises.reduce((s, e) => s + e.targetSets, 0);
      const totalCompletedSets = exercises.reduce((s, e) => s + e.completedSets, 0);
      const completionRate = totalTargetSets > 0 ? totalCompletedSets / totalTargetSets : 0;

      const log: PrescriptionDailyLog = {
        date,
        dayType,
        exercises,
        totalTargetSets,
        totalCompletedSets,
        completionRate,
        isCompleted: true,
      };

      const next = { ...dailyLogs, [date]: log };
      saveDailyLogs(next);

      if (weeklyProgress && weeklyPlan) {
        const d = new Date(date);
        const weekStart = getWeekStart(new Date());
        const weekStartStr = weekStart.toISOString().split("T")[0];
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

        if (d >= weekStart && d < weekEnd) {
          const completedDays = [...weeklyProgress.completedDays];
          const dow = d.getDay() === 0 ? 7 : d.getDay();
          if (!completedDays.includes(dow)) {
            completedDays.push(dow);
          }
          const allLogs = { ...next };
          let totalCompleted = 0;
          for (const [ds, lg] of Object.entries(allLogs)) {
            const dt = new Date(ds);
            if (dt >= weekStart && dt < weekEnd) {
              totalCompleted += lg.totalCompletedSets;
            }
          }
          const progress: WeeklyProgress = {
            ...weeklyProgress,
            completedDays,
            totalCompletedSets: totalCompleted,
            dayCompletionRate:
              weeklyProgress.trainingDays.length > 0
                ? completedDays.length / weeklyProgress.trainingDays.length
                : 0,
            setCompletionRate:
              weeklyProgress.totalTargetSets > 0
                ? totalCompleted / weeklyProgress.totalTargetSets
                : 0,
          };
          saveWeeklyProgress(progress);
        }
      }
    },
    [dailyLogs, weeklyProgress, weeklyPlan, saveDailyLogs, saveWeeklyProgress]
  );

  const setExerciseCompletedSets = useCallback(
    (date: string, equipmentId: string, completedSets: number) => {
      const log = dailyLogs[date];
      if (!log) return;
      const exercises = log.exercises.map((e) =>
        e.equipmentId === equipmentId ? { ...e, completedSets } : e
      );
      const totalCompletedSets = exercises.reduce((s, e) => s + e.completedSets, 0);
      const completionRate = log.totalTargetSets > 0 ? totalCompletedSets / log.totalTargetSets : 0;
      const updated: PrescriptionDailyLog = {
        ...log,
        exercises,
        totalCompletedSets,
        completionRate,
      };
      saveDailyLogs({ ...dailyLogs, [date]: updated });
    },
    [dailyLogs, saveDailyLogs]
  );

  const value = useMemo(
    () => ({
      weeklyPlan,
      dailyLogs,
      weeklyProgress,
      getTodayPlan,
      recordWorkoutComplete,
      setExerciseCompletedSets,
      regenerateWeeklyPlan,
    }),
    [
      weeklyPlan,
      dailyLogs,
      weeklyProgress,
      getTodayPlan,
      recordWorkoutComplete,
      setExerciseCompletedSets,
      regenerateWeeklyPlan,
    ]
  );

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
