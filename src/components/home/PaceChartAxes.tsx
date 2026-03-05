import type { PaceChartDimensions } from "./usePaceChartData";

interface PaceChartAxesProps {
  dims: PaceChartDimensions;
  maxWeek: number;
  yMinNice: number;
  yRangeNice: number;
  toX: (week: number) => number;
  toY: (val: number) => number;
}

export default function PaceChartAxes({
  dims,
  maxWeek,
  yMinNice,
  yRangeNice,
  toX,
  toY,
}: PaceChartAxesProps) {
  const { padLeft, padTop, chartW, chartH } = dims;

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
      {Array.from({ length: 7 }, (_, i) => {
        const x = padLeft + (i / 6) * chartW;
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
            <line x1={x} y1={padTop + chartH} x2={x} y2={padTop + chartH + 4}
              stroke="#525252" strokeWidth={1} />
            <text x={x} y={padTop + chartH + 14} textAnchor="middle" fontSize={9}
              fill={i === 0 ? "#d4d4d4" : "#737373"} fontWeight={i === 0 ? "bold" : "normal"}>
              {i === 0 ? "시작" : `W${Math.round(week)}`}
            </text>
          </g>
        );
      })}
    </>
  );
}
