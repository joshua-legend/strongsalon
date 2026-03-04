export type PurposeId = "cut" | "bulk" | "strength" | "endure";

export interface PurposeOption {
  id: PurposeId;
  label: string;
  desc: string;
  unit: string;
  weeklyDelta: number;
  metricKey: "weight" | "muscleMass" | "liftMax" | "cardioTime";
}

export interface UserProfile {
  height: number;
  weight: number;
  muscleMass: number | null;
  bodyFatPct: number | null;
  purpose: PurposeOption;
  startValue: number;
  targetValue: number;
  createdAt: string;
}

export interface WeekRecord {
  week: number;
  recorded: number;
  target: number;
  passed: boolean;
}

export interface ActiveQuest {
  currentWeek: number;
  latestMetric: number;
  history: WeekRecord[];
  streak: number;
  bestStreak: number;
}
