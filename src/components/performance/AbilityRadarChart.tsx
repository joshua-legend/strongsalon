"use client";

import type { AbilityStats } from "@/types";

const ABILITY_LABELS: { key: keyof AbilityStats; name: string }[] = [
  { key: "strength", name: "근력" },
  { key: "endurance", name: "근지구력" },
  { key: "explosiveness", name: "순발력" },
  { key: "cardio", name: "심폐지구력" },
  { key: "stability", name: "안정성" },
];

interface AbilityRadarChartProps {
  stats: AbilityStats;
}

export default function AbilityRadarChart({ stats }: AbilityRadarChartProps) {
  const cx = 100,
    cy = 100,
    R = 75;
  const n = 5;
  const angles = Array.from(
    { length: n },
    (_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n
  );

  const getPoint = (angle: number, pct: number) => ({
    x: cx + (R * pct) / 100 * Math.cos(angle),
    y: cy + (R * pct) / 100 * Math.sin(angle),
  });

  const gridLevels = [25, 50, 75, 100];
  const values = ABILITY_LABELS.map((l) => stats[l.key] ?? 0);

  return (
    <svg
      width="100%"
      viewBox="0 0 200 200"
      className="max-w-[200px] mx-auto transition-all duration-500"
    >
      {gridLevels.map((level) => {
        const pts = angles.map((a) => getPoint(a, level));
        const path =
          pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
          " Z";
        return (
          <path
            key={level}
            d={path}
            fill="none"
            stroke="#404040"
            strokeWidth="0.5"
          />
        );
      })}

      {angles.map((a, i) => {
        const end = getPoint(a, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#404040"
            strokeWidth="0.5"
          />
        );
      })}

      <path
        d={
          angles
            .map((a, i) => {
              const p = getPoint(a, values[i]);
              return (i === 0 ? "M" : "L") + ` ${p.x} ${p.y}`;
            })
            .join(" ") + " Z"
        }
        fill="rgba(249,115,22,0.2)"
        stroke="#f97316"
        strokeWidth="2"
      />
      {angles.map((a, i) => {
        const p = getPoint(a, values[i]);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#f97316"
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}

      {ABILITY_LABELS.map((l, i) => {
        const labelR = R + 18;
        const p = getPoint(angles[i], (labelR / R) * 100);
        return (
          <g key={i}>
            <text
              x={p.x}
              y={p.y - 6}
              textAnchor="middle"
              fill="#737373"
              fontSize="8"
              fontFamily='"Bebas Neue", cursive'
            >
              {l.name}
            </text>
            <text
              x={p.x}
              y={p.y + 8}
              textAnchor="middle"
              fill="#f97316"
              fontSize="10"
              fontWeight="bold"
              fontFamily='"Bebas Neue", cursive'
            >
              {values[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
