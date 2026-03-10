import type { WeekRecord } from "@/types/quest";
import type { ChartDataPoint } from "@/types/chartData";

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

export function usePaceChartData(
  startValue: number,
  targetValue: number,
  weeklyDelta: number,
  history: WeekRecord[],
  maxWeekOverride?: number
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
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yRange = yMax - yMin || 1;
  const niceStep = niceRound(yRange / 5);
  const yMinNice = Math.floor(yMin / niceStep) * niceStep;
  const yMaxNice = Math.ceil(yMax / niceStep) * niceStep;
  const yRangeNice = yMaxNice - yMinNice || niceStep;

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

/** Day-based X축: startDate 기준 경과 일수, X축 라벨 W1/W2/... */
export function usePaceChartDataDay(
  startValue: number,
  targetValue: number,
  weeklyDelta: number,
  dataPoints: ChartDataPoint[],
  maxWeeks: number
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

  const maxDays = maxWeeks * 7;

  const allValues = [
    startValue,
    targetValue,
    ...dataPoints.map((p) => p.value),
  ];
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yRange = yMax - yMin || 1;
  const niceStep = niceRound(yRange / 5);
  const yMinNice = Math.floor(yMin / niceStep) * niceStep;
  const yMaxNice = Math.ceil(yMax / niceStep) * niceStep;
  const yRangeNice = yMaxNice - yMinNice || niceStep;

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
