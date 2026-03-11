import type { CategoryId, CategorySetting, CategorySettings } from "@/types/categorySettings";
import type { GoalId } from "@/types/goalSetting";
import { DEFAULT_CATEGORY_SETTINGS } from "@/types/categorySettings";

let categorySettingsData: CategorySettings = structuredClone(DEFAULT_CATEGORY_SETTINGS);
let primaryGoalData: GoalId | null = null;

export function loadCategorySettings(): CategorySettings {
  return categorySettingsData;
}

export function saveCategorySettings(settings: CategorySettings): void {
  categorySettingsData = structuredClone(settings);
}

export function saveCategorySetting(id: CategoryId, setting: CategorySetting): void {
  const settings = loadCategorySettings();
  settings[id] = setting;
  saveCategorySettings(settings);
}

export function loadPrimaryGoal(): GoalId | null {
  return primaryGoalData;
}

export function savePrimaryGoal(goalId: GoalId | null): void {
  primaryGoalData = goalId;
}
