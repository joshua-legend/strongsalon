"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ChartDataPoint, ChartMetricKey } from "@/types/chartData";
import type { CategoryId } from "@/types/categorySettings";
import { useAuth } from "./AuthContext";

export type ChartDataHistory = Record<ChartMetricKey, ChartDataPoint[]>;

const EMPTY_CHART: ChartDataHistory = {
  "inbody.fatPercent": [],
  "inbody.weight": [],
  "inbody.muscleMass": [],
  "strength.squat": [],
  "strength.bench": [],
  "strength.deadlift": [],
  "strength.total": [],
  "fitness.running": [],
  "fitness.rowing": [],
  "fitness.skierg": [],
  "fitness.total": [],
};

function daysSince(startDate: string, targetDate: string): number {
  const start = new Date(startDate).getTime();
  const target = new Date(targetDate).getTime();
  return Math.floor((target - start) / (1000 * 60 * 60 * 24));
}

interface ChartDataContextValue {
  chartDataPoints: ChartDataHistory;
  getChartPoints: (metricKey: ChartMetricKey, configuredAt: string | null) => ChartDataPoint[];
  appendChartPoint: (metricKey: ChartMetricKey, point: ChartDataPoint, configuredAt: string) => void;
  addStartPoint: (metricKey: ChartMetricKey, value: number, configuredAt: string) => void;
  clearChartDataForCategory: (categoryId: CategoryId) => void;
  seedChartData: (data: ChartDataHistory) => void;
}

const ChartDataContext = createContext<ChartDataContextValue | null>(null);

export function ChartDataProvider({ children }: { children: React.ReactNode }) {
  const { accountData, updateAccountData } = useAuth();
  const [chartDataPoints, setChartDataPoints] = useState<ChartDataHistory>(() =>
    structuredClone(accountData?.chartDataPoints ?? EMPTY_CHART)
  );

  useEffect(() => {
    const source = accountData?.chartDataPoints ?? EMPTY_CHART;
    setChartDataPoints(structuredClone(source));
  }, [accountData]);

  const getChartPoints = useCallback(
    (metricKey: ChartMetricKey, configuredAt: string | null): ChartDataPoint[] => {
      if (!configuredAt) return [];
      const arr = chartDataPoints[metricKey] ?? [];
      return arr.filter((p) => p.day >= 0);
    },
    [chartDataPoints]
  );

  const appendChartPoint = useCallback(
    (metricKey: ChartMetricKey, point: ChartDataPoint, configuredAt: string) => {
      const day = daysSince(configuredAt, point.date);
      const newPoint: ChartDataPoint = { day, value: point.value, date: point.date };

      setChartDataPoints((prev) => {
        const arr = prev[metricKey] ?? [];
        const existingIdx = arr.findIndex((p) => p.date === point.date);
        let next: ChartDataPoint[];
        if (existingIdx >= 0) {
          next = [...arr];
          next[existingIdx] = newPoint;
        } else {
          next = [...arr, newPoint].sort((a, b) => a.day - b.day);
        }
        const result = { ...prev, [metricKey]: next };
        queueMicrotask(() => updateAccountData((p) => ({ ...p, chartDataPoints: result })));
        return result;
      });
    },
    [updateAccountData]
  );

  const addStartPoint = useCallback(
    (metricKey: ChartMetricKey, value: number, configuredAt: string) => {
      appendChartPoint(metricKey, { day: 0, value, date: configuredAt }, configuredAt);
    },
    [appendChartPoint]
  );

  const CATEGORY_METRICS: Record<CategoryId, ChartMetricKey[]> = {
    inbody: ["inbody.weight", "inbody.muscleMass", "inbody.fatPercent"],
    strength: ["strength.squat", "strength.bench", "strength.deadlift", "strength.total"],
    fitness: ["fitness.running", "fitness.rowing", "fitness.skierg", "fitness.total"],
  };

  const clearChartDataForCategory = useCallback(
    (categoryId: CategoryId) => {
      const keys = CATEGORY_METRICS[categoryId] ?? [];
      setChartDataPoints((prev) => {
        const next = { ...prev };
        for (const key of keys) {
          delete next[key];
        }
        queueMicrotask(() => updateAccountData((p) => ({ ...p, chartDataPoints: next })));
        return next;
      });
    },
    [updateAccountData]
  );

  const seedChartData = useCallback(
    (data: ChartDataHistory) => {
      const cloned = structuredClone(data);
      setChartDataPoints(cloned);
      updateAccountData((prev) => ({ ...prev, chartDataPoints: cloned }));
    },
    [updateAccountData]
  );

  const value: ChartDataContextValue = {
    chartDataPoints,
    getChartPoints,
    appendChartPoint,
    addStartPoint,
    clearChartDataForCategory,
    seedChartData,
  };

  return (
    <ChartDataContext.Provider value={value}>{children}</ChartDataContext.Provider>
  );
}

export function useChartData() {
  const ctx = useContext(ChartDataContext);
  if (!ctx) throw new Error("useChartData must be used within ChartDataProvider");
  return ctx;
}
