import type { GoalId } from "@/types/goalSetting";
import type { DailyLog, ScoreGrade } from "@/types/workout";
import {
  LOWER_EQUIPMENT,
  UPPER_PUSH_EQUIPMENT,
  UPPER_PULL_EQUIPMENT,
} from "./equipmentConfig";

/** Epley 공식: 1RM ≈ weight × (1 + reps/30) */
export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export interface ScoreBreakdown {
  volume: number;
  sets: number;
  cardio: number;
  variety?: number;
  consistency?: number;
}

const DIET_SCORING = {
  volumeWeight: 0.4,
  setsWeight: 0.3,
  cardioWeight: 0.3,
  maxVolume: 5000,
  maxSets: 20,
  maxCardioMin: 60,
};

const STRENGTH_SCORING = {
  volumeWeight: 0.5,
  setsWeight: 0.3,
  varietyWeight: 0.2,
  maxVolume: 10000,
  maxSets: 25,
  minMuscleGroups: 3,
};

const FITNESS_SCORING = {
  cardioWeight: 0.6,
  volumeWeight: 0.2,
  setsWeight: 0.2,
  maxCardioMin: 90,
  maxVolume: 3000,
  maxSets: 15,
};

function getMuscleGroupsFromLogs(logs: DailyLog[]): Set<string> {
  const groups = new Set<string>();
  const all = [...LOWER_EQUIPMENT, ...UPPER_PUSH_EQUIPMENT, ...UPPER_PULL_EQUIPMENT];
  const idToGroup: Record<string, string> = {};
  all.forEach((e) => {
    const group = e.targetMuscle?.split(",")[0]?.trim() ?? e.id;
    idToGroup[e.id] = group;
  });
  logs.forEach((log) => {
    log.exercises.forEach((ex) => {
      const g = idToGroup[ex.equipmentId] ?? "custom";
      groups.add(g);
    });
  });
  return groups;
}

export function calcWeeklyTrainingScore(
  goalId: GoalId,
  weeklyLogs: DailyLog[],
  bodyWeight: number,
  _prevWeekData?: { score: number; breakdown: ScoreBreakdown }
): { score: number; breakdown: ScoreBreakdown } {
  const completedDays = weeklyLogs.filter((l) => l.isCompleted);
  let totalVolume = 0;
  let totalSets = 0;
  let totalCardioMin = 0;

  completedDays.forEach((log) => {
    log.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed && s.weight > 0 && s.reps > 0) {
          totalVolume += s.weight * s.reps;
          totalSets += 1;
        }
      });
    });
    (log.cardio ?? []).forEach((c) => {
      totalCardioMin += c.minutes;
    });
  });

  let score = 0;
  const breakdown: ScoreBreakdown = { volume: 0, sets: 0, cardio: 0 };

  if (goalId === "diet") {
    const vPct = Math.min(1, totalVolume / DIET_SCORING.maxVolume);
    const sPct = Math.min(1, totalSets / DIET_SCORING.maxSets);
    const cPct = Math.min(1, totalCardioMin / DIET_SCORING.maxCardioMin);
    breakdown.volume = vPct * 100;
    breakdown.sets = sPct * 100;
    breakdown.cardio = cPct * 100;
    score =
      vPct * DIET_SCORING.volumeWeight * 100 +
      sPct * DIET_SCORING.setsWeight * 100 +
      cPct * DIET_SCORING.cardioWeight * 100;
  } else if (goalId === "strength") {
    const vPct = Math.min(1, totalVolume / STRENGTH_SCORING.maxVolume);
    const sPct = Math.min(1, totalSets / STRENGTH_SCORING.maxSets);
    const groups = getMuscleGroupsFromLogs(completedDays);
    const varietyPct = Math.min(1, groups.size / STRENGTH_SCORING.minMuscleGroups);
    breakdown.volume = vPct * 100;
    breakdown.sets = sPct * 100;
    breakdown.variety = varietyPct * 100;
    score =
      vPct * STRENGTH_SCORING.volumeWeight * 100 +
      sPct * STRENGTH_SCORING.setsWeight * 100 +
      varietyPct * STRENGTH_SCORING.varietyWeight * 100;
  } else {
    const cPct = Math.min(1, totalCardioMin / FITNESS_SCORING.maxCardioMin);
    const vPct = Math.min(1, totalVolume / FITNESS_SCORING.maxVolume);
    const sPct = Math.min(1, totalSets / FITNESS_SCORING.maxSets);
    breakdown.cardio = cPct * 100;
    breakdown.volume = vPct * 100;
    breakdown.sets = sPct * 100;
    score =
      cPct * FITNESS_SCORING.cardioWeight * 100 +
      vPct * FITNESS_SCORING.volumeWeight * 100 +
      sPct * FITNESS_SCORING.setsWeight * 100;
  }

  return { score: Math.round(Math.min(100, score)), breakdown };
}

export function getScoreGrade(score: number): ScoreGrade {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}
