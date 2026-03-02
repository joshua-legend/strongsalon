"use client";

import { Dumbbell, Flame, Zap, Heart, Shield } from "lucide-react";
import type { AbilityStats } from "@/types";

const ABILITY_CONFIG: {
  key: keyof AbilityStats;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "strength", name: "근력", Icon: Dumbbell },
  { key: "endurance", name: "근지구력", Icon: Flame },
  { key: "explosiveness", name: "순발력", Icon: Zap },
  { key: "cardio", name: "심폐지구력", Icon: Heart },
  { key: "stability", name: "안정성", Icon: Shield },
];

export interface GrowthDelta {
  target: string;
  val: string;
}

interface AbilityRadarChartProps {
  stats: AbilityStats;
  growthDelta?: GrowthDelta | null;
  onMeasureClick?: () => void;
}

export default function AbilityRadarChart({
  stats,
  growthDelta,
  onMeasureClick,
}: AbilityRadarChartProps) {
  const cx = 100,
    cy = 100,
    R = 75;
  const n = 5;
  const angles = Array.from(
    { length: n },
    (_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n
  );

  const getPoint = (angle: number, pct: number) => ({
    x: cx + ((R * pct) / 100) * Math.cos(angle),
    y: cy + ((R * pct) / 100) * Math.sin(angle),
  });

  const gridLevels = [25, 50, 75, 100];
  const values = ABILITY_CONFIG.map((c) => stats[c.key] ?? 0);

  return (
    <div
      className="rounded-2xl p-5 bg-neutral-950 border border-lime-500/20"
      style={{
        background:
          "linear-gradient(135deg, rgba(163,230,53,.04), rgba(163,230,53,.01))",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-bebas text-base text-lime-400 tracking-wider">
          포식자 능력치 밸런스
        </h3>
        {growthDelta && (
          <span className="px-2.5 py-1 rounded-lg bg-lime-500/20 text-lime-400 text-[10px] font-bold border border-lime-500/40">
            지난주 대비 {growthDelta.target} {growthDelta.val}
          </span>
        )}
      </div>

      <div className="flex gap-4 items-stretch">
        <div className="shrink-0">
          <svg
            width="100%"
            viewBox="0 0 200 200"
            className="w-[140px] h-[140px] transition-all duration-500"
          >
            {gridLevels.map((level) => {
              const pts = angles.map((a) => getPoint(a, level));
              const path =
                pts
                  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                  .join(" ") + " Z";
              return (
                <path
                  key={level}
                  d={path}
                  fill="none"
                  stroke="#525252"
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
                  stroke="#525252"
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
              fill="rgba(163,230,53,0.3)"
              stroke="#a3e635"
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
                  fill="#a3e635"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          {ABILITY_CONFIG.map((c, i) => {
            const val = values[i];
            return (
              <div key={c.key} className="flex items-center gap-2">
                <c.Icon className="w-4 h-4 text-lime-500 shrink-0" />
                <span className="text-[11px] text-neutral-400 w-16 shrink-0">
                  {c.name}
                </span>
                <span className="text-[11px] font-bebas text-lime-400 w-6 text-right shrink-0">
                  {val}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-neutral-800 overflow-hidden min-w-[40px]">
                  <div
                    className="h-full rounded-full bg-lime-500 transition-all duration-500"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onMeasureClick && (
        <button
          onClick={onMeasureClick}
          className="w-full mt-4 py-3 rounded-xl text-sm font-bold bg-lime-500/20 text-lime-400 border border-lime-500/40 hover:bg-lime-500/30 transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)]"
        >
          능력치 밸런스 재측정
        </button>
      )}
    </div>
  );
}
