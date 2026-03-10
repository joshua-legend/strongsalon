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

interface PaceChartAxesProps {
  dims: PaceChartDimensions;
  maxWeek: number;
  yMinNice: number;
  yRangeNice: number;
  toX: (week: number) => number;
  toY: (val: number) => number;
  /** Day-based mode: X축 W1, W2, ... (maxWeeks, toXDay 사용) */
  dayMode?: { maxWeeks: number; toXDay: (day: number) => number };
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

  const xTicks = dayMode
    ? Array.from({ length: dayMode.maxWeeks + 1 }, (_, i) => ({
        x: dayMode.toXDay(i * 7),
        label: formatDateLabel(configuredAt, i),
      }))
    : Array.from({ length: maxWeek + 1 }, (_, i) => ({
        x: toX(i),
        label: formatDateLabel(configuredAt, i),
      }));

  return (
    <>
      {/* Chart frame */}
      <rect x={padLeft} y={padTop} width={chartW} height={chartH}
        fill="none" stroke="#1a1a1a" rx={2} />

      {/* Horizontal grid lines */}
      {Array.from({ length: 5 }, (_, i) => {
        const y = yMinNice + (i / 4) * yRangeNice;
        const py = toY(y);
        return <line key={`h-${i}`} x1={padLeft} y1={py} x2={padLeft + chartW} y2={py}
          stroke="#2a2a2a" strokeWidth={0.5} />;
      })}

      {/* Vertical grid lines */}
      {Array.from({ length: maxWeek + 1 }, (_, i) => {
        const x = toX(i);
        return <line key={`v-${i}`} x1={x} y1={padTop} x2={x} y2={padTop + chartH}
          stroke="#1f1f1f" strokeWidth={0.5} />;
      })}

      {/* Y-axis ticks */}
      {Array.from({ length: 5 }, (_, i) => {
        const y = yMinNice + (i / 4) * yRangeNice;
        const py = toY(y);
        return (
          <g key={`ytick-${i}`}>
            <line x1={padLeft - 4} y1={py} x2={padLeft} y2={py} stroke="#404040" strokeWidth={1} />
            <text x={padLeft - 6} y={py + 3} textAnchor="end" fontSize={9} fontWeight="bold" fill="#a3a3a3">
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
            stroke="#525252"
            strokeWidth={1}
          />
          <text
            x={tick.x}
            y={padTop + chartH + 14}
            textAnchor="middle"
            fontSize={9}
            fill={i === 0 ? "#d4d4d4" : "#737373"}
            fontWeight={i === 0 ? "bold" : "normal"}
          >
            {tick.label}
          </text>
        </g>
      ))}
    </>
  );
}
