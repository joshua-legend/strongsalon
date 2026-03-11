import type { DayWorkoutRecord } from "@/data/workoutHistory";

let userWorkoutRecords: DayWorkoutRecord[] = [];

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
