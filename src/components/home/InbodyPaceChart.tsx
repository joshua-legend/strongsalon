"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { GoalChartData } from "@/utils/goalChartData";
import type { InbodyMultiLineChartData } from "@/utils/goalChartData";
import type { InbodyGoal, InbodyMetricKey } from "@/types/quest";
import { usePaceChartData } from "./usePaceChartData";

const METRIC_LABELS: Record<InbodyMetricKey, string> = {
  weight: "체중",
  muscleMass: "골격근",
  fatPercent: "체지방률",
};

interface InbodyPaceChartProps {
  data: GoalChartData | InbodyMultiLineChartData | null;
  subTab: "total" | "weight" | "muscleMass" | "fatPercent";
  inbodyGoal?: InbodyGoal | null;
}

function isMultiLine(
  data: GoalChartData | InbodyMultiLineChartData | null
): data is InbodyMultiLineChartData {
  return data !== null && "sessions" in data && "series" in data;
}

export default function InbodyPaceChart({
  data,
  subTab,
  inbodyGoal,
}: InbodyPaceChartProps) {
  if (!data) {
    return (
      <div className="py-12 text-center text-xs text-neutral-600">
        인바디 기록이 2개 이상 필요합니다
      </div>
    );
  }

  if (isMultiLine(data)) {
    return (
      <InbodyTotalChart
        data={data}
        inbodyGoal={inbodyGoal}
      />
    );
  }

  return (
    <InbodySingleChart
      data={data}
      mainMetric={subTab as InbodyMetricKey}
      isMain={inbodyGoal?.mainMetric === subTab}
    />
  );
}

function InbodyTotalChart({
  data,
  inbodyGoal,
}: {
  data: InbodyMultiLineChartData;
  inbodyGoal?: InbodyGoal | null;
}) {
  const { sessions, series } = data;
  const n = sessions.length;
  if (n < 2) return null;

  const width = 400;
  const height = 240;
  const padLeft = 48;
  const padRight = 16;
  const padTop = 28;
  const padBottom = 44;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxSession = n - 1;

  const toX = (sessionIdx: number) =>
    padLeft + (sessionIdx / maxSession) * chartW;

  const normalizedSeries = series.map((s) => {
    const vals = s.values;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    return {
      ...s,
      normalized: vals.map((v) => ((v - min) / range) * 100),
    };
  });

  const toY = (normPct: number) =>
    padTop + chartH - (normPct / 100) * chartH;

  return (
    <div className="w-full min-h-[240px]">
      <div className="flex gap-4 mb-2 text-[10px] text-neutral-400">
        {series.map((s) => (
          <span key={s.metricKey} className="flex items-center gap-1">
            <span
              className="w-4 h-0.5 rounded"
              style={{ backgroundColor: s.color }}
            />
            {METRIC_LABELS[s.metricKey]}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-h-[240px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="inbodyDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x={padLeft}
          y={padTop}
          width={chartW}
          height={chartH}
          fill="none"
          stroke="#1a1a1a"
          rx={2}
        />
        {[0, 0.25, 0.5, 0.75, 1].map((_, i) => {
          const y = padTop + (1 - i / 4) * chartH;
          return (
            <line
              key={`h-${i}`}
              x1={padLeft}
              y1={y}
              x2={padLeft + chartW}
              y2={y}
              stroke="#2a2a2a"
              strokeWidth={0.5}
            />
          );
        })}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((_, i) => {
          const x = padLeft + (i / 5) * chartW;
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

        {normalizedSeries.map((s, seriesIdx) => {
          const idealNormalized: number[] = [];
          if (s.pace) {
            const { start, target, weeklyDelta } = s.pace;
            const totalWeeks = Math.abs(target - start) / Math.abs(weeklyDelta) || 1;
            for (let i = 0; i < n; i++) {
              const weekProgress = (i / (n - 1)) * totalWeeks;
              const idealVal = start + weeklyDelta * weekProgress;
              const vals = s.values;
              const min = Math.min(...vals);
              const max = Math.max(...vals);
              const range = max - min || 1;
              idealNormalized.push(((idealVal - min) / range) * 100);
            }
          }
          return (
          <g key={s.metricKey} style={{ zIndex: inbodyGoal?.mainMetric === s.metricKey ? 10 : seriesIdx }}>
            {s.pace && idealNormalized.length > 0 && (
              <polyline
                points={idealNormalized
                  .map((norm, i) => `${toX(i)},${toY(norm)}`)
                  .join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={1}
                strokeDasharray="3 6"
                opacity={0.4}
              />
            )}
            <polyline
              points={s.normalized
                .map((norm, i) => `${toX(i)},${toY(norm)}`)
                .join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {s.normalized.map((norm, i) => (
              <circle
                key={i}
                cx={toX(i)}
                cy={toY(norm)}
                r={4}
                fill={s.color}
                stroke="#0a0a0a"
                strokeWidth={1}
              />
            ))}
            {s.normalized.length > 0 && (
              <circle
                cx={toX(s.normalized.length - 1)}
                cy={toY(s.normalized[s.normalized.length - 1])}
                r={6}
                fill={s.color}
                filter="url(#inbodyDotGlow)"
              />
            )}
          </g>
        );
        })}

        {sessions.map((s, i) => (
          <g key={s.index}>
            <line
              x1={toX(i)}
              y1={padTop + chartH}
              x2={toX(i)}
              y2={padTop + chartH + 4}
              stroke="#525252"
              strokeWidth={1}
            />
            <text
              x={toX(i)}
              y={padTop + chartH + 12}
              textAnchor="middle"
              fontSize={9}
              fill={i === 0 ? "#d4d4d4" : "#737373"}
              fontWeight={i === 0 ? "bold" : "normal"}
            >
              {s.index}회차
            </text>
            <text
              x={toX(i)}
              y={padTop + chartH + 22}
              textAnchor="middle"
              fontSize={7}
              fill="#525252"
            >
              {s.date.slice(5).replace("-", ".")}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function InbodySingleChart({
  data,
  mainMetric,
  isMain,
}: {
  data: GoalChartData;
  mainMetric: InbodyMetricKey;
  isMain: boolean;
}) {
  const invertGood = mainMetric === "weight" || mainMetric === "fatPercent";
  const {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek,
    unit,
  } = data;
  const maxWeek = Math.max(currentWeek - 1, 1);
  const { dims, yMinNice, yRangeNice, toX, toY, paceDiff, isAhead } =
    usePaceChartData(startValue, targetValue, weeklyDelta, history, maxWeek);
  const { padLeft, chartW } = dims;

  const lineColor =
    mainMetric === "weight"
      ? "#ffffff"
      : mainMetric === "muscleMass"
        ? "#a3e635"
        : "#fb923c";

  return (
    <div className="w-full min-h-[240px]">
      <svg
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        className="w-full h-auto min-h-[240px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="inbodyTargetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="inbodyDotGlow2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x={padLeft}
          y={dims.padTop}
          width={chartW}
          height={dims.chartH}
          fill="none"
          stroke="#1a1a1a"
          rx={2}
        />
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
              y1={dims.padTop}
              x2={x}
              y2={dims.padTop + dims.chartH}
              stroke="#1f1f1f"
              strokeWidth={0.5}
            />
          );
        })}

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

        {Array.from({ length: 7 }, (_, i) => {
          const week = (i / 6) * maxWeek;
          const x = toX(week);
          return (
            <g key={`xtick-${i}`}>
              <line
                x1={x}
                y1={dims.padTop + dims.chartH}
                x2={x}
                y2={dims.padTop + dims.chartH + 4}
                stroke="#525252"
                strokeWidth={1}
              />
              <text
                x={x}
                y={dims.padTop + dims.chartH + 14}
                textAnchor="middle"
                fontSize={9}
                fill={i === 0 ? "#d4d4d4" : "#737373"}
                fontWeight={i === 0 ? "bold" : "normal"}
              >
                {i === 0 ? "시작" : `${Math.round(week)}회차`}
              </text>
            </g>
          );
        })}

        {/* Ideal pace line (gray dashed) */}
        <polyline
          points={Array.from({ length: maxWeek + 1 }, (_, i) => {
            const val = startValue + (targetValue - startValue) * (i / maxWeek);
            return `${toX(i)},${toY(val)}`;
          }).join(" ")}
          fill="none"
          stroke="#525252"
          strokeWidth={isMain ? 1.5 : 1}
          strokeDasharray={isMain ? "4 5" : "3 6"}
        />

        {/* Target line (lime when main) */}
        {isMain && (
          <>
            <line
              x1={padLeft}
              y1={toY(targetValue)}
              x2={padLeft + chartW}
              y2={toY(targetValue)}
              stroke="#a3e635"
              strokeWidth={2}
              filter="url(#inbodyTargetGlow)"
            />
            <text
              x={padLeft - 4}
              y={toY(targetValue) - 2}
              textAnchor="end"
              fontSize={10}
              fontWeight="bold"
              fill="#a3e635"
            >
              목표
            </text>
            <text
              x={padLeft + chartW - 32}
              y={toY(targetValue) + 3}
              textAnchor="middle"
              fontSize={11}
              fontWeight="bold"
              fill="#a3e635"
            >
              {targetValue}
              {unit}
            </text>
          </>
        )}

        {/* Actual recorded line */}
        {history.length > 0 && (
          <polyline
            points={[
              `${toX(0)},${toY(startValue)}`,
              ...history.map((h) => `${toX(h.week)},${toY(h.recorded)}`),
            ].join(" ")}
            fill="none"
            stroke={lineColor}
            strokeWidth={isMain ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        <circle
          cx={toX(0)}
          cy={toY(startValue)}
          r={3}
          fill="#171717"
          stroke="#525252"
          strokeWidth={1}
        />

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
                  fill={lineColor}
                  filter="url(#inbodyDotGlow2)"
                />
                <circle cx={x} cy={y} r={3} fill="#0a0a0a" />
                <rect
                  x={x - 25}
                  y={y - 28}
                  width={50}
                  height={20}
                  rx={4}
                  fill="#171717"
                  stroke={lineColor}
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill={lineColor}
                >
                  {h.recorded}
                  {unit}
                </text>
              </g>
            );
          }
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill={lineColor}
              stroke="#0a0a0a"
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {history.length > 0 && (
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>현재: <span className="font-mono text-white">{data.latestMetric}{unit}</span></span>
            <span>이전: <span className="font-mono">{history.length >= 2 ? history[history.length - 2].recorded : data.startValue}{unit}</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${(() => {
              const diff = data.latestMetric - (history.length >= 2 ? history[history.length - 2].recorded : data.startValue);
              const isGood = invertGood ? diff <= 0 : diff >= 0;
              return isGood ? "text-lime-400" : "text-orange-400";
            })()}`}>
              변화: {(data.latestMetric - (history.length >= 2 ? history[history.length - 2].recorded : data.startValue)) >= 0 ? "+" : ""}
              {(data.latestMetric - (history.length >= 2 ? history[history.length - 2].recorded : data.startValue)).toFixed(1)}{unit}
            </span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
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
                  ? `이상 페이스 대비 ${Math.abs(paceDiff).toFixed(1)}${unit} 앞서가는 중`
                  : `이상 페이스 대비 ${Math.abs(paceDiff).toFixed(1)}${unit} 뒤처지는 중`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
