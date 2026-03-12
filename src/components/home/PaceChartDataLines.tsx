import type { WeekRecord } from "@/types/quest";
import type { ChartDataPoint } from "@/types/chartData";
import { pointsToSmoothPath } from "@/utils/chartPathUtils";

interface PaceChartDataLinesProps {
  startValue: number;
  targetValue: number;
  maxWeek: number;
  history: WeekRecord[];
  unit: string;
  padLeft: number;
  chartW: number;
  toX: (week: number) => number;
  toY: (val: number) => number;
  /** Day-based: dataPoints 우선, toXDay 사용 */
  dataPoints?: ChartDataPoint[];
  toXDay?: (day: number) => number;
  maxDays?: number;
  lineColor?: string;
  formatValue?: (v: number) => string;
}

export default function PaceChartDataLines({
  startValue,
  targetValue,
  maxWeek,
  history,
  unit,
  padLeft,
  chartW,
  toX,
  toY,
  dataPoints,
  toXDay,
  maxDays,
  lineColor = "#a3e635",
  formatValue = (v) => String(v),
}: PaceChartDataLinesProps) {
  const useDayMode = dataPoints != null && toXDay != null && maxDays != null;
  const x0 = useDayMode ? toXDay(0) : toX(0);
  const xEnd = useDayMode ? toXDay(maxDays) : toX(maxWeek);

  const idealPacePoints: { x: number; y: number }[] = useDayMode
    ? Array.from({ length: Math.ceil(maxDays / 7) + 1 }, (_, i) => {
        const day = Math.min(i * 7, maxDays);
        const val = startValue + (targetValue - startValue) * (day / maxDays);
        return { x: toXDay(day), y: toY(val) };
      })
    : Array.from({ length: maxWeek + 1 }, (_, i) => {
        const val = startValue + (targetValue - startValue) * (i / maxWeek);
        return { x: toX(i), y: toY(val) };
      });

  const actualPoints: { x: number; y: number }[] | null = useDayMode
    ? dataPoints!.length > 0
      ? [
          { x: toXDay(0), y: toY(startValue) },
          ...dataPoints!
            .sort((a, b) => a.day - b.day)
            .map((p) => ({ x: toXDay(p.day), y: toY(p.value) })),
        ]
      : null
    : history.length > 0
      ? [
          { x: toX(0), y: toY(startValue) },
          ...history.map((h) => ({ x: toX(h.week), y: toY(h.recorded) })),
        ]
      : null;

  const idealPathD = pointsToSmoothPath(idealPacePoints);
  const actualPathD = actualPoints ? pointsToSmoothPath(actualPoints) : null;

  const pointsToRender = useDayMode ? dataPoints! : history;
  const getPointCoords = useDayMode
    ? (p: ChartDataPoint) => ({ x: toXDay!(p.day), y: toY(p.value) })
    : (h: WeekRecord) => ({ x: toX(h.week), y: toY(h.recorded) });
  const getPointValue = useDayMode
    ? (p: ChartDataPoint) => p.value
    : (h: WeekRecord) => h.recorded;
  const getPointPassed = useDayMode ? () => true : (h: WeekRecord) => h.passed;

  const lineRgb = lineColor.startsWith("#")
    ? (() => {
        const hex = lineColor.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r},${g},${b},0.5)`;
      })()
    : "rgba(163,230,53,0.5)";

  const targetY = toY(targetValue);

  return (
    <>
      {/* Target line */}
      <line
        x1={padLeft}
        y1={targetY}
        x2={padLeft + chartW}
        y2={targetY}
        stroke={lineColor}
        strokeWidth={2}
        opacity={0.7}
      />

      {/* 목표 + 수치 통합 배지 */}
      {(() => {
        const label = `목표 ${formatValue(targetValue)}${unit}`;
        const badgeW = Math.max(100, label.length * 8);
        const badgeH = 22;
        const badgeX = padLeft + chartW - badgeW - 8;
        const badgeY = targetY - badgeH / 2;
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

      {/* Ideal pace line (dashed, smooth curve) */}
      <path
        d={idealPathD}
        fill="none"
        stroke={lineRgb}
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.9}
      />

      {/* Actual recorded line (smooth curve) */}
      {actualPathD && (
        <path
          d={actualPathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Start dot (W0) */}
      <circle cx={x0} cy={toY(startValue)} r={3} fill="#171717" stroke="#525252" strokeWidth={1} />

      {/* History dots */}
      {pointsToRender.map((item, i) => {
        const { x, y } = getPointCoords(item as ChartDataPoint & WeekRecord);
        const val = getPointValue(item as ChartDataPoint & WeekRecord);
        const passed = getPointPassed(item as ChartDataPoint & WeekRecord);
        const isCurrent = i === pointsToRender.length - 1;
        if (isCurrent) {
          return (
            <g key={`dot-${i}`}>
              <circle cx={x} cy={y} r={7} fill={lineColor} filter="url(#dotGlow)" />
              <circle cx={x} cy={y} r={3} fill="#0a0a0a" />
              <rect x={x - 25} y={y - 28} width={50} height={20} rx={4}
                fill="#171717" stroke={lineColor} strokeWidth={1} />
              <polygon points={`${x - 4},${y - 8} ${x + 4},${y - 8} ${x},${y - 4}`}
                fill="#171717" stroke={lineColor} strokeWidth={1} />
              <text x={x} y={y - 14} textAnchor="middle" fontSize={10} fontWeight="bold" fill={lineColor}>
                {formatValue(val)}{unit}
              </text>
            </g>
          );
        }
        return (
          <g key={`dot-${i}`}>
            {!passed && (
              <circle cx={x} cy={y} r={7} fill="none" stroke="#f97316" strokeWidth={1} opacity={0.3} />
            )}
            <circle cx={x} cy={y} r={4} fill="#0a0a0a"
              stroke={passed ? lineColor : "#f97316"} strokeWidth={2} />
          </g>
        );
      })}

      {/* Ghost marker (ideal pace current position) */}
      {(() => {
        const currentIdx = useDayMode
          ? (dataPoints!.length > 0 ? dataPoints![dataPoints!.length - 1].day : 0)
          : history.length;
        const maxIdx = useDayMode ? maxDays! : maxWeek;
        const ghostX = useDayMode ? toXDay!(currentIdx) : toX(currentIdx);
        const ghostY = toY(
          startValue + (targetValue - startValue) * (currentIdx / maxIdx)
        );
        if (pointsToRender.length === 0 || currentIdx >= maxIdx) return null;
        const ghostRgb = lineColor.startsWith("#")
          ? (() => {
              const hex = lineColor.slice(1);
              const r = parseInt(hex.slice(0, 2), 16);
              const g = parseInt(hex.slice(2, 4), 16);
              const b = parseInt(hex.slice(4, 6), 16);
              return `rgba(${r},${g},${b},0.6)`;
            })()
          : "rgba(163,230,53,0.6)";
        return (
          <g>
            <circle
              cx={ghostX}
              cy={ghostY}
              r={5}
              fill="none"
              stroke={ghostRgb}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <text x={ghostX + 10} y={ghostY + 3} fontSize={9} fontWeight="bold" fill={lineColor} opacity={0.9}>
              이상 페이스
            </text>
          </g>
        );
      })()}
    </>
  );
}
