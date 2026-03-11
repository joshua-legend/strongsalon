import type { GoalSetting } from "@/types/goalSetting";
import type { ActiveQuest } from "@/types/quest";

let goalSettingData: GoalSetting | null = null;
let questData: ActiveQuest | null = null;

export function loadGoalSetting(): GoalSetting | null {
  return goalSettingData;
}

export function saveGoalSetting(g: GoalSetting | null): void {
  goalSettingData = g ? structuredClone(g) : null;
}

export function loadQuest(): ActiveQuest | null {
  return questData;
}

export function saveQuest(q: ActiveQuest | null): void {
  questData = q ? structuredClone(q) : null;
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
