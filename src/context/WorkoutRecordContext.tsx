"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import type { DayWorkoutRecord } from "@/data/workoutHistory";
import { workoutHistory } from "@/data/workoutHistory";
import { useAuth } from "./AuthContext";

interface WorkoutRecordContextValue {
  records: DayWorkoutRecord[];
  appendWorkoutRecord: (record: DayWorkoutRecord) => void;
  getUserWorkoutRecords: () => DayWorkoutRecord[];
  getWorkoutRecordByDate: (dateKey: string, staticRecords: DayWorkoutRecord[]) => DayWorkoutRecord | undefined;
  getLastRecordForExercise: (exerciseName: string, records?: DayWorkoutRecord[]) => { weight: number; reps: number } | null;
}

const WorkoutRecordContext = createContext<WorkoutRecordContextValue | null>(null);

export function WorkoutRecordProvider({ children }: { children: React.ReactNode }) {
  const { accountData, updateAccountData } = useAuth();

  const records = accountData?.workoutRecords ?? [];

  const appendWorkoutRecord = useCallback(
    (record: DayWorkoutRecord) => {
      if (!accountData) return;
      const prev = accountData.workoutRecords;
      const existing = prev.findIndex((r) => r.date === record.date);
      const next =
        existing >= 0
          ? prev.map((r, i) => (i === existing ? record : r))
          : [...prev, record].sort((a, b) => a.date.localeCompare(b.date));
      updateAccountData((p) => ({ ...p, workoutRecords: next }));
    },
    [accountData, updateAccountData]
  );

  const getUserWorkoutRecords = useCallback(() => [...records], [records]);

  const getWorkoutRecordByDate = useCallback(
    (dateKey: string, staticRecords: DayWorkoutRecord[]) => {
      const userRecord = records.find((r) => r.date === dateKey);
      if (userRecord) return userRecord;
      return staticRecords.find((r) => r.date === dateKey);
    },
    [records]
  );

  const getLastRecordForExercise = useCallback(
    (exerciseName: string, recordsParam?: DayWorkoutRecord[]) => {
      const list =
        recordsParam ?? [...records, ...workoutHistory].sort((a, b) => b.date.localeCompare(a.date));
      const norm = (s: string) => s.replace(/\s/g, "");
      for (const rec of list) {
        const ex = rec.exercises.find(
          (e) =>
            norm(e.name).includes(norm(exerciseName)) || norm(exerciseName).includes(norm(e.name))
        );
        if (ex && ex.sets.length > 0) {
          const last = ex.sets[ex.sets.length - 1];
          if (last.weight > 0 && last.reps > 0)
            return { weight: last.weight, reps: last.reps };
        }
      }
      return null;
    },
    [records]
  );

  const value = useMemo(
    () => ({
      records,
      appendWorkoutRecord,
      getUserWorkoutRecords,
      getWorkoutRecordByDate,
      getLastRecordForExercise,
    }),
    [
      records,
      appendWorkoutRecord,
      getUserWorkoutRecords,
      getWorkoutRecordByDate,
      getLastRecordForExercise,
    ]
  );

  return (
    <WorkoutRecordContext.Provider value={value}>{children}</WorkoutRecordContext.Provider>
  );
}

export function useWorkoutRecords() {
  const ctx = useContext(WorkoutRecordContext);
  if (!ctx) throw new Error("useWorkoutRecords must be used within WorkoutRecordProvider");
  return ctx;
}
