"use client";

import { useMemo } from "react";
import type { CategorySettings } from "@/types/categorySettings";

type RadarGroup = "strength" | "stamina" | "inbody";

interface RadarAxis {
  id: string;
  label: string;
  group: RadarGroup;
  score: number;
  rawLabel: string;
}

const GROUP_THEME: Record<
  RadarGroup,
  { stroke: string; fill: string; text: string; label: string }
> = {
  strength: {
    stroke: "#f97316",
    fill: "rgba(249,115,22,0.14)",
    text: "#fdba74",
    label: "Strength",
  },
  stamina: {
    stroke: "#38bdf8",
    fill: "rgba(56,189,248,0.14)",
    text: "#7dd3fc",
    label: "Stamina",
  },
  inbody: {
    stroke: "#84cc16",
    fill: "rgba(132,204,22,0.14)",
    text: "#bef264",
    label: "Inbody",
  },
};

const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function readMetric(source: Record<string, number> | null | undefined, key: string) {
  const value = source?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  count: number,
  scale: number
) {
  const step = 360 / count;
  return Array.from({ length: count }, (_, idx) => {
    const point = polar(cx, cy, radius * scale, idx * step);
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(" ");
}

function sectorPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const p1 = polar(cx, cy, radius, startAngle);
  const p2 = polar(cx, cy, radius, endAngle);
  return `M ${cx} ${cy} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
}

function toStrengthScore(value: number) {
  if (value <= 0) return 0;
  return clamp((value / 220) * 100, 0, 100);
}

function toPaceScore(value: number) {
  if (value <= 0) return 0;
  return clamp(((10 - value) / 6) * 100, 0, 100);
}

function toFatScore(value: number) {
  if (value <= 0) return 0;
  return clamp(((35 - value) / 25) * 100, 0, 100);
}

function toMuscleScore(value: number) {
  if (value <= 0) return 0;
  return clamp(((value - 20) / 30) * 100, 0, 100);
}

function toWeightBalanceScore(value: number) {
  if (value <= 0) return 0;
  return clamp(100 - Math.abs(value - 70) * 2, 0, 100);
}

interface LevelNonagonCardProps {
  categorySettings: CategorySettings | undefined;
  accentColor: string;
}

export default function LevelNonagonCard({
  categorySettings,
  accentColor,
}: LevelNonagonCardProps) {
  const axes = useMemo<RadarAxis[]>(() => {
    const strengthValues = categorySettings?.strength?.startValues;
    const staminaValues = categorySettings?.fitness?.startValues;
    const inbodyValues = categorySettings?.inbody?.startValues;

    const squat = readMetric(strengthValues, "squat");
    const bench = readMetric(strengthValues, "bench");
    const deadlift = readMetric(strengthValues, "deadlift");
    const running = readMetric(staminaValues, "running");
    const rowing = readMetric(staminaValues, "rowing");
    const skierg = readMetric(staminaValues, "skierg");
    const weight = readMetric(inbodyValues, "weight");
    const muscleMass = readMetric(inbodyValues, "muscleMass");
    const fatPercent = readMetric(inbodyValues, "fatPercent");

    return [
      {
        id: "squat",
        label: "스쿼트",
        group: "strength",
        score: toStrengthScore(squat),
        rawLabel: squat > 0 ? `${Math.round(squat)}kg` : "-",
      },
      {
        id: "bench",
        label: "벤치",
        group: "strength",
        score: toStrengthScore(bench),
        rawLabel: bench > 0 ? `${Math.round(bench)}kg` : "-",
      },
      {
        id: "deadlift",
        label: "데드",
        group: "strength",
        score: toStrengthScore(deadlift),
        rawLabel: deadlift > 0 ? `${Math.round(deadlift)}kg` : "-",
      },
      {
        id: "running",
        label: "러닝",
        group: "stamina",
        score: toPaceScore(running),
        rawLabel: running > 0 ? `${running.toFixed(2)}분/km` : "-",
      },
      {
        id: "rowing",
        label: "로잉",
        group: "stamina",
        score: toPaceScore(rowing),
        rawLabel: rowing > 0 ? `${rowing.toFixed(2)}분/km` : "-",
      },
      {
        id: "skierg",
        label: "스키",
        group: "stamina",
        score: toPaceScore(skierg),
        rawLabel: skierg > 0 ? `${skierg.toFixed(2)}분/km` : "-",
      },
      {
        id: "weight",
        label: "체중",
        group: "inbody",
        score: toWeightBalanceScore(weight),
        rawLabel: weight > 0 ? `${weight.toFixed(1)}kg` : "-",
      },
      {
        id: "muscleMass",
        label: "골격근",
        group: "inbody",
        score: toMuscleScore(muscleMass),
        rawLabel: muscleMass > 0 ? `${muscleMass.toFixed(1)}kg` : "-",
      },
      {
        id: "fatPercent",
        label: "체지방",
        group: "inbody",
        score: toFatScore(fatPercent),
        rawLabel: fatPercent > 0 ? `${fatPercent.toFixed(1)}%` : "-",
      },
    ];
  }, [categorySettings]);

  const centerX = 150;
  const centerY = 144;
  const radius = 96;
  const step = 360 / axes.length;

  const radarPolygonPoints = useMemo(
    () =>
      axes
        .map((axis, idx) => {
          const point = polar(centerX, centerY, radius * (axis.score / 100), idx * step);
          return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
        })
        .join(" "),
    [axes, radius, step]
  );

  const averageScore = useMemo(() => {
    if (!axes.length) return 0;
    return Math.round(axes.reduce((sum, axis) => sum + axis.score, 0) / axes.length);
  }, [axes]);

  return (
    <div
      className="relative overflow-hidden rounded-[1.25rem] border p-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em]" style={{ color: "var(--text-sub)" }}>
            ABILITY RADAR
          </p>
          <p className="text-[13px] font-bold mt-0.5" style={{ color: "var(--text-main)" }}>
            9축 밸런스 맵
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold" style={{ color: "var(--text-sub)" }}>
            TOTAL
          </p>
          <p className="font-bebas text-[26px] leading-none" style={{ color: accentColor }}>
            {averageScore}
          </p>
        </div>
      </div>

      <svg viewBox="0 0 300 288" className="w-full h-auto">
        {axes.map((axis, idx) => {
          const start = idx * step - step / 2;
          const end = idx * step + step / 2;
          return (
            <path
              key={`sector-${axis.id}`}
              d={sectorPath(centerX, centerY, radius, start, end)}
              fill={GROUP_THEME[axis.group].fill}
              stroke="none"
            />
          );
        })}

        {GRID_LEVELS.map((level) => (
          <polygon
            key={`grid-${level}`}
            points={polygonPoints(centerX, centerY, radius, axes.length, level)}
            fill="none"
            stroke="var(--border-light)"
            strokeWidth={level === 1 ? 1.4 : 1}
            opacity={level === 1 ? 0.85 : 0.55}
          />
        ))}

        {axes.map((axis, idx) => {
          const outer = polar(centerX, centerY, radius, idx * step);
          const labelPoint = polar(centerX, centerY, radius + 20, idx * step);
          return (
            <g key={`axis-${axis.id}`}>
              <line
                x1={centerX}
                y1={centerY}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--border-light)"
                strokeWidth={0.9}
                opacity={0.7}
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9.5"
                fontWeight={700}
                fill={GROUP_THEME[axis.group].text}
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        <polygon
          points={radarPolygonPoints}
          fill={`${accentColor}33`}
          stroke={accentColor}
          strokeWidth={2}
        />

        {axes.map((axis, idx) => {
          const point = polar(centerX, centerY, radius * (axis.score / 100), idx * step);
          return (
            <circle
              key={`dot-${axis.id}`}
              cx={point.x}
              cy={point.y}
              r={3.2}
              fill={accentColor}
              stroke="var(--bg-card)"
              strokeWidth={1.1}
            />
          );
        })}
      </svg>

      <div className="mt-1 grid grid-cols-3 gap-2">
        {(["strength", "stamina", "inbody"] as const).map((group) => {
          const items = axes.filter((axis) => axis.group === group);
          return (
            <div
              key={`legend-${group}`}
              className="rounded-lg border px-2.5 py-2"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-body)",
              }}
            >
              <p className="text-[10px] font-bold mb-1" style={{ color: GROUP_THEME[group].text }}>
                {GROUP_THEME[group].label}
              </p>
              {items.map((item) => (
                <p key={`legend-item-${item.id}`} className="text-[10px] leading-4" style={{ color: "var(--text-sub)" }}>
                  {item.label}: {item.rawLabel}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

