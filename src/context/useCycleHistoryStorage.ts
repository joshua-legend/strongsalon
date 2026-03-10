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

const CYCLE_HISTORY_KEY = "fitlog-cycle-history-v1";

function loadRaw(): Record<CategoryId, CycleRecord[]> {
  if (typeof window === "undefined") return { inbody: [], strength: [], fitness: [] };
  try {
    const raw = localStorage.getItem(CYCLE_HISTORY_KEY);
    if (!raw) return { inbody: [], strength: [], fitness: [] };
    const parsed = JSON.parse(raw) as Record<string, CycleRecord[]>;
    return {
      inbody: parsed.inbody ?? [],
      strength: parsed.strength ?? [],
      fitness: parsed.fitness ?? [],
    };
  } catch {
    return { inbody: [], strength: [], fitness: [] };
  }
}

export function loadCycleHistory(): Record<CategoryId, CycleRecord[]> {
  return loadRaw();
}

export function appendCycleRecord(
  categoryId: CategoryId,
  record: CycleRecord
): void {
  const history = loadRaw();
  const list = history[categoryId] ?? [];
  list.push(record);
  history[categoryId] = list;
  try {
    localStorage.setItem(CYCLE_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}
