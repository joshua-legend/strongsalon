import type { PurposeId } from "@/types/quest";
import type { FreeExercise, SetRecord } from "@/types";

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface GoalPresetItem {
  icon: string;
  name: string;
  setsCount: number;
  defaultReps: number;
}

const CUT_PRESET: GoalPresetItem[] = [
  { icon: "🦵", name: "레그익스텐션", setsCount: 3, defaultReps: 12 },
  { icon: "🦵", name: "라잉레그컬", setsCount: 3, defaultReps: 12 },
  { icon: "⬇️", name: "랫풀다운", setsCount: 3, defaultReps: 12 },
  { icon: "🏋️", name: "체스트프레스", setsCount: 3, defaultReps: 12 },
  { icon: "🏋️", name: "파워레그프레스", setsCount: 3, defaultReps: 12 },
];

const BULK_PRESET: GoalPresetItem[] = [
  { icon: "🏋️", name: "파워레그프레스", setsCount: 4, defaultReps: 10 },
  { icon: "⬇️", name: "랫풀다운", setsCount: 4, defaultReps: 10 },
  { icon: "🏋️", name: "체스트프레스", setsCount: 4, defaultReps: 10 },
  { icon: "🚣", name: "시티드로우", setsCount: 4, defaultReps: 10 },
  { icon: "🏋️", name: "숄더프레스", setsCount: 4, defaultReps: 10 },
  { icon: "🦵", name: "레그익스텐션", setsCount: 4, defaultReps: 10 },
];

const STRENGTH_PRESET: GoalPresetItem[] = [
  { icon: "🏋️", name: "파워레그프레스", setsCount: 4, defaultReps: 5 },
  { icon: "⬇️", name: "랫풀다운", setsCount: 4, defaultReps: 5 },
  { icon: "🏋️", name: "체스트프레스", setsCount: 4, defaultReps: 5 },
  { icon: "🚣", name: "시티드로우", setsCount: 4, defaultReps: 5 },
  { icon: "🏋️", name: "숄더프레스", setsCount: 4, defaultReps: 5 },
];

const ENDURE_PRESET: GoalPresetItem[] = [
  { icon: "🦵", name: "레그익스텐션", setsCount: 2, defaultReps: 12 },
  { icon: "🏋️", name: "체스트프레스", setsCount: 2, defaultReps: 12 },
  { icon: "⬇️", name: "랫풀다운", setsCount: 2, defaultReps: 12 },
];

const PRESET_MAP: Record<PurposeId, GoalPresetItem[]> = {
  cut: CUT_PRESET,
  bulk: BULK_PRESET,
  strength: STRENGTH_PRESET,
  endure: ENDURE_PRESET,
};

export type CardioPresetType = "run" | "cycle" | "row";

const CARDIO_PRESET: Record<PurposeId, CardioPresetType[]> = {
  cut: ["run"],
  bulk: [],
  strength: [],
  endure: ["run", "cycle"],
};

export function getStrengthPresetForPurpose(
  purposeId: PurposeId
): Record<string, FreeExercise> {
  const items = PRESET_MAP[purposeId] ?? CUT_PRESET;
  const result: Record<string, FreeExercise> = {};

  for (const item of items) {
    const exId = nextId("fx");
    const sets: SetRecord[] = Array.from({ length: item.setsCount }, () => ({
      id: nextId("fs"),
      weight: 0,
      reps: item.defaultReps,
      status: 'pending' as const,
    }));
    result[exId] = {
      icon: item.icon,
      name: item.name,
      sets,
    };
  }

  return result;
}

export function getCardioPresetForPurpose(
  purposeId: PurposeId
): CardioPresetType[] {
  return CARDIO_PRESET[purposeId] ?? [];
}
