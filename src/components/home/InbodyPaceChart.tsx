"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CYCLE_WEEKS } from "@/utils/chartConstants";
import type { GoalChartData, InbodyChartOption } from "@/utils/goalChartData";
import type { InbodyMultiLineChartData } from "@/utils/goalChartData";
import type { InbodyGoal, InbodyMetricKey } from "@/types/quest";
import { usePaceChartData } from "./usePaceChartData";

const METRIC_LABELS: Record<InbodyMetricKey, string> = {
  weight: "체중",
  muscleMass: "골격근",
  fatPercent: "체지방률",
};

/** 통일 색상: 1번=초록, 2번=주황, 3번=파랑 */
const METRIC_COLORS: Record<InbodyMetricKey, string> = {
  fatPercent: "#a3e635",
  muscleMass: "#f97316",
  weight: "#38bdf8",
};

interface InbodyPaceChartProps {
  data: GoalChartData | InbodyMultiLineChartData | null;
  subTab: InbodyChartOption;
  lineColor?: string;
  inbodyGoal?: InbodyGoal | null;
  onSelectMetric?: (metric: InbodyChartOption) => void;
  /** 목표 설정일 (YYYY-MM-DD) - X축 mm-dd 라벨용 */
  configuredAt?: string | null;
}

function isMultiLine(
  data: GoalChartData | InbodyMultiLineChartData | null
): data is InbodyMultiLineChartData {
  return data !== null && "sessions" in data && "series" in data;
}

export default function InbodyPaceChart({
  data,
  subTab,
  lineColor,
  inbodyGoal,
  onSelectMetric,
  configuredAt,
}: InbodyPaceChartProps) {
  if (!data) {
    return (
      <div className="py-12 text-center text-xs text-neutral-600">
        인바디 기록이 2개 이상 필요합니다
      </div>
    );
  }

  if (isMultiLine(data)) {
    return <InbodyDashboardCards data={data} onSelectMetric={onSelectMetric} />;
  }

  const mainMetric = subTab as InbodyMetricKey;
  return (
    <InbodySingleChart
      data={data}
      mainMetric={mainMetric}
      isMain={inbodyGoal?.mainMetric === mainMetric}
      lineColor={lineColor ?? METRIC_COLORS[mainMetric]}
      configuredAt={configuredAt}
    />
  );
}

function Sparkline({ values, color, invertGood }: { values: number[]; color: string; invertGood: boolean }) {
  if (values.length < 2) return null;
  const w = 80;
  const h = 28;
  const pad = 2;
  const cw = w - pad * 2;
  const ch = h - pad * 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const toX = (i: number) => pad + (i / (values.length - 1)) * cw;
  const toY = (v: number) => {
    const norm = (v - min) / range;
    return invertGood ? pad + norm * ch : pad + ch - norm * ch;
  };
  const points = values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      <circle
        cx={toX(values.length - 1)}
        cy={toY(values[values.length - 1])}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

function InbodyDashboardCards({
  data,
  onSelectMetric,
}: {
  data: InbodyMultiLineChartData;
  onSelectMetric?: (metric: InbodyChartOption) => void;
}) {
  const { series } = data;

  return (
    <div className="grid grid-cols-3 gap-2">
      {series.map((s) => {
        const vals = s.values;
        const current = vals[vals.length - 1];
        const start = vals[0];
        const delta = current - start;
        const invertGood = s.metricKey === "fatPercent" || s.metricKey === "weight";
        const isGood = invertGood ? delta <= 0 : delta >= 0;
        const color = METRIC_COLORS[s.metricKey];

        return (
          <button
            key={s.metricKey}
            type="button"
            onClick={() => onSelectMetric?.(s.metricKey as InbodyChartOption)}
            className="bg-neutral-950/80 rounded-2xl p-3 text-center transition-all hover:bg-neutral-900/80 hover:border-neutral-700 border border-neutral-800/50"
          >
            <div className="text-[10px] text-neutral-500 font-mono uppercase mb-1">
              {METRIC_LABELS[s.metricKey]}
            </div>
            <div className="font-bebas text-lg" style={{ color }}>
              {current}{s.unit}
            </div>
            <div className={`text-[10px] font-bold flex items-center justify-center gap-0.5 ${isGood ? "text-lime-400" : "text-orange-400"}`}>
              {delta >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}{s.unit}
            </div>
            <div className="mt-1">
              <Sparkline values={vals} color={color} invertGood={invertGood} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function formatDateLabel(configuredAt: string | null | undefined, weekIndex: number): string {
  if (!configuredAt) return weekIndex === 0 ? "시작" : `W${weekIndex}`;
  const d = new Date(configuredAt);
  d.setDate(d.getDate() + weekIndex * 7);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${m}-${day}`;
}

function InbodySingleChart({
  data,
  mainMetric,
  isMain,
  lineColor,
  configuredAt,
}: {
  data: GoalChartData;
  mainMetric: InbodyMetricKey;
  isMain: boolean;
  lineColor: string;
  configuredAt?: string | null;
}) {
  const invertGood = mainMetric === "weight" || mainMetric === "fatPercent";
  const {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek,
    unit,
    dataPoints,
  } = data;
  const maxWeek = CYCLE_WEEKS;
  const { dims, yMinNice, yRangeNice, toX, toY, paceDiff, isAhead } =
    usePaceChartData(startValue, targetValue, weeklyDelta, history, maxWeek);
  const { padLeft, chartW, padTop } = dims;

  const pointsToRender = dataPoints && dataPoints.length > 0
    ? dataPoints!.sort((a, b) => a.day - b.day)
    : history.map((h) => ({ day: h.week * 7, value: h.recorded, date: "" }));

  return (
    <div className="w-full min-h-[240px] overflow-visible">
      <svg
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        className="w-full h-auto min-h-[240px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
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
        {Array.from({ length: maxWeek + 1 }, (_, i) => {
          const x = toX(i);
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

        {Array.from({ length: maxWeek + 1 }, (_, i) => {
          const week = i;
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
                {formatDateLabel(configuredAt, week)}
              </text>
            </g>
          );
        })}

        {/* Ideal pace line (dashed) */}
        <polyline
          points={Array.from({ length: maxWeek + 1 }, (_, i) => {
            const val = startValue + (targetValue - startValue) * (i / maxWeek);
            return `${toX(i)},${toY(val)}`;
          }).join(" ")}
          fill="none"
          stroke={lineColor}
          strokeWidth={isMain ? 1.5 : 1}
          strokeDasharray={isMain ? "4 5" : "3 6"}
          opacity={0.5}
        />

        {/* Target line */}
        <line
          x1={padLeft}
          y1={toY(targetValue)}
          x2={padLeft + chartW}
          y2={toY(targetValue)}
          stroke={lineColor}
          strokeWidth={2}
          opacity={0.7}
        />

        {/* 목표 + 수치 통합 배지 */}
        {(() => {
          const label = `목표 ${targetValue}${unit}`;
          const badgeW = Math.max(100, label.length * 8);
          const badgeH = 22;
          const badgeX = padLeft + chartW - badgeW - 8;
          const badgeY = toY(targetValue) - badgeH / 2;
          const textX = badgeX + badgeW / 2;
          const textY = badgeY + badgeH / 2 + 4;
          return (
            <>
              <rect
                x={badgeX}
                y={badgeY}
                width={badgeW}
                height={badgeH}
                rx={6}
                fill="#0a0a0a"
                stroke={lineColor}
                strokeWidth={1}
                opacity={0.95}
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill={lineColor}
              >
                {label}
              </text>
            </>
          );
        })()}

        {/* Actual recorded line */}
        {pointsToRender.length > 0 && (
          <polyline
            points={[
              `${toX(0)},${toY(startValue)}`,
              ...pointsToRender.map((p) => `${toX(p.day / 7)},${toY(p.value)}`),
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

        {pointsToRender.map((p, i) => {
          const isCurrent = i === pointsToRender.length - 1;
          const x = toX(p.day / 7);
          const y = toY(p.value);
          const boxH = 24;
          const boxTop = y - 36;
          const showAbove = boxTop >= padTop + 4;
          if (isCurrent) {
            const labelText = `${Number(p.value)}${unit}`;
            const boxW = 96;
            const rectX = x - boxW / 2;
            const rectY = showAbove ? y - 36 : y + 10;
            const labelY = rectY + boxH / 2 + 4;
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
                  x={rectX}
                  y={rectY}
                  width={boxW}
                  height={boxH}
                  rx={6}
                  fill="#0a0a0a"
                  stroke={lineColor}
                  strokeWidth={1.5}
                  opacity={0.95}
                />
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill={lineColor}
                >
                  {labelText}
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

      {pointsToRender.length > 0 && (
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>현재: <span className="font-mono text-white">{data.latestMetric}{unit}</span></span>
            <span>이전: <span className="font-mono">{pointsToRender.length >= 2 ? pointsToRender[pointsToRender.length - 2].value : data.startValue}{unit}</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${(() => {
              const prevVal = pointsToRender.length >= 2 ? pointsToRender[pointsToRender.length - 2].value : data.startValue;
              const diff = data.latestMetric - prevVal;
              const isGood = invertGood ? diff <= 0 : diff >= 0;
              return isGood ? "text-lime-400" : "text-orange-400";
            })()}`}>
              변화: {(data.latestMetric - (pointsToRender.length >= 2 ? pointsToRender[pointsToRender.length - 2].value : data.startValue)) >= 0 ? "+" : ""}
              {(data.latestMetric - (pointsToRender.length >= 2 ? pointsToRender[pointsToRender.length - 2].value : data.startValue)).toFixed(1)}{unit}
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
