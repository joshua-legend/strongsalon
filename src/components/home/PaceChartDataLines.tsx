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
  const ACTUAL_COLOR = "var(--chart-line-lime)";
  const IDEAL_COLOR = "var(--text-sub)";
  const TARGET_COLOR = "var(--chart-line-sky)";
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

  const targetY = toY(targetValue);

  return (
    <>
      {/* Target line (점선) */}
      <line
        x1={padLeft}
        y1={targetY}
        x2={padLeft + chartW}
        y2={targetY}
        stroke={TARGET_COLOR}
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.7}
      />

      {/* 목표 + 수치 통합 배지 - 왼쪽 배치로 현재 배지와 겹침 방지 */}
      {(() => {
        const label = `목표 ${formatValue(targetValue)}${unit}`;
        const badgeW = Math.max(100, label.length * 8);
        const badgeH = 22;
        const badgeX = padLeft + 8;
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
              fill="var(--chart-badge-bg)"
              stroke={TARGET_COLOR}
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              fontSize={10}
              fontWeight="bold"
              fill={TARGET_COLOR}
            >
              {label}
            </text>
          </>
        );
      })()}

      {/* Ideal pace line (점선) */}
      <path
        d={idealPathD}
        fill="none"
        stroke={IDEAL_COLOR}
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.8}
      />

      {/* Actual recorded line (smooth curve) */}
      {actualPathD && (
        <path
          d={actualPathD}
          fill="none"
          stroke={ACTUAL_COLOR}
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
          const badgeW = 50;
          const targetBadgeLeft = padLeft + 8;
          const targetBadgeRight = targetBadgeLeft + Math.max(100, 12 * 8);
          const currentBadgeLeft = x - badgeW / 2;
          const overlapsTarget = currentBadgeLeft < targetBadgeRight + 8;
          const rectX = overlapsTarget ? Math.min(x + 12, padLeft + chartW - badgeW - 4) : x - badgeW / 2;
          const textX = rectX + badgeW / 2;
          return (
            <g key={`dot-${i}`}>
              <circle cx={x} cy={y} r={7} fill={ACTUAL_COLOR} filter="url(#dotGlow)" />
              <circle cx={x} cy={y} r={3} fill="var(--chart-badge-bg)" />
              <rect x={rectX} y={y - 28} width={badgeW} height={20} rx={4}
                fill="var(--chart-badge-bg)" stroke={ACTUAL_COLOR} strokeWidth={1} />
              <polygon points={`${x - 4},${y - 8} ${x + 4},${y - 8} ${x},${y - 4}`}
                fill="var(--chart-badge-bg)" stroke={ACTUAL_COLOR} strokeWidth={1} />
              <text x={textX} y={y - 14} textAnchor="middle" fontSize={10} fontWeight="bold" fill={ACTUAL_COLOR}>
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
            <circle cx={x} cy={y} r={4} fill="var(--chart-badge-bg)"
              stroke={passed ? ACTUAL_COLOR : "#f97316"} strokeWidth={2} />
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
        return (
          <g>
            <circle
              cx={ghostX}
              cy={ghostY}
              r={5}
              fill="none"
              stroke={IDEAL_COLOR}
              strokeOpacity={0.8}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <text x={ghostX + 10} y={ghostY + 3} fontSize={9} fontWeight="bold" fill={IDEAL_COLOR} opacity={0.9}>
              이상 페이스
            </text>
          </g>
        );
      })()}
    </>
  );
}
