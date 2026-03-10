"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { MultiLineChartData } from "@/utils/goalChartData";

function Sparkline({
  values,
  color,
  invertGood,
}: {
  values: number[];
  color: string;
  invertGood: boolean;
}) {
  if (values.length < 2) return null;
  const w = 80;
  const h = 28;
  const pad = 2;
  const cw = w - pad * 2;
  const ch = h - pad * 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const toX = (i: number) => pad + (i / (values.length - 1)) * cw;
  const toY = (v: number) => {
    const norm = (v - min) / range;
    return invertGood ? pad + norm * ch : pad + ch - norm * ch;
  };
  const points = values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      <circle
        cx={toX(values.length - 1)}
        cy={toY(values[values.length - 1])}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

interface MetricsDashboardCardsProps {
  data: MultiLineChartData;
  onSelectMetric?: (subTab: string) => void;
  invertGood?: boolean;
}

export default function MetricsDashboardCards({
  data,
  onSelectMetric,
  invertGood = false,
}: MetricsDashboardCardsProps) {
  const { series } = data;

  return (
    <div className="grid grid-cols-3 gap-2">
      {series.map((s) => {
        const vals = s.values;
        const current = vals[vals.length - 1];
        const start = vals[0];
        const delta = current - start;
        const isGood = invertGood ? delta <= 0 : delta >= 0;

        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onSelectMetric?.(s.key)}
            className="bg-neutral-950/80 rounded-2xl p-3 text-center transition-all hover:bg-neutral-900/80 hover:border-neutral-700 border border-neutral-800/50"
          >
            <div className="text-[10px] text-neutral-500 font-mono uppercase mb-1">
              {s.label}
            </div>
            <div className="font-bebas text-lg" style={{ color: s.color }}>
              {current}{s.unit}
            </div>
            <div
              className={`text-[10px] font-bold flex items-center justify-center gap-0.5 ${
                isGood ? "text-lime-400" : "text-orange-400"
              }`}
            >
              {delta >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}
              {s.unit}
            </div>
            <div className="mt-1">
              <Sparkline values={vals} color={s.color} invertGood={invertGood} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
