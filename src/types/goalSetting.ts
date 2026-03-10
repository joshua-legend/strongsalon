export type GoalId = "diet" | "strength" | "fitness";

export type GoalCategory = "inbody" | "strength" | "fitness";

export type InbodyMainMetric = "weight" | "muscleMass" | "fatPercent";

export type StrengthMainMetric = "total" | "squat" | "bench" | "deadlift";

export type FitnessMainMetric = "total" | "running" | "rowing" | "skierg";

export interface GoalTarget {
  metric: string;
  startValue: number;
  targetValue: number;
  weeklyDelta: number;
  estimatedWeeks: number;
  /** 4주 고정 */
  totalWeeks?: number;
}

export interface AutoPace {
  start: number;
  target: number;
  weeklyDelta: number;
}

export interface GoalSetting {
  goalId: GoalId;
  category: GoalCategory;
  mainMetric: string;
  startValues: Record<string, number>;
  target: GoalTarget;
  autoPaces: Record<string, AutoPace> | null;
}
