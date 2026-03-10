import type { CategoryId, CategorySetting, CategorySettings } from "@/types/categorySettings";
import type { GoalId } from "@/types/goalSetting";
import { DEFAULT_CATEGORY_SETTINGS } from "@/types/categorySettings";

const CATEGORY_KEY = "fitlog-category-settings-v1";
const PRIMARY_GOAL_KEY = "fitlog-primary-goal";

export function loadCategorySettings(): CategorySettings {
  if (typeof window === "undefined") return { ...DEFAULT_CATEGORY_SETTINGS };
  try {
    const raw = localStorage.getItem(CATEGORY_KEY);
    if (!raw) return { ...DEFAULT_CATEGORY_SETTINGS };
    const parsed = JSON.parse(raw) as CategorySettings;
    return {
      inbody: { ...DEFAULT_CATEGORY_SETTINGS.inbody, ...parsed.inbody },
      strength: { ...DEFAULT_CATEGORY_SETTINGS.strength, ...parsed.strength },
      fitness: { ...DEFAULT_CATEGORY_SETTINGS.fitness, ...parsed.fitness },
    };
  } catch {
    return { ...DEFAULT_CATEGORY_SETTINGS };
  }
}

export function saveCategorySettings(settings: CategorySettings): void {
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function saveCategorySetting(id: CategoryId, setting: CategorySetting): void {
  const settings = loadCategorySettings();
  settings[id] = setting;
  saveCategorySettings(settings);
}

export function loadPrimaryGoal(): GoalId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRIMARY_GOAL_KEY);
    if (!raw) return null;
    const id = raw as GoalId;
    if (id === "diet" || id === "strength" || id === "fitness") return id;
    return null;
  } catch {
    return null;
  }
}

export function savePrimaryGoal(goalId: GoalId | null): void {
  try {
    if (goalId) {
      localStorage.setItem(PRIMARY_GOAL_KEY, goalId);
    } else {
      localStorage.removeItem(PRIMARY_GOAL_KEY);
    }
  } catch {
    // ignore
  }
}
