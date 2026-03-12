import type { GoalSetting } from "@/types/goalSetting";
import type { ActiveQuest } from "@/types/quest";

const KEY_GOAL = "strongsalon_goalSetting";
const KEY_QUEST = "strongsalon_quest";

function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function loadGoalSetting(): GoalSetting | null {
  return safeParse<GoalSetting | null>(KEY_GOAL, null);
}

export function saveGoalSetting(g: GoalSetting | null): void {
  safeSet(KEY_GOAL, g ? structuredClone(g) : null);
}

export function loadQuest(): ActiveQuest | null {
  return safeParse<ActiveQuest | null>(KEY_QUEST, null);
}

export function saveQuest(q: ActiveQuest | null): void {
  safeSet(KEY_QUEST, q ? structuredClone(q) : null);
}

export function clearQuestHistory(): void {
  const q = loadQuest();
  const gs = loadGoalSetting();
  if (q && q.history.length > 0) {
    const startValue = gs?.target?.startValue ?? q.latestMetric;
    saveQuest({
      ...q,
      history: [],
      currentWeek: 1,
      latestMetric: startValue,
      streak: 0,
    });
  }
}
