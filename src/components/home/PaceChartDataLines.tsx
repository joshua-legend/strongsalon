import type { WeekRecord } from "@/types/quest";

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
}: PaceChartDataLinesProps) {
  return (
    <>
      {/* Target line */}
      <line x1={padLeft} y1={toY(targetValue)} x2={padLeft + chartW} y2={toY(targetValue)}
        stroke="#a3e635" strokeWidth={3} opacity={0.9} filter="url(#targetGlow)" />
      <rect x={padLeft} y={toY(targetValue) - 8} width={chartW} height={16}
        fill="#a3e635" opacity={0.08} />
      <text x={padLeft - 4} y={toY(targetValue) - 2} textAnchor="end" fontSize={10}
        fontWeight="bold" fill="#a3e635" opacity={1}>── 최종 목표</text>
      <rect x={padLeft + chartW - 62} y={toY(targetValue) - 11} width={60} height={22}
        rx={6} fill="#171717" stroke="#a3e635" strokeWidth={1.5} />
      <text x={padLeft + chartW - 32} y={toY(targetValue) + 3} textAnchor="middle"
        fontSize={11} fontWeight="bold" fill="#a3e635">
        {targetValue}{unit}
      </text>

      {/* Ideal pace line (dashed) */}
      <polyline
        points={Array.from({ length: maxWeek + 1 }, (_, i) => {
          const val = startValue + (targetValue - startValue) * (i / maxWeek);
          return `${toX(i)},${toY(val)}`;
        }).join(" ")}
        fill="none" stroke="rgba(163,230,53,0.5)" strokeWidth={2} strokeDasharray="6 4" opacity={0.9}
      />

      {/* Actual recorded line */}
      {history.length > 0 && (
        <polyline
          points={[
            `${toX(0)},${toY(startValue)}`,
            ...history.map((h) => `${toX(h.week)},${toY(h.recorded)}`),
          ].join(" ")}
          fill="none" stroke="#a3e635" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        />
      )}

      {/* Start dot (W0) */}
      <circle cx={toX(0)} cy={toY(startValue)} r={3} fill="#171717" stroke="#525252" strokeWidth={1} />

      {/* History dots */}
      {history.map((h, i) => {
        const isCurrent = i === history.length - 1;
        const x = toX(h.week);
        const y = toY(h.recorded);
        if (isCurrent) {
          return (
            <g key={`dot-${i}`}>
              <circle cx={x} cy={y} r={7} fill="#a3e635" filter="url(#dotGlow)" />
              <circle cx={x} cy={y} r={3} fill="#0a0a0a" />
              <rect x={x - 25} y={y - 28} width={50} height={20} rx={4}
                fill="#171717" stroke="#a3e635" strokeWidth={1} />
              <polygon points={`${x - 4},${y - 8} ${x + 4},${y - 8} ${x},${y - 4}`}
                fill="#171717" stroke="#a3e635" strokeWidth={1} />
              <text x={x} y={y - 14} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#a3e635">
                {h.recorded}{unit}
              </text>
            </g>
          );
        }
        return (
          <g key={`dot-${i}`}>
            {!h.passed && (
              <circle cx={x} cy={y} r={7} fill="none" stroke="#f97316" strokeWidth={1} opacity={0.3} />
            )}
            <circle cx={x} cy={y} r={4} fill="#0a0a0a"
              stroke={h.passed ? "#a3e635" : "#f97316"} strokeWidth={2} />
          </g>
        );
      })}

      {/* Ghost marker (ideal pace current position) */}
      {history.length > 0 && history.length <= maxWeek && (
        <g>
          <circle
            cx={toX(history.length)}
            cy={toY(startValue + (targetValue - startValue) * (history.length / maxWeek))}
            r={5} fill="none" stroke="rgba(163,230,53,0.6)" strokeWidth={1.5} strokeDasharray="3 3"
          />
          <text
            x={toX(history.length) + 10}
            y={toY(startValue + (targetValue - startValue) * (history.length / maxWeek)) + 3}
            fontSize={9} fontWeight="bold" fill="#a3e635" opacity={0.9}>
            이상 페이스
          </text>
        </g>
      )}
    </>
  );
}
