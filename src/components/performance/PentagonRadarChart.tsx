"use client";

import type { AbilityResults } from "@/types";
import { ABILITY_CATEGORIES } from "@/config/abilityConfig";

function pentagonPoint(
  centerX: number,
  centerY: number,
  radius: number,
  index: number
) {
  const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

interface PentagonRadarChartProps {
  results: AbilityResults;
}

export default function PentagonRadarChart({ results }: PentagonRadarChartProps) {
  const cx = 150;
  const cy = 150;
  const maxRadius = 120;
  const gridLevels = [0.33, 0.66, 1];

  const scores = ABILITY_CATEGORIES.map((cat) => {
    const r = results[cat.id];
    return r ? r.score : null;
  });

  const hasAnyData = scores.some((s) => s !== null);

  return (
    <div className="rounded-2xl p-5 bg-neutral-900 border border-neutral-800">
      <h3 className="font-bebas text-base text-lime-400 tracking-wider mb-4 text-center">
        나의 능력치 밸런스
      </h3>

      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[280px] mx-auto block"
        style={{ minHeight: 280 }}
      >
        <defs>
          <linearGradient
            id="radarFill"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.2" />
            <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="75%" stopColor="#4ade80" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Grid levels 33%, 66%, 100% */}
        {gridLevels.map((level) => {
          const r = maxRadius * level;
          const pts = [0, 1, 2, 3, 4].map((i) =>
            pentagonPoint(cx, cy, r, i)
          );
          const path =
            pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
            " Z";
          return (
            <path
              key={level}
              d={path}
              fill="none"
              stroke="#404040"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const end = pentagonPoint(cx, cy, maxRadius, i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(64,64,64,0.5)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon - only when we have at least one measurement */}
        {hasAnyData && (
          <path
            d={
              [0, 1, 2, 3, 4]
                .map((i) => {
                  const s = scores[i] ?? 0;
                  const r = maxRadius * (s / 100);
                  const p = pentagonPoint(cx, cy, r, i);
                  return (i === 0 ? "M" : "L") + ` ${p.x} ${p.y}`;
                })
                .join(" ") + " Z"
            }
            fill="url(#radarFill)"
            stroke="#a3e635"
            strokeWidth="2"
            style={{ transition: "all 0.8s ease-out" }}
          />
        )}

        {/* Vertex dots / unmeasured markers + labels - always show */}
        {[0, 1, 2, 3, 4].map((i) => {
          const s = scores[i];
          const cat = ABILITY_CATEGORIES[i];
          const r = maxRadius * ((s ?? 0) / 100);
          const p = pentagonPoint(cx, cy, r, i);
          const outerPt = pentagonPoint(cx, cy, maxRadius, i);
          const labelPt = pentagonPoint(cx, cy, maxRadius + 18, i);
          const isUnmeasured = s === null;
          return (
            <g key={i}>
              {isUnmeasured ? (
                <>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={outerPt.x}
                    y2={outerPt.y}
                    stroke="#525252"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={outerPt.x}
                    y={outerPt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#737373"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                </>
              ) : (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill={cat.color}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />
              )}
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#a3a3a3"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                {cat.label} {s ?? "?"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
