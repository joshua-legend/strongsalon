import type { CategoryId, CategorySetting, CategorySettings } from "@/types/categorySettings";
import type { GoalId } from "@/types/goalSetting";
import { DEFAULT_CATEGORY_SETTINGS } from "@/types/categorySettings";

const KEY_SETTINGS = "strongsalon_categorySettings";
const KEY_PRIMARY_GOAL = "strongsalon_primaryGoal";

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

export function loadCategorySettings(): CategorySettings {
  const stored = safeParse<CategorySettings | null>(KEY_SETTINGS, null);
  if (stored && typeof stored === "object") return { ...DEFAULT_CATEGORY_SETTINGS, ...stored };
  return structuredClone(DEFAULT_CATEGORY_SETTINGS);
}

export function saveCategorySettings(settings: CategorySettings): void {
  safeSet(KEY_SETTINGS, settings);
}

export function saveCategorySetting(id: CategoryId, setting: CategorySetting): void {
  const settings = loadCategorySettings();
  settings[id] = setting;
  saveCategorySettings(settings);
}

export function loadPrimaryGoal(): GoalId | null {
  return safeParse<GoalId | null>(KEY_PRIMARY_GOAL, null);
}

export function savePrimaryGoal(goalId: GoalId | null): void {
  safeSet(KEY_PRIMARY_GOAL, goalId);
}
