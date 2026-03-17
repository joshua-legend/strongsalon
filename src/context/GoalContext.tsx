"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { GoalSetting, GoalId } from "@/types/goalSetting";
import type { ActiveQuest, WeekRecord } from "@/types/quest";
import {
  DEFAULT_CATEGORY_SETTING,
  type CategoryId,
  type CategorySetting,
  type CategorySettings,
} from "@/types/categorySettings";
import type { ChartMetricKey } from "@/types/chartData";
import { useChartData } from "./ChartDataContext";
import { useAuth } from "./AuthContext";
import { DEFAULT_CATEGORY_SETTINGS } from "@/types/categorySettings";

function goalIdToCategoryId(goalId: GoalId): CategoryId {
  if (goalId === "diet") return "inbody";
  if (goalId === "strength") return "strength";
  return "fitness";
}

function getPrimaryMetricKey(goalSetting: GoalSetting): ChartMetricKey | null {
  const cat = goalIdToCategoryId(goalSetting.goalId);
  const m = goalSetting.mainMetric;
  if (cat === "inbody") return "inbody.fatPercent";
  if (cat === "strength") {
    if (m === "total") return "strength.total";
    if (m === "squat") return "strength.squat";
    if (m === "bench") return "strength.bench";
    if (m === "deadlift") return "strength.deadlift";
  }
  if (cat === "fitness") {
    if (m === "total") return "fitness.total";
    if (m === "running") return "fitness.running";
    if (m === "rowing") return "fitness.rowing";
    if (m === "skierg") return "fitness.skierg";
  }
  return null;
}

interface GoalContextValue {
  goalSetting: GoalSetting | null;
  activeQuest: ActiveQuest | null;
  categorySettings: CategorySettings;
  primaryGoal: GoalId | null;
  setGoalSetting: (g: GoalSetting | null) => void;
  setActiveQuest: (q: ActiveQuest | null) => void;
  setCategorySetting: (id: CategoryId, setting: CategorySetting) => void;
  setPrimaryGoal: (g: GoalId | null) => void;
  recordWeek: (inputValue: number) => void;
  extendGoal: () => void;
  extendCategory: (
    categoryId: CategoryId,
    newStartValue: number,
    options?: { strengthStartValues?: { squat: number; bench: number; deadlift: number; total: number } }
  ) => void;
  resetCategory: (categoryId: CategoryId, cycleRecord?: { finalValue: number; achieved: boolean }) => void;
  resetGoal: () => void;
  isGoalReached: boolean;
}

const GoalContext = createContext<GoalContextValue | null>(null);

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const { accountData, updateAccountData } = useAuth();
  const { appendChartPoint, addStartPoint, clearChartDataForCategory } = useChartData();
  const [goalSetting, setGoalSettingState] = useState<GoalSetting | null>(null);
  const [activeQuest, setActiveQuestState] = useState<ActiveQuest | null>(null);
  const [categorySettings, setCategorySettingsState] = useState<CategorySettings>(() =>
    structuredClone(DEFAULT_CATEGORY_SETTINGS)
  );
  const [primaryGoal, setPrimaryGoalState] = useState<GoalId | null>(null);

  useEffect(() => {
    if (accountData) {
      setGoalSettingState(accountData.goalSetting);
      setActiveQuestState(accountData.activeQuest);
      setCategorySettingsState(structuredClone(accountData.categorySettings));
      setPrimaryGoalState(accountData.primaryGoal);
    } else {
      setGoalSettingState(null);
      setActiveQuestState(null);
      setCategorySettingsState(structuredClone(DEFAULT_CATEGORY_SETTINGS));
      setPrimaryGoalState(null);
    }
  }, [accountData]);

  const setGoalSetting = useCallback(
    (g: GoalSetting | null) => {
      setGoalSettingState(g);
      updateAccountData((prev) => ({ ...prev, goalSetting: g }));
    },
    [updateAccountData]
  );

  const setActiveQuest = useCallback(
    (q: ActiveQuest | null) => {
      setActiveQuestState(q);
      updateAccountData((prev) => ({ ...prev, activeQuest: q }));
    },
    [updateAccountData]
  );

  const setCategorySetting = useCallback(
    (id: CategoryId, setting: CategorySetting) => {
      setCategorySettingsState((prev) => ({ ...prev, [id]: setting }));
      updateAccountData((prev) => ({
        ...prev,
        categorySettings: { ...prev.categorySettings, [id]: setting },
      }));
    },
    [updateAccountData]
  );

  const setPrimaryGoal = useCallback(
    (g: GoalId | null) => {
      setPrimaryGoalState(g);
      updateAccountData((prev) => ({ ...prev, primaryGoal: g }));
    },
    [updateAccountData]
  );

  const isGoalReached = (() => {
    if (!goalSetting || !activeQuest) return false;
    const { target } = goalSetting;
    const { latestMetric } = activeQuest;
    const { targetValue, weeklyDelta } = target;
    return weeklyDelta < 0 ? latestMetric <= targetValue : latestMetric >= targetValue;
  })();

  const recordWeek = useCallback(
    (inputValue: number) => {
      if (!goalSetting || !activeQuest) return;
      const { target } = goalSetting;
      const { weeklyDelta, targetValue } = target;
      const weekTargetRaw = activeQuest.latestMetric + weeklyDelta;
      const weekTarget = Math.ceil(weekTargetRaw * 100) / 100;

      const passed = weeklyDelta < 0 ? inputValue <= weekTarget : inputValue >= weekTarget;
      const finalReached = weeklyDelta < 0 ? inputValue <= targetValue : inputValue >= targetValue;
      const newLatestMetric = finalReached
        ? targetValue
        : passed
          ? weekTarget
          : activeQuest.latestMetric;

      const newHistory: WeekRecord[] = [
        ...activeQuest.history,
        {
          week: activeQuest.currentWeek,
          recorded: inputValue,
          target: weekTarget,
          passed,
        },
      ];

      setActiveQuest({
        currentWeek: activeQuest.currentWeek + 1,
        latestMetric: newLatestMetric,
        history: newHistory,
        streak: passed ? activeQuest.streak + 1 : 0,
        bestStreak: Math.max(activeQuest.bestStreak, passed ? activeQuest.streak + 1 : 0),
      });

      const metricKey = goalSetting ? getPrimaryMetricKey(goalSetting) : null;
      const catId = primaryGoal ? goalIdToCategoryId(primaryGoal) : null;
      const configuredAt = catId ? categorySettings[catId]?.configuredAt : null;
      if (metricKey && configuredAt) {
        const today = new Date().toISOString().slice(0, 10);
        appendChartPoint(metricKey, { day: 0, value: inputValue, date: today }, configuredAt);
      }
    },
    [goalSetting, activeQuest, setActiveQuest, primaryGoal, categorySettings]
  );

  const extendGoal = useCallback(() => {
    if (!goalSetting || !activeQuest) return;
    const { target } = goalSetting;
    const extraWeeks = 8;
    const newTargetValue = activeQuest.latestMetric + target.weeklyDelta * extraWeeks;

    setGoalSetting({
      ...goalSetting,
      target: {
        ...target,
        targetValue: newTargetValue,
        startValue: activeQuest.latestMetric,
      },
    });
    setActiveQuest({
      currentWeek: 1,
      latestMetric: activeQuest.latestMetric,
      history: [],
      streak: 0,
      bestStreak: activeQuest.bestStreak,
    });
  }, [goalSetting, activeQuest, setGoalSetting, setActiveQuest]);

  const CYCLE_WEEKS = 4;

  const extendCategory = useCallback(
    (
      categoryId: CategoryId,
      newStartValue: number,
      options?: { strengthStartValues?: { squat: number; bench: number; deadlift: number; total: number } }
    ) => {
      const cat = categorySettings[categoryId];
      if (!cat?.isConfigured || !cat.goal) return;

      const { weeklyDelta } = cat.goal;
      const configuredAt = new Date().toISOString().slice(0, 10);
      const endDate = new Date(configuredAt);
      endDate.setDate(endDate.getDate() + 28);

      let newStartValues: Record<string, number>;
      let newTargetValue: number;
      let newAutoPaces = cat.autoPaces;

      if (categoryId === "strength" && options?.strengthStartValues) {
        const sv = options.strengthStartValues;
        newStartValues = { squat: sv.squat, bench: sv.bench, deadlift: sv.deadlift, total: sv.total };
        const metricVal = sv[cat.goal.metric as keyof typeof sv] ?? sv.total;
        newTargetValue = metricVal + weeklyDelta * CYCLE_WEEKS;
        const ap = cat.autoPaces;
        if (ap) {
          const squatDelta = ap.squat?.weeklyDelta ?? weeklyDelta / 3;
          const benchDelta = ap.bench?.weeklyDelta ?? weeklyDelta / 3;
          const deadliftDelta = ap.deadlift?.weeklyDelta ?? weeklyDelta / 3;
          newAutoPaces = {
            squat: { start: sv.squat, target: sv.squat + squatDelta * CYCLE_WEEKS, weeklyDelta: squatDelta },
            bench: { start: sv.bench, target: sv.bench + benchDelta * CYCLE_WEEKS, weeklyDelta: benchDelta },
            deadlift: { start: sv.deadlift, target: sv.deadlift + deadliftDelta * CYCLE_WEEKS, weeklyDelta: deadliftDelta },
          };
        }
      } else {
        newStartValues = cat.startValues ? { ...cat.startValues } : {};
        const metric = cat.goal.metric;
        if (metric) {
          newStartValues[metric] = newStartValue;
        }
        newTargetValue = newStartValue + weeklyDelta * CYCLE_WEEKS;
      }

      const newSetting: CategorySetting = {
        ...cat,
        configuredAt,
        startValues: newStartValues,
        goal: {
          ...cat.goal,
          startValue: newStartValues[cat.goal.metric] ?? newStartValue,
          targetValue: newTargetValue,
          weeklyDelta,
          estimatedWeeks: CYCLE_WEEKS,
          totalWeeks: CYCLE_WEEKS,
        },
        autoPaces: newAutoPaces,
        cycleWeeks: CYCLE_WEEKS,
        cycleEndDate: endDate.toISOString().slice(0, 10),
      };
      setCategorySetting(categoryId, newSetting);

      if (newStartValues && configuredAt) {
        if (categoryId === "inbody") {
          if (typeof newStartValues.fatPercent === "number")
            addStartPoint("inbody.fatPercent", newStartValues.fatPercent, configuredAt);
          if (typeof newStartValues.weight === "number")
            addStartPoint("inbody.weight", newStartValues.weight, configuredAt);
          if (typeof newStartValues.muscleMass === "number")
            addStartPoint("inbody.muscleMass", newStartValues.muscleMass, configuredAt);
        } else if (categoryId === "strength") {
          if (typeof newStartValues.total === "number")
            addStartPoint("strength.total", newStartValues.total, configuredAt);
          if (typeof newStartValues.squat === "number")
            addStartPoint("strength.squat", newStartValues.squat, configuredAt);
          if (typeof newStartValues.bench === "number")
            addStartPoint("strength.bench", newStartValues.bench, configuredAt);
          if (typeof newStartValues.deadlift === "number")
            addStartPoint("strength.deadlift", newStartValues.deadlift, configuredAt);
        } else if (categoryId === "fitness") {
          if (typeof newStartValues.total === "number")
            addStartPoint("fitness.total", newStartValues.total, configuredAt);
          if (typeof newStartValues.running === "number")
            addStartPoint("fitness.running", newStartValues.running, configuredAt);
          if (typeof newStartValues.rowing === "number")
            addStartPoint("fitness.rowing", newStartValues.rowing, configuredAt);
          if (typeof newStartValues.skierg === "number")
            addStartPoint("fitness.skierg", newStartValues.skierg, configuredAt);
        }
      }

      if (primaryGoal && goalIdToCategoryId(primaryGoal) === categoryId) {
        setGoalSetting({
          goalId: primaryGoal,
          category: categoryId,
          mainMetric: cat.goal.metric,
          startValues: newStartValues ?? {},
          target: newSetting.goal!,
          autoPaces: newAutoPaces ?? cat.autoPaces,
        });
        setActiveQuest({
          currentWeek: 1,
          latestMetric: newStartValue,
          history: [],
          streak: 0,
          bestStreak: 0,
        });
      }
    },
    [categorySettings, primaryGoal, setCategorySetting, setGoalSetting, setActiveQuest]
  );

  const resetCategory = useCallback(
    (categoryId: CategoryId, cycleRecord?: { finalValue: number; achieved: boolean }) => {
      const cat = categorySettings[categoryId];
      if (cat?.isConfigured && cycleRecord && cat.configuredAt) {
        const endedAt = new Date().toISOString().slice(0, 10);
        const record = {
          configuredAt: cat.configuredAt,
          endedAt,
          startValues: cat.startValues,
          goal: cat.goal,
          finalValue: cycleRecord.finalValue,
          achieved: cycleRecord.achieved,
        };
        updateAccountData((prev) => {
          const list = [...(prev.cycleHistory[categoryId] ?? []), record];
          return {
            ...prev,
            cycleHistory: { ...prev.cycleHistory, [categoryId]: list },
          };
        });
      }
      clearChartDataForCategory(categoryId);
      setCategorySetting(categoryId, { ...DEFAULT_CATEGORY_SETTING });
      if (primaryGoal && goalIdToCategoryId(primaryGoal) === categoryId) {
        setGoalSetting(null);
        setActiveQuest(null);
        setPrimaryGoal(null);
      }
    },
    [categorySettings, primaryGoal, setCategorySetting, setGoalSetting, setActiveQuest, setPrimaryGoal, updateAccountData]
  );

  const resetGoal = useCallback(() => {
    setGoalSetting(null);
    setActiveQuest(null);
  }, [setGoalSetting, setActiveQuest]);

  return (
    <GoalContext.Provider
      value={{
        goalSetting,
        activeQuest,
        categorySettings,
        primaryGoal,
        setGoalSetting,
        setActiveQuest,
        setCategorySetting,
        setPrimaryGoal,
        recordWeek,
        extendGoal,
        extendCategory,
        resetCategory,
        resetGoal,
        isGoalReached,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

export function useGoal() {
  const ctx = useContext(GoalContext);
  if (!ctx) throw new Error("useGoal must be used within GoalProvider");
  return ctx;
}
