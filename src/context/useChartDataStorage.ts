import type { ChartDataPoint, ChartMetricKey } from "@/types/chartData";
import type { CategoryId } from "@/types/categorySettings";
import { mockChartDataPoints } from "@/data/mockUserData";

export type ChartDataHistory = Record<ChartMetricKey, ChartDataPoint[]>;

let chartData: ChartDataHistory = structuredClone(mockChartDataPoints);

export function resetChartData(): void {
  chartData = structuredClone(mockChartDataPoints);
}

function loadChartDataHistory(): ChartDataHistory {
  return chartData;
}

export function saveChartDataHistory(history: ChartDataHistory): void {
  chartData = history;
}

function daysSince(startDate: string, targetDate: string): number {
  const start = new Date(startDate).getTime();
  const target = new Date(targetDate).getTime();
  return Math.floor((target - start) / (1000 * 60 * 60 * 24));
}

export function appendChartPoint(
  metricKey: ChartMetricKey,
  point: ChartDataPoint,
  configuredAt: string
): void {
  const history = loadChartDataHistory();
  const arr = history[metricKey] ?? [];
  const day = daysSince(configuredAt, point.date);
  const newPoint: ChartDataPoint = { day, value: point.value, date: point.date };

  const existingIdx = arr.findIndex((p) => p.date === point.date);
  let next: ChartDataPoint[];
  if (existingIdx >= 0) {
    next = [...arr];
    next[existingIdx] = newPoint;
  } else {
    next = [...arr, newPoint].sort((a, b) => a.day - b.day);
  }
  history[metricKey] = next;
  saveChartDataHistory(history);
}

export function getChartPoints(
  metricKey: ChartMetricKey,
  configuredAt: string | null
): ChartDataPoint[] {
  if (!configuredAt) return [];
  const history = loadChartDataHistory();
  const arr = history[metricKey] ?? [];
  return arr.filter((p) => p.day >= 0);
}

export function addStartPoint(
  metricKey: ChartMetricKey,
  value: number,
  configuredAt: string
): void {
  appendChartPoint(metricKey, { day: 0, value, date: configuredAt }, configuredAt);
}

const CATEGORY_METRICS: Record<CategoryId, ChartMetricKey[]> = {
  inbody: ["inbody.weight", "inbody.muscleMass", "inbody.fatPercent"],
  strength: ["strength.squat", "strength.bench", "strength.deadlift", "strength.total"],
  fitness: ["fitness.running", "fitness.rowing", "fitness.skierg", "fitness.total"],
};

export function clearChartDataForCategory(categoryId: CategoryId): void {
  const history = loadChartDataHistory();
  const keys = CATEGORY_METRICS[categoryId] ?? [];
  for (const key of keys) {
    delete history[key];
  }
  saveChartDataHistory(history);
}
