"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { WeekRecord } from "@/types/quest";
import type { ChartDataPoint } from "@/types/chartData";
import { CYCLE_WEEKS } from "@/utils/chartConstants";
import { usePaceChartData, usePaceChartDataDay } from "./usePaceChartData";
import PaceChartAxes from "./PaceChartAxes";
import PaceChartDataLines from "./PaceChartDataLines";

interface PaceChartProps {
  startValue: number;
  targetValue: number;
  weeklyDelta: number;
  history: WeekRecord[];
  currentWeek: number;
  latestMetric: number;
  unit: string;
  /** Day-based X축 (W1, W2...) 사용 시 */
  dataPoints?: ChartDataPoint[];
  /** 그래프 라인/도트 색상 (기본: lime) */
  lineColor?: string;
  /** 값 표시 포맷 (예: 체력 분/km → 소수점 1자리) */
  formatValue?: (v: number) => string;
  /** 목표 설정일 (YYYY-MM-DD) - X축 mm-dd 라벨용 */
  configuredAt?: string | null;
}

export default function PaceChart({
  startValue,
  targetValue,
  weeklyDelta,
  history,
  unit,
  dataPoints,
  lineColor = "#a3e635",
  formatValue = (v) => String(v),
  configuredAt,
}: PaceChartProps) {
  const useDayMode = dataPoints != null && dataPoints.length > 0;

  const weekCalc = usePaceChartData(startValue, targetValue, weeklyDelta, history, CYCLE_WEEKS);
  const dayCalc = usePaceChartDataDay(
    startValue,
    targetValue,
    weeklyDelta,
    dataPoints ?? [],
    undefined
  );

  const calc = useDayMode ? dayCalc : weekCalc;
  const dims = calc.dims;
  const { width, height, padLeft, chartW } = dims;
  const { yMinNice, yRangeNice, toY, paceDiff, isAhead } = calc;

  const axesProps = useDayMode
    ? {
        dims,
        maxWeek: dayCalc.maxWeeks,
        yMinNice,
        yRangeNice,
        toX: (w: number) => dayCalc.toXDay(w * 7),
        toY,
        dayMode: { maxDays: dayCalc.maxDays, toXDay: dayCalc.toXDay },
        formatValue,
        configuredAt,
      }
    : {
        dims,
        maxWeek: weekCalc.maxWeek,
        yMinNice,
        yRangeNice,
        toX: weekCalc.toX,
        toY,
        formatValue,
        configuredAt,
      };

  const linesProps = useDayMode
    ? {
        startValue,
        targetValue,
        maxWeek: dayCalc.maxWeeks,
        history,
        unit,
        padLeft,
        chartW,
        toX: (w: number) => dayCalc.toXDay(w * 7),
        toY,
        dataPoints: dataPoints!,
        toXDay: dayCalc.toXDay,
        maxDays: dayCalc.maxDays,
        lineColor,
        formatValue,
      }
    : {
        startValue,
        targetValue,
        maxWeek: weekCalc.maxWeek,
        history,
        unit,
        padLeft,
        chartW,
        toX: weekCalc.toX,
        toY,
        lineColor,
        formatValue,
      };

  return (
    <div className="w-full min-h-[240px]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-h-[240px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="targetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <PaceChartAxes {...axesProps} />
        <PaceChartDataLines {...linesProps} />
      </svg>

      {history.length > 0 && (
        <div
          className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: isAhead ? "var(--chart-pace-good-bg)" : "var(--chart-pace-bad-bg)",
            color: isAhead ? "var(--chart-pace-good)" : "var(--chart-pace-bad)",
          }}
        >
          {weeklyDelta < 0 ? (
            <TrendingDown className="w-3.5 h-3.5" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          <span>
            {isAhead
              ? `이상 페이스보다 ${formatValue(Math.abs(paceDiff))}${unit} 앞서가는 중`
              : `이상 페이스보다 ${formatValue(Math.abs(paceDiff))}${unit} 뒤처지는 중`}
          </span>
        </div>
      )}
    </div>
  );
}
