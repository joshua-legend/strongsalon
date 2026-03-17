import type { WeekRecord } from "@/types/quest";
import type { ChartDataPoint } from "@/types/chartData";
import { CYCLE_DAYS } from "@/utils/chartConstants";

export interface PaceChartDimensions {
  width: number;
  height: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  chartW: number;
  chartH: number;
}

export interface PaceChartCalculations {
  dims: PaceChartDimensions;
  maxWeek: number;
  yMinNice: number;
  yMaxNice: number;
  yRangeNice: number;
  niceStep: number;
  toX: (week: number) => number;
  toY: (val: number) => number;
  paceDiff: number;
  isAhead: boolean;
}

function niceRound(step: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  if (norm <= 1) return mag;
  if (norm <= 2) return 2 * mag;
  if (norm <= 5) return 5 * mag;
  return 10 * mag;
}

/** Y축 범위 계산: 패딩 + 최소 범위로 한눈에 보기 좋게. zoomLevel: 1=기본, 2=확대, 0.5=축소 */
function computeYDomain(
  values: number[],
  zoomLevel = 1
): { yMinNice: number; yMaxNice: number; yRangeNice: number; niceStep: number } {
  if (values.length === 0) {
    return { yMinNice: 0, yMaxNice: 100, yRangeNice: 100, niceStep: 20 };
  }
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  let yRange = rawMax - rawMin || 1;

  // 매우 작은 편차: 최소 시각적 범위 보장 (값의 5% 또는 1)
  const minRange = Math.max(1, Math.abs(rawMax) * 0.05, Math.abs(rawMin) * 0.05);
  if (yRange < minRange) yRange = minRange;

  // 상하 8% 패딩 (라인이 가장자리에 붙지 않도록)
  const padding = yRange * 0.08;
  const yMin = rawMin - padding;
  const yMax = rawMax + padding;
  let paddedRange = yMax - yMin;

  // zoomLevel: 2=확대(범위 축소), 0.5=축소(범위 확대)
  if (zoomLevel > 0 && zoomLevel !== 1) {
    const center = (yMin + yMax) / 2;
    paddedRange = paddedRange / zoomLevel;
    const half = paddedRange / 2;
    const newYMin = center - half;
    const newYMax = center + half;
    const niceStep = niceRound(paddedRange / 5);
    const yMinNice = Math.floor(newYMin / niceStep) * niceStep;
    const yMaxNice = Math.ceil(newYMax / niceStep) * niceStep;
    const yRangeNice = Math.max(yMaxNice - yMinNice, niceStep);
    return { yMinNice, yMaxNice, yRangeNice, niceStep };
  }

  const niceStep = niceRound(paddedRange / 5);
  const yMinNice = Math.floor(yMin / niceStep) * niceStep;
  const yMaxNice = Math.ceil(yMax / niceStep) * niceStep;
  const yRangeNice = Math.max(yMaxNice - yMinNice, niceStep);

  return { yMinNice, yMaxNice, yRangeNice, niceStep };
}

export function usePaceChartData(
  startValue: number,
  targetValue: number,
  weeklyDelta: number,
  history: WeekRecord[],
  maxWeekOverride?: number,
  zoomLevel?: number
): PaceChartCalculations {
  const dims: PaceChartDimensions = {
    width: 400, height: 240,
    padLeft: 48, padRight: 16, padTop: 24, padBottom: 40,
    chartW: 400 - 48 - 16,
    chartH: 240 - 24 - 40,
  };

  const totalDelta = Math.abs(targetValue - startValue);
  const deltaStep = Math.abs(weeklyDelta);
  const maxWeek =
    maxWeekOverride ??
    Math.max(6, Math.ceil(totalDelta / deltaStep) || 1);

  const allValues = [startValue, targetValue, ...history.map((h) => h.recorded)];
  const { yMinNice, yMaxNice, yRangeNice, niceStep } = computeYDomain(allValues, zoomLevel ?? 1);

  const toX = (week: number) => dims.padLeft + (week / maxWeek) * dims.chartW;
  const toY = (val: number) =>
    dims.padTop + dims.chartH - ((val - yMinNice) / yRangeNice) * dims.chartH;

  const actualRecorded = history.length > 0 ? history[history.length - 1].recorded : null;
  const idealValueAtCurrentWeek = startValue + (targetValue - startValue) * (history.length / maxWeek);
  const paceDiff = actualRecorded != null ? actualRecorded - idealValueAtCurrentWeek : 0;
  const isAhead = (weeklyDelta < 0 && paceDiff <= 0) || (weeklyDelta > 0 && paceDiff >= 0);

  return { dims, maxWeek, yMinNice, yMaxNice, yRangeNice, niceStep, toX, toY, paceDiff, isAhead };
}

export interface PaceChartDayCalculations {
  dims: PaceChartDimensions;
  maxWeeks: number;
  maxDays: number;
  yMinNice: number;
  yMaxNice: number;
  yRangeNice: number;
  niceStep: number;
  toXDay: (day: number) => number;
  toY: (val: number) => number;
  paceDiff: number;
  isAhead: boolean;
}

/** Day-based X축: startDate 기준 경과 일수, 데이터 기반 adaptive maxDays */
export function usePaceChartDataDay(
  startValue: number,
  targetValue: number,
  weeklyDelta: number,
  dataPoints: ChartDataPoint[],
  maxDaysOverride?: number,
  zoomLevel?: number
): PaceChartDayCalculations {
  const dims: PaceChartDimensions = {
    width: 400,
    height: 240,
    padLeft: 48,
    padRight: 16,
    padTop: 24,
    padBottom: 40,
    chartW: 400 - 48 - 16,
    chartH: 240 - 24 - 40,
  };

  const maxDays =
    maxDaysOverride ??
    (dataPoints.length > 0
      ? Math.max(CYCLE_DAYS, Math.max(...dataPoints.map((p) => p.day)) + 7)
      : CYCLE_DAYS);
  const maxWeeks = Math.ceil(maxDays / 7);

  const allValues = [
    startValue,
    targetValue,
    ...dataPoints.map((p) => p.value),
  ];
  const { yMinNice, yMaxNice, yRangeNice, niceStep } = computeYDomain(allValues, zoomLevel ?? 1);

  const toXDay = (day: number) =>
    dims.padLeft + (day / maxDays) * dims.chartW;
  const toY = (val: number) =>
    dims.padTop + dims.chartH - ((val - yMinNice) / yRangeNice) * dims.chartH;

  const lastPoint = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : null;
  const currentDay = lastPoint?.day ?? 0;
  const idealValueAtCurrentDay =
    startValue + (targetValue - startValue) * (currentDay / maxDays);
  const paceDiff =
    lastPoint != null ? lastPoint.value - idealValueAtCurrentDay : 0;
  const isAhead =
    (weeklyDelta < 0 && paceDiff <= 0) || (weeklyDelta > 0 && paceDiff >= 0);

  return {
    dims,
    maxWeeks,
    maxDays,
    yMinNice,
    yMaxNice,
    yRangeNice,
    niceStep,
    toXDay,
    toY,
    paceDiff,
    isAhead,
  };
}
