import type { GoalTarget, AutoPace } from "@/types/goalSetting";

export interface CategorySetting {
  isConfigured: boolean;
  configuredAt: string | null;
  startValues: Record<string, number> | null;
  goal: GoalTarget | null;
  autoPaces: Record<string, AutoPace> | null;
  /** 4주 고정 사이클 */
  cycleWeeks?: number;
  /** configuredAt + 28일 */
  cycleEndDate?: string;
}

export type CategoryId = "inbody" | "strength" | "fitness";

export type CategorySettings = Record<CategoryId, CategorySetting>;

export const DEFAULT_CATEGORY_SETTING: CategorySetting = {
  isConfigured: false,
  configuredAt: null,
  startValues: null,
  goal: null,
  autoPaces: null,
};

export const DEFAULT_CATEGORY_SETTINGS: CategorySettings = {
  inbody: { isConfigured: false, configuredAt: null, startValues: null, goal: null, autoPaces: null },
  strength: { isConfigured: false, configuredAt: null, startValues: null, goal: null, autoPaces: null },
  fitness: { isConfigured: false, configuredAt: null, startValues: null, goal: null, autoPaces: null },
};
