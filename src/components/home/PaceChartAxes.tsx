import type { PaceChartDimensions } from "./usePaceChartData";

/** configuredAt(YYYY-MM-DD) + 주차 인덱스 → mm-dd */
function formatDateLabel(configuredAt: string | null | undefined, weekIndex: number): string {
  if (!configuredAt) return weekIndex === 0 ? "시작" : `W${weekIndex}`;
  const d = new Date(configuredAt);
  d.setDate(d.getDate() + weekIndex * 7);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${m}-${day}`;
}

/** configuredAt + 경과 일수(day) → mm-dd */
function formatDateLabelByDay(configuredAt: string | null | undefined, day: number): string {
  if (!configuredAt) return day === 0 ? "시작" : `D${day}`;
  const d = new Date(configuredAt);
  d.setDate(d.getDate() + day);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const dayNum = d.getDate().toString().padStart(2, "0");
  return `${m}-${dayNum}`;
}

interface PaceChartAxesProps {
  dims: PaceChartDimensions;
  maxWeek: number;
  yMinNice: number;
  yRangeNice: number;
  toX: (week: number) => number;
  toY: (val: number) => number;
  /** Day-based mode: adaptive X축 (maxDays, toXDay 사용) */
  dayMode?: { maxDays: number; toXDay: (day: number) => number };
  formatValue?: (v: number) => string;
  /** 목표 설정일 기준 mm-dd X축 라벨 */
  configuredAt?: string | null;
}

export default function PaceChartAxes({
  dims,
  maxWeek,
  yMinNice,
  yRangeNice,
  toX,
  toY,
  dayMode,
  formatValue = (v) => String(v),
  configuredAt,
}: PaceChartAxesProps) {
  const { padLeft, padTop, chartW, chartH } = dims;

  const tickInterval = dayMode
    ? Math.max(1, Math.ceil(dayMode.maxDays / 6))
    : 1;
  const xTicks = dayMode
    ? (() => {
        const ticks: { x: number; label: string }[] = [];
        for (let day = 0; day <= dayMode.maxDays; day += tickInterval) {
          const clampedDay = Math.min(day, dayMode.maxDays);
          ticks.push({
            x: dayMode.toXDay(clampedDay),
            label: formatDateLabelByDay(configuredAt, clampedDay),
          });
          if (clampedDay >= dayMode.maxDays) break;
        }
        if (ticks.length > 0 && ticks[ticks.length - 1]!.x !== dayMode.toXDay(dayMode.maxDays)) {
          ticks.push({
            x: dayMode.toXDay(dayMode.maxDays),
            label: formatDateLabelByDay(configuredAt, dayMode.maxDays),
          });
        }
        return ticks;
      })()
    : Array.from({ length: maxWeek + 1 }, (_, i) => ({
        x: toX(i),
        label: formatDateLabel(configuredAt, i),
      }));

  const verticalGridSource = dayMode
    ? xTicks.map((t) => t.x)
    : Array.from({ length: maxWeek + 1 }, (_, i) => toX(i));

  return (
    <>
      {/* Chart frame */}
      <rect x={padLeft} y={padTop} width={chartW} height={chartH}
        fill="none" stroke="var(--chart-frame)" rx={2} />

      {/* Horizontal grid lines */}
      {Array.from({ length: 5 }, (_, i) => {
        const y = yMinNice + (i / 4) * yRangeNice;
        const py = toY(y);
        return <line key={`h-${i}`} x1={padLeft} y1={py} x2={padLeft + chartW} y2={py}
          stroke="var(--chart-grid-h)" strokeWidth={0.5} />;
      })}

      {/* Vertical grid lines */}
      {verticalGridSource.map((x, i) => (
        <line key={`v-${i}`} x1={x} y1={padTop} x2={x} y2={padTop + chartH}
          stroke="var(--chart-grid-v)" strokeWidth={0.5} />
      ))}

      {/* Y-axis ticks */}
      {Array.from({ length: 5 }, (_, i) => {
        const y = yMinNice + (i / 4) * yRangeNice;
        const py = toY(y);
        return (
          <g key={`ytick-${i}`}>
            <line x1={padLeft - 4} y1={py} x2={padLeft} y2={py} stroke="var(--chart-tick)" strokeWidth={1} />
            <text x={padLeft - 6} y={py + 3} textAnchor="end" fontSize={9} fontWeight="bold" fill="var(--chart-tick-text)">
              {formatValue(y)}
            </text>
          </g>
        );
      })}

      {/* X-axis ticks */}
      {xTicks.map((tick, i) => (
        <g key={`xtick-${i}`}>
          <line
            x1={tick.x}
            y1={padTop + chartH}
            x2={tick.x}
            y2={padTop + chartH + 4}
            stroke="var(--chart-tick)"
            strokeWidth={1}
          />
          <text
            x={tick.x}
            y={padTop + chartH + 14}
            textAnchor="middle"
            fontSize={9}
            fill={i === 0 ? "var(--chart-tick-text-bold)" : "var(--chart-tick-text)"}
            fontWeight={i === 0 ? "bold" : "normal"}
          >
            {tick.label}
          </text>
        </g>
      ))}
    </>
  );
}
