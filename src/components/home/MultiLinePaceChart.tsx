"use client";

import type { MultiLineChartData } from "@/utils/goalChartData";

function niceRound(step: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  if (norm <= 1) return mag;
  if (norm <= 2) return 2 * mag;
  if (norm <= 5) return 5 * mag;
  return 10 * mag;
}

interface MultiLinePaceChartProps {
  data: MultiLineChartData;
  invertY?: boolean;
}

export default function MultiLinePaceChart({ data, invertY = false }: MultiLinePaceChartProps) {
  const { sessions, series, unit } = data;
  const n = sessions.length;
  if (n < 2 || series.length === 0) return null;

  const width = 400;
  const height = 240;
  const padLeft = 48;
  const padRight = 16;
  const padTop = 24;
  const padBottom = 40;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const allValues = series.flatMap((s) => s.values);
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yRange = yMax - yMin || 1;
  const step = niceRound(yRange / 5);
  const yMinNice = Math.floor(yMin / step) * step;
  const yMaxNice = Math.ceil(yMax / step) * step;
  const yRangeNice = yMaxNice - yMinNice || step;

  const toX = (i: number) => padLeft + (i / (n - 1)) * chartW;
  const toY = (v: number) => {
    const norm = (v - yMinNice) / yRangeNice;
    return invertY ? padTop + norm * chartH : padTop + chartH - norm * chartH;
  };

  return (
    <div className="w-full min-h-[240px]">
      <div className="flex gap-4 mb-2 text-[10px] text-neutral-400">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1">
            <span className="w-4 h-0.5 rounded" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-h-[240px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="mlDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x={padLeft} y={padTop} width={chartW} height={chartH}
          fill="none" stroke="#1a1a1a" rx={2} />

        {Array.from({ length: 5 }, (_, i) => {
          const yVal = invertY
            ? yMinNice + (i / 4) * yRangeNice
            : yMinNice + ((4 - i) / 4) * yRangeNice;
          const py = toY(yVal);
          return (
            <g key={`g-${i}`}>
              <line x1={padLeft} y1={py} x2={padLeft + chartW} y2={py} stroke="#2a2a2a" strokeWidth={0.5} />
              <line x1={padLeft - 4} y1={py} x2={padLeft} y2={py} stroke="#404040" strokeWidth={1} />
              <text x={padLeft - 6} y={py + 3} textAnchor="end" fontSize={9} fontWeight="bold" fill="#a3a3a3">
                {Math.round(yVal * 10) / 10}
              </text>
            </g>
          );
        })}

        {sessions.map((sess, i) => {
          const x = toX(i);
          return (
            <g key={`x-${i}`}>
              <line x1={x} y1={padTop} x2={x} y2={padTop + chartH} stroke="#1f1f1f" strokeWidth={0.5} />
              <line x1={x} y1={padTop + chartH} x2={x} y2={padTop + chartH + 4} stroke="#525252" strokeWidth={1} />
              <text x={x} y={padTop + chartH + 14} textAnchor="middle" fontSize={9}
                fill={i === 0 ? "#d4d4d4" : "#737373"} fontWeight={i === 0 ? "bold" : "normal"}>
                {sess.label}
              </text>
            </g>
          );
        })}

        {series.map((s) => {
          const points = s.values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
          const last = s.values[s.values.length - 1];
          const lastX = toX(s.values.length - 1);
          const lastY = toY(last);
          return (
            <g key={s.key}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) => {
                const isLast = i === s.values.length - 1;
                return (
                  <circle
                    key={i}
                    cx={toX(i)}
                    cy={toY(v)}
                    r={isLast ? 5 : 3}
                    fill={s.color}
                    stroke="#0a0a0a"
                    strokeWidth={1}
                    filter={isLast ? "url(#mlDotGlow)" : undefined}
                  />
                );
              })}
              <text
                x={lastX + 6}
                y={lastY + 3}
                fontSize={9}
                fontWeight="bold"
                fill={s.color}
              >
                {last}{unit}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
