"use client";

import type { AbilityResults } from "@/types";
import { usePentagonPoints } from "./usePentagonPoints";

interface PentagonRadarChartProps {
  results: AbilityResults;
}

export default function PentagonRadarChart({ results }: PentagonRadarChartProps) {
  const cx = 150;
  const cy = 150;
  const maxRadius = 120;

  const { gridPaths, axisLines, dataPolygonPath, vertices } = usePentagonPoints(
    results, cx, cy, maxRadius
  );

  return (
    <div className="rounded-2xl p-5 overflow-visible" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
      <h3 className="font-bebas text-base font-bold tracking-wider mb-4 text-center transition-colors duration-300" style={{ color: "var(--accent-main)" }}>
        나의 능력치 밸런스
      </h3>

      <svg viewBox="-90 -90 480 480" className="w-full max-w-[340px] mx-auto block overflow-visible" style={{ minHeight: 340 }}>
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.2" />
            <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="75%" stopColor="#4ade80" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {gridPaths.map(({ level, path }) => (
          <path key={level} d={path} fill="none" stroke="var(--border-light)" strokeWidth="1" />
        ))}

        {axisLines.map(({ index, x2, y2 }) => (
          <line key={index} x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--border-light)" strokeWidth="1" strokeOpacity="0.6" />
        ))}

        {dataPolygonPath && (
          <path
            d={dataPolygonPath}
            fill="url(#radarFill)"
            stroke="var(--accent-main)"
            strokeWidth="2"
            style={{ transition: "all 0.8s ease-out" }}
          />
        )}

        {vertices.map((v) => (
          <g key={v.index}>
            {v.isUnmeasured ? (
              <>
                <line x1={cx} y1={cy} x2={v.outerX} y2={v.outerY}
                  stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" />
                <text x={v.outerX} y={v.outerY} textAnchor="middle" dominantBaseline="middle"
                  fill="var(--text-main)" fontSize="16" fontWeight="bold">?</text>
              </>
            ) : (
              <circle cx={v.dotX} cy={v.dotY} r="5" fill={v.color} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            )}
            <text x={v.labelX} y={v.labelY} textAnchor="middle" dominantBaseline="middle"
              fill="var(--text-main)" fontSize="13" fontWeight="bold" fontFamily="ui-sans-serif, system-ui, sans-serif">
              {v.label} {v.score ?? "?"}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
