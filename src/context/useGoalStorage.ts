import type { GoalSetting } from "@/types/goalSetting";
import type { ActiveQuest } from "@/types/quest";

const GOAL_KEY = "fitlog-v3-goal";
const QUEST_KEY = "fitlog-active-quest";

export function loadGoalSetting(): GoalSetting | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GoalSetting;
  } catch {
    return null;
  }
}

export function saveGoalSetting(g: GoalSetting | null): void {
  if (g) {
    try {
      localStorage.setItem(GOAL_KEY, JSON.stringify(g));
    } catch {
      // ignore
    }
  } else {
    try {
      localStorage.removeItem(GOAL_KEY);
    } catch {
      // ignore
    }
  }
}

export function loadQuest(): ActiveQuest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveQuest;
  } catch {
    return null;
  }
}

export function saveQuest(q: ActiveQuest | null): void {
  if (q) {
    try {
      localStorage.setItem(QUEST_KEY, JSON.stringify(q));
    } catch {
      // ignore
    }
  } else {
    try {
      localStorage.removeItem(QUEST_KEY);
    } catch {
      // ignore
    }
  }
}

/** 실제기록(history)만 초기화, 이상페이스만 남김 */
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
