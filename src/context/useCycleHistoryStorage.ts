import type { CategoryId } from "@/types/categorySettings";
import type { GoalTarget } from "@/types/goalSetting";

export interface CycleRecord {
  configuredAt: string;
  endedAt: string;
  startValues: Record<string, number> | null;
  goal: GoalTarget | null;
  finalValue: number;
  achieved: boolean;
}

let cycleHistoryData: Record<CategoryId, CycleRecord[]> = {
  inbody: [],
  strength: [],
  fitness: [],
};

export function loadCycleHistory(): Record<CategoryId, CycleRecord[]> {
  return cycleHistoryData;
}

export function appendCycleRecord(
  categoryId: CategoryId,
  record: CycleRecord
): void {
  const list = cycleHistoryData[categoryId] ?? [];
  list.push(record);
  cycleHistoryData[categoryId] = list;
}
