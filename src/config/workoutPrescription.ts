import type { PurposeId } from "@/types/quest";
import type { DayType, PrescribedExercise } from "@/types";
import type { EquipmentItem } from "./equipmentConfig";
import {
  LOWER_EQUIPMENT,
  UPPER_PUSH_EQUIPMENT,
  UPPER_PULL_EQUIPMENT,
} from "./equipmentConfig";

export const PURPOSE_CONFIG: Record<
  PurposeId,
  {
    intensityMin: number;
    intensityMax: number;
    reps: number;
    sets: number;
    rest: number;
    exercisesPerDay: number;
    label: string;
  }
> = {
  cut: {
    intensityMin: 0.4,
    intensityMax: 0.5,
    reps: 15,
    sets: 3,
    rest: 35,
    exercisesPerDay: 5,
    label: "체지방 감량",
  },
  bulk: {
    intensityMin: 0.65,
    intensityMax: 0.75,
    reps: 10,
    sets: 4,
    rest: 75,
    exercisesPerDay: 5,
    label: "근육량 증가",
  },
  strength: {
    intensityMin: 0.8,
    intensityMax: 0.9,
    reps: 5,
    sets: 5,
    rest: 150,
    exercisesPerDay: 4,
    label: "스트렝스 향상",
  },
  endure: {
    intensityMin: 0.5,
    intensityMax: 0.6,
    reps: 12,
    sets: 2,
    rest: 20,
    exercisesPerDay: 6,
    label: "기초 체력 증진",
  },
};

const DEFAULT_1RM: Record<string, number> = {
  legpress: 1.5,
  squat: 1.0,
  legext: 0.5,
  lyingcurl: 0.35,
  seatedcurl: 0.35,
  innerthigh: 0.4,
  outerthigh: 0.4,
  chestpress: 0.7,
  incline: 0.6,
  standchest: 0.5,
  shoulderpress: 0.45,
  dipstand: 0.8,
  dipkneel: 0.8,
  pecfly: 0.3,
  latpull: 0.65,
  seatedrow: 0.6,
  longpull: 0.5,
  tbarrow: 0.55,
  pullupstand: 0.6,
  pullupkneel: 0.6,
  reversefly: 0.2,
};

export function roundTo2_5(n: number): number {
  return Math.round(n / 2.5) * 2.5;
}

export function estimateDefault1RM(equipmentId: string, bodyWeight: number): number {
  const ratio = DEFAULT_1RM[equipmentId] ?? 0.5;
  return bodyWeight * ratio;
}

export function getEquipmentForDayType(dayType: DayType): EquipmentItem[] {
  switch (dayType) {
    case "upperPush":
      return [...UPPER_PUSH_EQUIPMENT];
    case "upperPull":
      return [...UPPER_PULL_EQUIPMENT];
    case "upperFull":
      return [...UPPER_PUSH_EQUIPMENT, ...UPPER_PULL_EQUIPMENT];
    case "lowerCompound":
      return LOWER_EQUIPMENT.filter((e) => e.complexityLabel === "복합");
    case "lowerIsolation":
      return LOWER_EQUIPMENT.filter((e) => e.complexityLabel === "단일");
    case "fullBody":
      return [...LOWER_EQUIPMENT, ...UPPER_PUSH_EQUIPMENT, ...UPPER_PULL_EQUIPMENT];
    default:
      return [];
  }
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function generateWorkout(
  purposeId: PurposeId,
  dayType: DayType,
  dayLabel: string,
  dayOfWeek: number,
  userWeight: number,
  ability1RMs: Record<string, number>,
  prevWeights?: Record<string, number>,
  prevCompleted?: Record<string, number>
): PrescribedExercise[] {
  const config = PURPOSE_CONFIG[purposeId];
  const equipmentPool = getEquipmentForDayType(dayType);
  const count = Math.min(config.exercisesPerDay, equipmentPool.length);

  let selected: EquipmentItem[];
  if (purposeId === "cut" || purposeId === "endure") {
    const compounds = equipmentPool.filter((e) => e.complexityLabel === "복합");
    const isolations = equipmentPool.filter((e) => e.complexityLabel === "단일");
    selected = [...compounds.slice(0, 4)];
    if (selected.length < count) {
      selected.push(...isolations.slice(0, count - selected.length));
    }
  } else {
    const compounds = equipmentPool.filter((e) => e.complexityLabel === "복합").slice(0, 3);
    const isolations = equipmentPool.filter((e) => e.complexityLabel === "단일").slice(0, 2);
    selected = [...compounds, ...isolations].slice(0, count);
  }

  return selected.map((equip) => {
    const est1RM =
      ability1RMs[equip.id] ?? estimateDefault1RM(equip.id, userWeight);
    let weight = est1RM * randomBetween(config.intensityMin, config.intensityMax);

    if (prevWeights?.[equip.id] !== undefined && prevCompleted !== undefined) {
      const prev = prevWeights[equip.id];
      const completed = prevCompleted[equip.id] ?? 0;
      const totalTarget = config.reps * config.sets;
      const rate = totalTarget > 0 ? completed / totalTarget : 0;
      if (rate >= 1) weight = prev * 1.025;
      else if (rate >= 0.85) weight = prev;
      else weight = prev * 0.95;
    }

    return {
      equipmentId: equip.id,
      equipmentName: equip.name,
      targetWeight: roundTo2_5(weight),
      targetReps: config.reps,
      targetSets: config.sets,
      restSeconds: config.rest,
    };
  });
}

export function adjustWeight(
  prevWeight: number,
  prevCompleted: number,
  targetReps: number,
  targetSets: number
): number {
  const totalTarget = targetReps * targetSets;
  const rate = totalTarget > 0 ? prevCompleted / totalTarget : 0;
  if (rate >= 1) return roundTo2_5(prevWeight * 1.025);
  if (rate >= 0.85) return prevWeight;
  return roundTo2_5(prevWeight * 0.95);
}

export interface SplitDayDef {
  dayOfWeek: number;
  dayLabel: string;
  dayType: DayType;
}

export function getSplitForTrainingDays(trainingDays: number[]): SplitDayDef[] {
  const n = trainingDays.length;
  if (n < 2 || n > 6) return [];

  const labels: Record<number, string[]> = {
    2: ["Day A", "Day B"],
    3: ["Day A", "Day B", "Day C"],
    4: ["Day A", "Day B", "Day C", "Day D"],
    5: ["Day A", "Day B", "Day C", "Day D", "Day E"],
    6: ["Day A", "Day B", "Day C", "Day D", "Day E", "Day F"],
  };

  const splitMap: Record<number, DayType[]> = {
    2: ["upperFull", "lowerCompound"],
    3: ["upperPush", "lowerCompound", "upperPull"],
    4: ["upperPush", "lowerCompound", "upperPull", "lowerIsolation"],
    5: ["upperPush", "lowerCompound", "upperPull", "lowerIsolation", "fullBody"],
    6: ["upperPush", "lowerCompound", "upperPull", "lowerIsolation", "fullBody", "fullBody"],
  };

  const types = splitMap[n] ?? [];
  const dayLabels = labels[n] ?? [];

  return trainingDays
    .sort((a, b) => a - b)
    .map((dow, i) => ({
      dayOfWeek: dow,
      dayLabel: dayLabels[i] ?? `Day ${i + 1}`,
      dayType: types[i] ?? "fullBody",
    }));
}
