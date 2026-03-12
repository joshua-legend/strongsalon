import type { DayWorkoutRecord } from "@/data/workoutHistory";
import { workoutHistory } from "@/data/workoutHistory";

const KEY_RECORDS = "strongsalon_workoutRecords";

function loadUserRecords(): DayWorkoutRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_RECORDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DayWorkoutRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUserRecords(records: DayWorkoutRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_RECORDS, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

let userWorkoutRecords: DayWorkoutRecord[] = loadUserRecords();

/** 종목명으로 가장 최근 운동 기록에서 무게/횟수 반환 */
export function getLastRecordForExercise(
  exerciseName: string,
  records?: DayWorkoutRecord[]
): { weight: number; reps: number } | null {
  const list = records ?? [...userWorkoutRecords, ...workoutHistory].sort(
    (a, b) => b.date.localeCompare(a.date)
  );
  const norm = (s: string) => s.replace(/\s/g, "");
  for (const rec of list) {
    const ex = rec.exercises.find(
      (e) => norm(e.name).includes(norm(exerciseName)) || norm(exerciseName).includes(norm(e.name))
    );
    if (ex && ex.sets.length > 0) {
      const last = ex.sets[ex.sets.length - 1];
      if (last.weight > 0 && last.reps > 0)
        return { weight: last.weight, reps: last.reps };
    }
  }
  return null;
}

export function appendWorkoutRecord(record: DayWorkoutRecord): void {
  const existing = userWorkoutRecords.findIndex((r) => r.date === record.date);
  if (existing >= 0) {
    userWorkoutRecords = [...userWorkoutRecords];
    userWorkoutRecords[existing] = record;
  } else {
    userWorkoutRecords = [...userWorkoutRecords, record].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }
  saveUserRecords(userWorkoutRecords);
}

export function getUserWorkoutRecords(): DayWorkoutRecord[] {
  return [...userWorkoutRecords];
}

export function getWorkoutRecordByDate(
  dateKey: string,
  staticRecords: DayWorkoutRecord[]
): DayWorkoutRecord | undefined {
  const userRecord = userWorkoutRecords.find((r) => r.date === dateKey);
  if (userRecord) return userRecord;
  return staticRecords.find((r) => r.date === dateKey);
}
