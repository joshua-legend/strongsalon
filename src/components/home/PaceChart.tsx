"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { WeekRecord } from "@/types/quest";

interface PaceChartProps {
  startValue: number;
  targetValue: number;
  weeklyDelta: number;
  history: WeekRecord[];
  currentWeek: number;
  latestMetric: number;
  unit: string;
}

function niceRound(step: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  if (norm <= 1) return mag;
  if (norm <= 2) return 2 * mag;
  if (norm <= 5) return 5 * mag;
  return 10 * mag;
}

export default function PaceChart({
  startValue,
  targetValue,
  weeklyDelta,
  history,
  currentWeek,
  latestMetric,
  unit,
}: PaceChartProps) {
  const width = 340;
  const height = 180;
  const padLeft = 44;
  const padRight = 14;
  const padTop = 20;
  const padBottom = 32;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const totalDelta = Math.abs(targetValue - startValue);
  const deltaStep = Math.abs(weeklyDelta);
  const maxWeek = Math.max(6, Math.ceil(totalDelta / deltaStep) || 1);

  const allValues = [
    startValue,
    targetValue,
    ...history.map((h) => h.recorded),
  ];
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yRange = yMax - yMin || 1;
  const rawStep = yRange / 5;
  const niceStep = niceRound(rawStep);
  const yMinNice = Math.floor(yMin / niceStep) * niceStep;
  const yMaxNice = Math.ceil(yMax / niceStep) * niceStep;
  const yRangeNice = yMaxNice - yMinNice || niceStep;

  const toX = (week: number) => padLeft + (week / maxWeek) * chartW;
  const toY = (val: number) =>
    padTop + chartH - ((val - yMinNice) / yRangeNice) * chartH;

  const paceDiff =
    history.length > 0
      ? latestMetric -
        (startValue +
          (targetValue - startValue) * (history.length / maxWeek))
      : 0;
  const isAhead = (weeklyDelta < 0 && paceDiff <= 0) || (weeklyDelta > 0 && paceDiff >= 0);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="targetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Chart frame */}
        <rect
          x={padLeft}
          y={padTop}
          width={chartW}
          height={chartH}
          fill="none"
          stroke="#1a1a1a"
          rx={2}
        />

        {/* Grid */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = yMinNice + (i / 4) * yRangeNice;
          const py = toY(y);
          return (
            <line
              key={`h-${i}`}
              x1={padLeft}
              y1={py}
              x2={padLeft + chartW}
              y2={py}
              stroke="#2a2a2a"
              strokeWidth={0.5}
            />
          );
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const x = padLeft + (i / 6) * chartW;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={padTop}
              x2={x}
              y2={padTop + chartH}
              stroke="#1f1f1f"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Y-axis ticks */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = yMinNice + (i / 4) * yRangeNice;
          const py = toY(y);
          return (
            <g key={`ytick-${i}`}>
              <line
                x1={padLeft - 4}
                y1={py}
                x2={padLeft}
                y2={py}
                stroke="#404040"
                strokeWidth={1}
              />
              <text
                x={padLeft - 6}
                y={py + 3}
                textAnchor="end"
                fontSize={9}
                fontWeight="bold"
                fill="#a3a3a3"
              >
                {y}
              </text>
            </g>
          );
        })}

        {/* X-axis ticks */}
        {Array.from({ length: 7 }, (_, i) => {
          const week = (i / 6) * maxWeek;
          const x = toX(week);
          return (
            <g key={`xtick-${i}`}>
              <line
                x1={x}
                y1={padTop + chartH}
                x2={x}
                y2={padTop + chartH + 4}
                stroke="#525252"
                strokeWidth={1}
              />
              <text
                x={x}
                y={padTop + chartH + 14}
                textAnchor="middle"
                fontSize={9}
                fill={i === 0 ? "#d4d4d4" : "#737373"}
                fontWeight={i === 0 ? "bold" : "normal"}
              >
                {i === 0 ? "시작" : `W${Math.round(week)}`}
              </text>
            </g>
          );
        })}

        {/* Target line (deadline) */}
        <line
          x1={padLeft}
          y1={toY(targetValue)}
          x2={padLeft + chartW}
          y2={toY(targetValue)}
          stroke="#a3e635"
          strokeWidth={2}
          opacity={0.7}
          filter="url(#targetGlow)"
        />
        <rect
          x={padLeft}
          y={toY(targetValue) - 6}
          width={chartW}
          height={12}
          fill="#a3e635"
          opacity={0.03}
        />
        <text
          x={padLeft - 4}
          y={toY(targetValue) - 2}
          textAnchor="end"
          fontSize={9}
          fontWeight="bold"
          fill="#a3e635"
          opacity={0.8}
        >
          ── 목표
        </text>
        <rect
          x={padLeft + chartW - 56}
          y={toY(targetValue) - 9}
          width={52}
          height={18}
          rx={4}
          fill="#171717"
          stroke="#a3e635"
          strokeWidth={1}
        />
        <text
          x={padLeft + chartW - 30}
          y={toY(targetValue) + 2}
          textAnchor="middle"
          fontSize={9}
          fontWeight="bold"
          fill="#a3e635"
        >
          {targetValue}
          {unit}
        </text>

        {/* Ideal pace line (dashed) */}
        <polyline
          points={Array.from({ length: maxWeek + 1 }, (_, i) => {
            const week = i;
            const val = startValue + (targetValue - startValue) * (week / maxWeek);
            return `${toX(week)},${toY(val)}`;
          }).join(" ")}
          fill="none"
          stroke="#525252"
          strokeWidth={1.5}
          strokeDasharray="4 5"
          opacity={0.7}
        />

        {/* Actual recorded line */}
        {history.length > 0 && (
          <polyline
            points={[
              `${toX(0)},${toY(startValue)}`,
              ...history.map((h, i) => `${toX(h.week)},${toY(h.recorded)}`),
            ].join(" ")}
            fill="none"
            stroke="#a3e635"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data dots */}
        {/* Start dot (W0) */}
        <circle
          cx={toX(0)}
          cy={toY(startValue)}
          r={3}
          fill="#171717"
          stroke="#525252"
          strokeWidth={1}
        />

        {/* History dots */}
        {history.map((h, i) => {
          const isCurrent = i === history.length - 1;
          const x = toX(h.week);
          const y = toY(h.recorded);

          if (isCurrent) {
            return (
              <g key={`dot-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={7}
                  fill="#a3e635"
                  filter="url(#dotGlow)"
                />
                <circle cx={x} cy={y} r={3} fill="#0a0a0a" />
                {/* Label above */}
                <rect
                  x={x - 25}
                  y={y - 28}
                  width={50}
                  height={20}
                  rx={4}
                  fill="#171717"
                  stroke="#a3e635"
                  strokeWidth={1}
                />
                <polygon
                  points={`${x - 4},${y - 8} ${x + 4},${y - 8} ${x},${y - 4}`}
                  fill="#171717"
                  stroke="#a3e635"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill="#a3e635"
                >
                  {h.recorded}
                  {unit}
                </text>
              </g>
            );
          }

          return (
            <g key={`dot-${i}`}>
              {!h.passed && (
                <circle
                  cx={x}
                  cy={y}
                  r={7}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth={1}
                  opacity={0.3}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#0a0a0a"
                stroke={h.passed ? "#a3e635" : "#f97316"}
                strokeWidth={2}
              />
            </g>
          );
        })}

        {/* Ghost marker (ideal pace current position) */}
        {history.length > 0 && history.length <= maxWeek && (
          <g>
            <circle
              cx={toX(history.length)}
              cy={toY(
                startValue +
                  (targetValue - startValue) * (history.length / maxWeek)
              )}
              r={4}
              fill="none"
              stroke="#525252"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <text
              x={toX(history.length) + 8}
              y={
                toY(
                  startValue +
                    (targetValue - startValue) * (history.length / maxWeek)
                ) + 3
              }
              fontSize={7}
              fill="#737373"
            >
              이상
            </text>
          </g>
        )}
      </svg>

      {/* Pace comparison badge - rendered outside SVG for better layout */}
      {history.length > 0 && (
        <div
          className={`mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isAhead
              ? "bg-lime-400/10 text-lime-400"
              : "bg-orange-400/10 text-orange-400"
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
