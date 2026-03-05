import type { AbilityResults } from "@/types";

export type AbilityCategoryId = keyof AbilityResults;

export type Grade = "S" | "A" | "B" | "C" | "D" | "F";

export interface TierRow {
  min: number;
  max: number;
  scoreMin: number;
  scoreMax: number;
}

export type TestType = "maxWeight" | "balance" | "repOut";

export const ABILITY_CATEGORIES = [
  {
    id: "lowerStrength" as const,
    label: "하체 근력",
    icon: "🦵",
    color: "#f87171",
    tailwindColor: "red-400",
    testType: "maxWeight" as const,
  },
  {
    id: "upperPush" as const,
    label: "상체 푸쉬",
    icon: "💪",
    color: "#fbbf24",
    tailwindColor: "amber-400",
    testType: "maxWeight" as const,
  },
  {
    id: "upperPull" as const,
    label: "상체 풀",
    icon: "🔗",
    color: "#22d3ee",
    tailwindColor: "cyan-400",
    testType: "maxWeight" as const,
  },
  {
    id: "lowerBalance" as const,
    label: "하체 밸런스",
    icon: "⚖️",
    color: "#a78bfa",
    tailwindColor: "violet-400",
    testType: "balance" as const,
  },
  {
    id: "endurance" as const,
    label: "근지구력",
    icon: "🔥",
    color: "#4ade80",
    tailwindColor: "green-400",
    testType: "repOut" as const,
  },
];

export type AbilityCategory = (typeof ABILITY_CATEGORIES)[number];

export function calcScore(value: number, tiers: TierRow[]): number {
  for (const tier of tiers) {
    if (value >= tier.min && value <= tier.max) {
      const range = tier.max - tier.min;
      const ratio = range > 0 ? (value - tier.min) / range : 1;
      return Math.round(
        tier.scoreMin + ratio * (tier.scoreMax - tier.scoreMin)
      );
    }
  }
  if (value >= tiers[0].min) return 100;
  return 0;
}

export function getGrade(score: number): Grade {
  if (score >= 100) return "S";
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

/**
 * idealMin ~ idealMax 범위 내면 50점, 벗어나면 편차 × 2 감점 (최소 0)
 */
export function calcBalanceScore(
  ratio: number,
  idealMin: number,
  idealMax: number
): number {
  if (ratio >= idealMin && ratio <= idealMax) return 50;
  const deviation =
    ratio < idealMin ? idealMin - ratio : ratio - idealMax;
  return Math.max(0, Math.round(50 - deviation * 2));
}

const STORAGE_KEY = "fitlog-ability-results";

const DEFAULT_RESULTS: AbilityResults = {
  lowerStrength: null,
  upperPush: null,
  upperPull: null,
  lowerBalance: null,
  endurance: null,
};

export function loadAbilityResults(): AbilityResults {
  if (typeof window === "undefined") return DEFAULT_RESULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const keys: (keyof AbilityResults)[] = [
        "lowerStrength",
        "upperPush",
        "upperPull",
        "lowerBalance",
        "endurance",
      ];
      const result: AbilityResults = { ...DEFAULT_RESULTS };
      for (const k of keys) {
        const v = parsed[k];
        if (v != null && typeof v === "object") {
          (result as Record<string, unknown>)[k] = v;
        }
      }
      return result;
    }
  } catch {
    // ignore
  }
  return DEFAULT_RESULTS;
}

export function saveAbilityResults(results: AbilityResults): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // ignore
  }
}
