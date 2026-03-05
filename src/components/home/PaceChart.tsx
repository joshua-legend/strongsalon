"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { WeekRecord } from "@/types/quest";
import { usePaceChartData } from "./usePaceChartData";
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
}

export default function PaceChart({
  startValue,
  targetValue,
  weeklyDelta,
  history,
  unit,
}: PaceChartProps) {
  const { dims, maxWeek, yMinNice, yRangeNice, toX, toY, paceDiff, isAhead } =
    usePaceChartData(startValue, targetValue, weeklyDelta, history);
  const { width, height, padLeft, chartW } = dims;

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

        <PaceChartAxes
          dims={dims} maxWeek={maxWeek} yMinNice={yMinNice}
          yRangeNice={yRangeNice} toX={toX} toY={toY}
        />
        <PaceChartDataLines
          startValue={startValue} targetValue={targetValue} maxWeek={maxWeek}
          history={history} unit={unit} padLeft={padLeft} chartW={chartW}
          toX={toX} toY={toY}
        />
      </svg>

      {history.length > 0 && (
        <div
          className={`mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isAhead ? "bg-lime-400/10 text-lime-400" : "bg-orange-400/10 text-orange-400"
          }`}
        >
          {weeklyDelta < 0 ? (
            <TrendingDown className="w-3.5 h-3.5" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          <span>
            {isAhead
              ? `이상 페이스보다 ${Math.abs(paceDiff).toFixed(1)}${unit} 앞서가는 중`
              : `이상 페이스보다 ${Math.abs(paceDiff).toFixed(1)}${unit} 뒤처지는 중`}
          </span>
        </div>
      )}
    </div>
  );
}
