"use client";

import { useMemo } from "react";
import { useGoal } from "@/context/GoalContext";
import { useInbody } from "@/context/InbodyContext";
import { useChartData } from "@/context/ChartDataContext";
import type { ChartMetricKey } from "@/types/chartData";
import type { InbodyChartOption } from "@/utils/goalChartData";
import {
  getInbodyChartData,
  getStrengthChartData,
  getCardioChartData,
  type GoalChartData,
} from "@/utils/goalChartData";

export type LevelDashboardStatId = "strength" | "stamina" | "inbody";

export interface LevelDashboardTrackPoint {
  date: string;
  value: number;
}

export interface LevelDashboardPillar {
  id: LevelDashboardStatId;
  label: string;
  unit: string;
  target: number;
  higherIsBetter: boolean;
  data: LevelDashboardTrackPoint[];
  pillarPoints: number;
  grade: string;
  /** 카테고리·지표 설정 완료 (골 트래커와 동일 기준) */
  metricReady: boolean;
  /** 차트에 그릴 시계열 포인트가 있는지 */
  hasSeries: boolean;
}

function formatShortDate(isoDate: string): string {
  if (isoDate.length >= 10) return `${isoDate.slice(5, 7)}-${isoDate.slice(8, 10)}`;
  return isoDate;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function isGoalChartShape(x: unknown): x is GoalChartData {
  if (x == null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if ("sessions" in o && "series" in o && !("startValue" in o)) return false;
  return "startValue" in o && "targetValue" in o && "latestMetric" in o;
}

function progressPctFromGoalChart(gc: GoalChartData): number {
  const { startValue, targetValue, latestMetric, weeklyDelta } = gc;
  const latest = latestMetric ?? startValue;
  const denomDown = startValue - targetValue;
  const denomUp = targetValue - startValue;

  if (Math.abs(denomDown) < 1e-6 && Math.abs(denomUp) < 1e-6) return 50;

  if (weeklyDelta < 0) {
    if (Math.abs(denomDown) < 1e-6) return 50;
    return clamp(0, 100, ((startValue - latest) / denomDown) * 100);
  }
  if (Math.abs(denomUp) < 1e-6) return 50;
  return clamp(0, 100, ((latest - startValue) / denomUp) * 100);
}

function getGradeFromPoints(points: number): string {
  if (points >= 9600) return "MASTER";
  if (points >= 9200) return "ELITE";
  if (points >= 8600) return "PRO";
  if (points >= 7900) return "ADVANCED";
  return "STANDARD";
}

function trackFromGoalChart(
  gc: GoalChartData | null,
  configuredAt: string | null,
  fallbackConfiguredAt?: string | null
): Pick<LevelDashboardPillar, "data" | "target" | "unit" | "higherIsBetter"> {
  if (!gc) {
    return { data: [], target: 0, unit: "", higherIsBetter: true };
  }
  const higherIsBetter = gc.targetValue > gc.startValue;
  const target = gc.targetValue;
  const unit = gc.unit;
  const anchor = configuredAt ?? fallbackConfiguredAt ?? null;

  let data: LevelDashboardTrackPoint[] = [];
  if (gc.dataPoints && gc.dataPoints.length > 0) {
    data = gc.dataPoints.map((p) => ({
      date: formatShortDate(p.date),
      value: p.value,
    }));
  } else if (anchor && gc.latestMetric != null) {
    const d0 = formatShortDate(anchor);
    const lastDate = new Date().toISOString().slice(0, 10);
    const d1 = formatShortDate(lastDate);
    data = [{ date: d0, value: gc.startValue }];
    if (Math.abs(gc.latestMetric - gc.startValue) > 1e-6 || d1 !== d0) {
      data.push({ date: d1, value: gc.latestMetric });
    }
  }

  return { data, target, unit, higherIsBetter };
}

function strengthMetricConfigured(
  cat: { startValues: Record<string, number> | null; autoPaces: Record<string, unknown> | null } | undefined,
  lift: "squat" | "bench" | "deadlift"
): boolean {
  if (!cat) return false;
  return !!(
    cat.autoPaces?.[lift] ??
    (cat.startValues?.[lift] != null && (cat.startValues[lift] ?? 0) > 0)
  );
}

function cardioMetricConfigured(
  cat: { startValues: Record<string, number> | null; autoPaces: Record<string, unknown> | null } | undefined,
  key: "running" | "rowing" | "skierg"
): boolean {
  if (!cat) return false;
  return !!(
    cat.autoPaces?.[key] ??
    (cat.startValues?.[key] != null && (cat.startValues[key] ?? 0) > 0)
  );
}

function inbodyMetricConfigured(
  cat: {
    startValues: Record<string, number> | null;
    autoPaces: Record<string, unknown> | null;
  } | undefined,
  metric: InbodyChartOption
): boolean {
  if (!cat) return false;
  return !!(
    cat.autoPaces?.[metric] ??
    (cat.startValues?.[metric] != null && (cat.startValues[metric] ?? 0) > 0)
  );
}

/**
 * 레벨 탭 프리미엄 대시보드: UnifiedGoalCard와 동일한 Goal / Inbody / ChartData 소스로
 * 스트렝스·체력·인바디 축의 시계열·목표값을 계산합니다.
 */
export function usePremiumLevelDashboardModel(): LevelDashboardPillar[] {
  const { goalSetting, activeQuest, categorySettings } = useGoal();
  const { inbodyHistory } = useInbody();
  const { getChartPoints, chartDataPoints } = useChartData();
  const history = activeQuest?.history ?? [];

  return useMemo(() => {
    const strengthCat = categorySettings.strength;
    const fitnessCat = categorySettings.fitness;
    const inbodyCat = categorySettings.inbody;

    const strengthLift = "squat" as const;
    const cardioOption = "run5k" as const;
    const inbodyOption: InbodyChartOption =
      goalSetting?.category === "inbody" &&
      (goalSetting.mainMetric === "fatPercent" ||
        goalSetting.mainMetric === "muscleMass" ||
        goalSetting.mainMetric === "weight")
        ? (goalSetting.mainMetric as InbodyChartOption)
        : "weight";

    const strengthKey: ChartMetricKey = "strength.squat";
    const cardioKey: ChartMetricKey = "fitness.running";
    const inbodyMetricKey = `inbody.${inbodyOption}` as ChartMetricKey;

    const strengthOk = strengthMetricConfigured(strengthCat, strengthLift);
    let strengthConfiguredAt = strengthCat?.configuredAt ?? null;
    if (!strengthConfiguredAt && strengthOk) {
      const arr = chartDataPoints[strengthKey] ?? [];
      if (arr.length > 0) {
        strengthConfiguredAt = arr.reduce(
          (min, p) => (!min || p.date < min ? p.date : min),
          ""
        );
      }
    }
    const strengthPointsRaw =
      strengthOk && strengthKey
        ? getChartPoints(strengthKey, strengthConfiguredAt)
        : [];
    const strengthChart = strengthOk
      ? getStrengthChartData(strengthLift, {
          categorySetting: strengthCat,
          dataPoints:
            strengthPointsRaw.length > 0 ? strengthPointsRaw : undefined,
        })
      : null;

    const cardioOk = cardioMetricConfigured(fitnessCat, "running");
    let cardioConfiguredAt = fitnessCat?.configuredAt ?? null;
    if (!cardioConfiguredAt && cardioOk) {
      const arr = chartDataPoints[cardioKey] ?? [];
      if (arr.length > 0) {
        cardioConfiguredAt = arr.reduce(
          (min, p) => (!min || p.date < min ? p.date : min),
          ""
        );
      }
    }
    const cardioPointsRaw =
      cardioOk && cardioKey ? getChartPoints(cardioKey, cardioConfiguredAt) : [];
    const cardioChart = cardioOk
      ? getCardioChartData(cardioOption, {
          categorySetting: fitnessCat,
          dataPoints: cardioPointsRaw.length > 0 ? cardioPointsRaw : undefined,
        })
      : null;

    const hasAnyInbody =
      !!(
        inbodyCat?.startValues &&
        Object.keys(inbodyCat.startValues).some(
          (k) => (inbodyCat.startValues![k] ?? 0) > 0
        )
      ) ||
      !!(inbodyCat?.autoPaces && Object.keys(inbodyCat.autoPaces).length > 0) ||
      !!(goalSetting?.category === "inbody");

    const inbodyMetricOk =
      hasAnyInbody &&
      (inbodyMetricConfigured(inbodyCat, inbodyOption) || goalSetting?.category === "inbody");

    let inbodyConfiguredAt = inbodyCat?.configuredAt ?? null;
    if (!inbodyConfiguredAt && inbodyMetricOk) {
      const arr = chartDataPoints[inbodyMetricKey] ?? [];
      if (arr.length > 0) {
        inbodyConfiguredAt = arr.reduce(
          (min, p) => (!min || p.date < min ? p.date : min),
          ""
        );
      }
    }
    const inbodyPointsRaw =
      inbodyMetricOk && inbodyMetricKey
        ? getChartPoints(inbodyMetricKey, inbodyConfiguredAt)
        : [];

    const inbodyRaw = getInbodyChartData(
      inbodyHistory,
      goalSetting?.category === "inbody" ? goalSetting : null,
      goalSetting?.goalId === "diet" ? history : undefined,
      inbodyOption,
      inbodyCat?.goal || hasAnyInbody ? inbodyCat : null,
      inbodyPointsRaw.length > 0 ? inbodyPointsRaw : undefined
    );

    const inbodyChart = isGoalChartShape(inbodyRaw) ? inbodyRaw : null;

    const pillars: LevelDashboardPillar[] = [];

    const addPillar = (
      id: LevelDashboardStatId,
      label: string,
      gc: GoalChartData | null,
      metricReady: boolean,
      configuredAt: string | null,
      categoryConfiguredAt: string | null
    ) => {
      const { data, target, unit, higherIsBetter } = trackFromGoalChart(
        gc,
        configuredAt,
        categoryConfiguredAt
      );
      const progress = gc ? progressPctFromGoalChart(gc) : 0;
      const pillarPoints =
        metricReady && gc
          ? clamp(7700 + Math.round(progress * 21), 7600, 9850)
          : 7200;
      const grade = getGradeFromPoints(pillarPoints);
      const hasSeries = metricReady && data.length > 0;
      pillars.push({
        id,
        label,
        unit: unit || (id === "strength" ? "kg" : id === "stamina" ? "분/km" : "%"),
        target: metricReady && gc ? target : 0,
        higherIsBetter,
        data: metricReady ? data : [],
        pillarPoints,
        grade,
        metricReady,
        hasSeries,
      });
    };

    addPillar(
      "strength",
      "Strength",
      strengthChart,
      strengthOk,
      strengthConfiguredAt,
      strengthCat?.configuredAt ?? null
    );
    addPillar(
      "stamina",
      "Stamina",
      cardioChart,
      cardioOk,
      cardioConfiguredAt,
      fitnessCat?.configuredAt ?? null
    );
    addPillar(
      "inbody",
      "Inbody",
      inbodyChart,
      inbodyMetricOk,
      inbodyConfiguredAt,
      inbodyCat?.configuredAt ?? null
    );

    return pillars;
  }, [
    categorySettings,
    goalSetting,
    activeQuest,
    inbodyHistory,
    getChartPoints,
    chartDataPoints,
    history,
  ]);
}

export function usePremiumLevelDashboardTotals(pillars: LevelDashboardPillar[]): {
  totalScore: number;
  rankLabel: string;
} {
  return useMemo(() => {
    const sum = pillars.reduce((s, p) => s + p.pillarPoints, 0);
    const avg = pillars.length ? sum / pillars.length : 0;
    const totalScore = Math.round(sum);
    let rankLabel = "—";
    if (avg >= 9600) rankLabel = "TOP 2%";
    else if (avg >= 9300) rankLabel = "TOP 4%";
    else if (avg >= 9000) rankLabel = "TOP 9%";
    else if (avg >= 8600) rankLabel = "TOP 18%";
    else if (avg > 0) rankLabel = "TOP 35%";
    return { totalScore, rankLabel };
  }, [pillars]);
}
