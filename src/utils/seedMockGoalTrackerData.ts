/**
 * 골트래커 UI 검토용 더미 데이터 시드
 * localStorage에 인바디/스트렝스/체력 그래프용 데이터 주입
 */

import type { ChartDataPoint, ChartMetricKey } from "@/types/chartData";
import type { ChartDataHistory } from "@/context/useChartDataStorage";
import {
  mockGoalSetting,
  mockActiveQuest,
  mockCategorySettings,
  mockInbodyHistory,
} from "@/data/mockUserData";
import { saveGoalSetting } from "@/context/useGoalStorage";
import { saveQuest } from "@/context/useGoalStorage";
import { saveCategorySettings } from "@/context/useCategoryStorage";
import { savePrimaryGoal } from "@/context/useCategoryStorage";
import { saveChartDataHistory } from "@/context/useChartDataStorage";

const INBODY_HISTORY_KEY = "fitlog-inbody-history";

/** fitness 카테고리 설정 추가 (mockUserData에 없음) - 페이스 분/km, 낮을수록 좋음 */
const FITNESS_CATEGORY_SETTING = {
  isConfigured: true,
  configuredAt: "2026-02-10",
  startValues: { total: 5.2, running: 6, rowing: 4.5, skierg: 5.2 },
  goal: {
    metric: "running",
    startValue: 6,
    targetValue: 5.2,
    weeklyDelta: -0.2,
    estimatedWeeks: 4,
    totalWeeks: 4,
  },
  autoPaces: null,
  cycleWeeks: 4,
  cycleEndDate: "2026-03-10",
};

/** 스트렝스/체력 차트용 포인트 (day 0, 7, 14, 21) */
const CHART_POINTS: Record<ChartMetricKey, ChartDataPoint[]> = {
  "inbody.fatPercent": [
    { day: 0, value: 18, date: "2026-02-10" },
    { day: 7, value: 17.5, date: "2026-02-17" },
    { day: 14, value: 16.5, date: "2026-02-24" },
  ],
  "inbody.weight": [
    { day: 0, value: 74, date: "2026-02-10" },
    { day: 7, value: 73.6, date: "2026-02-17" },
    { day: 14, value: 73.4, date: "2026-02-24" },
  ],
  "inbody.muscleMass": [
    { day: 0, value: 33, date: "2026-02-10" },
    { day: 7, value: 33.2, date: "2026-02-17" },
    { day: 14, value: 33.2, date: "2026-02-24" },
  ],
  "strength.squat": [
    { day: 0, value: 110, date: "2026-02-10" },
    { day: 7, value: 112, date: "2026-02-17" },
    { day: 14, value: 115, date: "2026-02-24" },
  ],
  "strength.bench": [
    { day: 0, value: 95, date: "2026-02-10" },
    { day: 7, value: 97, date: "2026-02-17" },
    { day: 14, value: 98, date: "2026-02-24" },
  ],
  "strength.deadlift": [
    { day: 0, value: 135, date: "2026-02-10" },
    { day: 7, value: 138, date: "2026-02-17" },
    { day: 14, value: 140, date: "2026-02-24" },
  ],
  "strength.total": [
    { day: 0, value: 340, date: "2026-02-10" },
    { day: 7, value: 347, date: "2026-02-17" },
    { day: 14, value: 353, date: "2026-02-24" },
  ],
  "fitness.running": [
    { day: 0, value: 6, date: "2026-02-10" },
    { day: 7, value: 5.8, date: "2026-02-17" },
    { day: 14, value: 5.6, date: "2026-02-24" },
  ],
  "fitness.rowing": [
    { day: 0, value: 4.5, date: "2026-02-10" },
    { day: 7, value: 4.4, date: "2026-02-17" },
    { day: 14, value: 4.3, date: "2026-02-24" },
  ],
  "fitness.skierg": [
    { day: 0, value: 5.2, date: "2026-02-10" },
    { day: 7, value: 5.1, date: "2026-02-17" },
    { day: 14, value: 5, date: "2026-02-24" },
  ],
  "fitness.total": [
    { day: 0, value: 5.2, date: "2026-02-10" },
    { day: 7, value: 5.1, date: "2026-02-17" },
    { day: 14, value: 4.9, date: "2026-02-24" },
  ],
};

export function seedMockGoalTrackerData(): void {
  if (typeof window === "undefined") return;

  try {
    saveGoalSetting(mockGoalSetting);
    saveQuest(mockActiveQuest);
    savePrimaryGoal("diet");

    const categorySettings = {
      ...mockCategorySettings,
      fitness: FITNESS_CATEGORY_SETTING,
    };
    saveCategorySettings(categorySettings);

    localStorage.setItem(INBODY_HISTORY_KEY, JSON.stringify(mockInbodyHistory));

    const chartHistory: ChartDataHistory = { ...CHART_POINTS } as ChartDataHistory;
    saveChartDataHistory(chartHistory);

    console.log("[GoalTracker] Mock data seeded for UI review");
  } catch (e) {
    console.warn("[GoalTracker] Failed to seed mock data:", e);
  }
}
