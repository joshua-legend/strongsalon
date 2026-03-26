"use client";

import { useState, type CSSProperties } from "react";
import {
  Activity,
  Dumbbell,
  Fingerprint,
  HeartPulse,
  Minus,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type MembershipTier = "standard" | "advanced" | "pro" | "elite" | "strong";
type StatTab = "strength" | "stamina" | "inbody";

interface TierTheme {
  id: MembershipTier;
  label: string;
  cardName: string;
  score: number;
  rank: string;
  color: string;
  softBg: string;
  gradient: string;
  borderColor: string;
}

interface TrackPoint {
  date: string;
  value: number;
}

interface StatConfig {
  id: StatTab;
  label: string;
  icon: LucideIcon;
  basePoints: number;
  unit: string;
  target: number;
  higherIsBetter: boolean;
  data: TrackPoint[];
}

const BRAND_NAME = "STRONG SALON";

const TIERS: TierTheme[] = [
  {
    id: "standard",
    label: "STANDARD",
    cardName: "Standard",
    score: 18420,
    rank: "TOP 18%",
    color: "#94a3b8",
    softBg: "rgba(148, 163, 184, 0.18)",
    gradient: "linear-gradient(135deg, #151b24 0%, #0f1520 100%)",
    borderColor: "rgba(148, 163, 184, 0.32)",
  },
  {
    id: "advanced",
    label: "ADVANCED",
    cardName: "Advanced",
    score: 22180,
    rank: "TOP 9%",
    color: "#38bdf8",
    softBg: "rgba(56, 189, 248, 0.18)",
    gradient: "linear-gradient(135deg, #111a29 0%, #12283d 100%)",
    borderColor: "rgba(56, 189, 248, 0.34)",
  },
  {
    id: "pro",
    label: "PRO",
    cardName: "Pro",
    score: 25630,
    rank: "TOP 4%",
    color: "#a3e635",
    softBg: "rgba(163, 230, 53, 0.2)",
    gradient: "linear-gradient(135deg, #141d14 0%, #1f2d17 100%)",
    borderColor: "rgba(163, 230, 53, 0.32)",
  },
  {
    id: "elite",
    label: "ELITE",
    cardName: "Elite",
    score: 27410,
    rank: "TOP 2%",
    color: "#f97316",
    softBg: "rgba(249, 115, 22, 0.2)",
    gradient: "linear-gradient(135deg, #1d1a18 0%, #3a2419 100%)",
    borderColor: "rgba(249, 115, 22, 0.35)",
  },
  {
    id: "strong",
    label: "THE STRONG",
    cardName: "The Strong",
    score: 28950,
    rank: "TOP 1%",
    color: "#d4af37",
    softBg: "rgba(212, 175, 55, 0.2)",
    gradient: "linear-gradient(135deg, #1a1917 0%, #2e2618 100%)",
    borderColor: "rgba(212, 175, 55, 0.36)",
  },
];

const STATS: StatConfig[] = [
  {
    id: "strength",
    label: "Strength",
    icon: Dumbbell,
    basePoints: 9800,
    unit: "kg",
    target: 80,
    higherIsBetter: true,
    data: [
      { date: "03-17", value: 55 },
      { date: "03-24", value: 60 },
      { date: "03-31", value: 60 },
      { date: "04-07", value: 65 },
      { date: "04-14", value: 70 },
    ],
  },
  {
    id: "stamina",
    label: "Stamina",
    icon: HeartPulse,
    basePoints: 9500,
    unit: "pt",
    target: 78,
    higherIsBetter: true,
    data: [
      { date: "03-17", value: 64 },
      { date: "03-24", value: 66 },
      { date: "03-31", value: 67 },
      { date: "04-07", value: 69 },
      { date: "04-14", value: 71 },
    ],
  },
  {
    id: "inbody",
    label: "Inbody",
    icon: Activity,
    basePoints: 9650,
    unit: "%",
    target: 20.5,
    higherIsBetter: false,
    data: [
      { date: "03-17", value: 24.2 },
      { date: "03-24", value: 23.8 },
      { date: "03-31", value: 23.4 },
      { date: "04-07", value: 22.9 },
      { date: "04-14", value: 22.3 },
    ],
  },
];

const TIER_POINT_BONUS: Record<MembershipTier, number> = {
  standard: -850,
  advanced: -350,
  pro: 150,
  elite: 520,
  strong: 0,
};

function getGrade(points: number) {
  if (points >= 9600) return "MASTER";
  if (points >= 9200) return "ELITE";
  if (points >= 8600) return "PRO";
  if (points >= 7900) return "ADVANCED";
  return "STANDARD";
}

function getTickStep(span: number) {
  if (span <= 5) return 1;
  if (span <= 12) return 2;
  if (span <= 30) return 5;
  if (span <= 80) return 10;
  return 20;
}

function formatValue(value: number, unit: string) {
  const numeric = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  return `${numeric} ${unit}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function PremiumLevelDashboard() {
  const [selectedTier, setSelectedTier] = useState<MembershipTier>("strong");
  const [selectedStat, setSelectedStat] = useState<StatTab>("strength");

  const activeTier = TIERS.find((tier) => tier.id === selectedTier) ?? TIERS[TIERS.length - 1];
  const pointBonus = TIER_POINT_BONUS[selectedTier];

  const statModels = STATS.map((stat) => {
    const points = stat.basePoints + pointBonus;
    return {
      ...stat,
      points,
      grade: getGrade(points),
    };
  });

  const activeStat = statModels.find((stat) => stat.id === selectedStat) ?? statModels[0];

  const xStart = 48;
  const xEnd = 384;
  const yTop = 24;
  const yBottom = 200;
  const plotHeight = yBottom - yTop;
  const plotWidth = xEnd - xStart;

  const values = activeStat.data.map((point) => point.value);
  const minRaw = Math.min(...values, activeStat.target);
  const maxRaw = Math.max(...values, activeStat.target);
  const span = Math.max(maxRaw - minRaw, 1);
  const step = getTickStep(span);
  const yMin = Math.floor((minRaw - step) / step) * step;
  const yMax = Math.ceil((maxRaw + step) / step) * step;
  const ySpan = Math.max(yMax - yMin, step);

  const points = activeStat.data.map((point, index) => {
    const x = xStart + (index / Math.max(activeStat.data.length - 1, 1)) * plotWidth;
    const y = yBottom - ((point.value - yMin) / ySpan) * plotHeight;
    return { ...point, x, y };
  });

  const targetY = yBottom - ((activeStat.target - yMin) / ySpan) * plotHeight;
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = yMax - (ySpan / 4) * index;
    const y = yTop + (plotHeight / 4) * index;
    return { value, y };
  });

  const current = points[points.length - 1]?.value ?? 0;
  const previous = points[points.length - 2]?.value ?? current;
  const delta = Number((current - previous).toFixed(activeStat.unit === "%" ? 1 : 0));
  const isNeutral = delta === 0;
  const isPositive = activeStat.higherIsBetter ? delta > 0 : delta < 0;
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendLabel = isNeutral
    ? "\uBCC0\uD654 \uC5C6\uC74C"
    : isPositive
      ? "\uAFB8\uC900\uD788 \uC131\uC7A5\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4"
      : "\uB9AC\uB4EC\uC744 \uB2E4\uC2DC \uB9DE\uCDB0\uBCF4\uC138\uC694";

  const deltaColor = isNeutral
    ? "var(--text-sub)"
    : isPositive
      ? activeTier.color
      : "var(--accent-danger)";

  const targetBadgeY = clamp(targetY - 12, 26, 172);

  const rootVars = {
    "--dynamic-theme-color": activeTier.color,
    "--dynamic-theme-bg": activeTier.softBg,
  } as CSSProperties;

  return (
    <div id="tab-level" className="block flex-1 space-y-6 px-5 py-6" style={rootVars}>
      <div id="view-card" className="block space-y-4">
        <div className="custom-scrollbar flex gap-1.5 overflow-x-auto pb-2">
          {TIERS.map((tier) => {
            const isActive = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                id={`btn-tier-${tier.id}`}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-all ${
                  isActive ? "shadow-sm" : ""
                }`}
                style={{
                  backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                  color: isActive ? "var(--text-main)" : "var(--text-sub)",
                  borderColor: isActive ? "var(--border-light)" : "transparent",
                }}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        <div
          id="membership-card"
          className="card-shine relative overflow-hidden rounded-[1.25rem] border p-6 shadow-2xl transition-all duration-700"
          style={{
            background: activeTier.gradient,
            borderColor: activeTier.borderColor,
          }}
        >
          <div className="iron-texture pointer-events-none absolute inset-0 opacity-[0.05]" />

          <div className="relative z-10 flex items-start justify-between">
            <span
              id="card-brand"
              className="text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-sm transition-colors duration-700"
              style={{ color: activeTier.color }}
            >
              {BRAND_NAME}
            </span>
            <Fingerprint
              id="card-icon"
              className="h-5 w-5 transition-colors duration-700"
              style={{ color: activeTier.color }}
            />
          </div>

          <div className="relative z-10 mb-7 mt-8">
            <h3
              id="card-tier-name"
              className="font-serif text-[32px] italic font-bold tracking-wide transition-colors duration-700"
              style={{ color: activeTier.color }}
            >
              {activeTier.cardName}
            </h3>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div className="flex flex-col">
              <span
                id="card-score-label"
                className="mb-0.5 text-[8px] uppercase tracking-widest transition-colors duration-700"
                style={{ color: `${activeTier.color}B3` }}
              >
                Total Score
              </span>
              <span
                id="card-score"
                className="font-bebas text-[30px] leading-none tracking-[0.08em] transition-colors duration-700"
                style={{ color: "#fef08a" }}
              >
                {activeTier.score.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span
                id="card-rank-label"
                className="mb-0.5 text-[8px] uppercase tracking-widest transition-colors duration-700"
                style={{ color: `${activeTier.color}B3` }}
              >
                Overall Rank
              </span>
              <span
                id="card-rank"
                className="font-bebas text-[24px] leading-none tracking-[0.08em] transition-colors duration-700"
                style={{ color: activeTier.color }}
              >
                {activeTier.rank}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 grid w-full grid-cols-3 gap-2">
          {statModels.map((stat) => {
            const isActive = selectedStat === stat.id;
            const Icon = stat.icon;
            return (
              <button
                key={stat.id}
                id={`card-btn-${stat.id}`}
                type="button"
                onClick={() => setSelectedStat(stat.id)}
                className="group relative flex flex-col justify-between gap-3 overflow-hidden rounded-[1.25rem] border p-3.5 text-left transition-all duration-500"
                style={{
                  background: isActive
                    ? "linear-gradient(145deg, var(--bg-card) 0%, var(--bg-body) 100%)"
                    : "var(--bg-body)",
                  borderColor: isActive ? activeTier.color : "var(--border-light)",
                  boxShadow: isActive
                    ? "0 8px 20px -4px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.05) inset"
                    : "none",
                  transform: isActive ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
                }}
              >
                <div
                  id={`card-glow-${stat.id}`}
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl transition-colors duration-500"
                  style={{
                    opacity: isActive ? 0.15 : 0,
                    backgroundColor: activeTier.color,
                  }}
                />
                <div className="relative z-10 flex w-full flex-col gap-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Icon
                      id={`card-icon-${stat.id}`}
                      className="h-3.5 w-3.5 transition-colors duration-300"
                      style={{ color: isActive ? activeTier.color : "var(--text-sub)" }}
                    />
                    <span
                      id={`card-lbl-${stat.id}`}
                      className="font-bebas text-[11px] tracking-wider transition-colors duration-300"
                      style={{ color: isActive ? activeTier.color : "var(--text-sub)" }}
                    >
                      {stat.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <span
                      id={`card-grade-${stat.id}`}
                      className="font-bebas text-[24px] leading-none transition-all duration-500"
                      style={{
                        color: isActive ? activeTier.color : "var(--text-sub)",
                        textShadow: isActive ? `0 0 12px ${activeTier.color}60` : "none",
                      }}
                    >
                      {stat.grade}
                    </span>
                  </div>
                </div>
                <div
                  className="relative z-10 w-full border-t pt-2.5 transition-colors duration-300"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <span
                    id={`card-pts-${stat.id}`}
                    className="font-mono text-[11px] font-bold transition-colors duration-300"
                    style={{ color: isActive ? activeTier.color : "var(--text-sub)" }}
                  >
                    {stat.points.toLocaleString()}
                    <span className="ml-0.5 text-[9px] font-normal">pts</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <section id="tracking-section" className="space-y-3 pt-2">
        <h2
          id="dashboard-title"
          className="text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
          style={{ color: "var(--text-sub)" }}
        >
          {activeStat.label} Dashboard
        </h2>

        <div
          className="relative overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <div
            id="chart-glow"
            className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl transition-colors duration-500"
            style={{ backgroundColor: activeTier.color }}
          />

          <div className="relative z-10 space-y-4 p-5">
            <div
              id="main-tabs"
              className="hidden rounded-full p-1 transition-colors duration-300"
              style={{
                backgroundColor: "var(--bg-body)",
                border: "1px solid var(--border-light)",
              }}
            />

            <div
              id="sub-tabs"
              className="flex flex-wrap gap-1 rounded-full p-1 transition-colors duration-300"
              style={{
                backgroundColor: "var(--bg-body)",
                border: "1px solid var(--border-light)",
              }}
            >
              {statModels.map((stat) => {
                const isActive = selectedStat === stat.id;
                return (
                  <button
                    key={`sub-${stat.id}`}
                    type="button"
                    onClick={() => setSelectedStat(stat.id)}
                    className="rounded-full border px-3 py-1.5 text-[10px] font-bold transition-all"
                    style={{
                      backgroundColor: isActive ? activeTier.softBg : "transparent",
                      color: isActive ? activeTier.color : "var(--text-sub)",
                      borderColor: isActive ? `${activeTier.color}66` : "transparent",
                    }}
                  >
                    {stat.label.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="pt-3">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div
                  className="flex items-center gap-4 text-[10px] font-bold transition-colors duration-300"
                  style={{ color: "var(--text-sub)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      id="chart-legend-actual"
                      className="h-0.5 w-4 rounded transition-colors duration-300"
                      style={{ backgroundColor: activeTier.color }}
                    />
                    {"\uC2E4\uC81C\uAE30\uB85D"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      id="chart-legend-target"
                      className="inline-block h-1 w-4 shrink-0 rounded border-t border-dashed transition-colors duration-300"
                      style={{
                        borderTopColor: "var(--text-sub)",
                        borderTopWidth: "1.5px",
                        opacity: 0.6,
                      }}
                    />
                    {"\uBAA9\uD45C(\uC774\uC0C1)"}
                  </span>
                </div>
              </div>

              <div
                key={`chart-${selectedTier}-${selectedStat}`}
                id="chart-container"
                className="chart-animate relative -mt-4 min-h-[240px] w-full overflow-visible"
              >
                <svg
                  viewBox="0 0 400 240"
                  className="h-auto min-h-[240px] w-full overflow-visible transition-colors duration-300"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ overflow: "visible" }}
                >
                  <defs>
                    <filter id="levelDotGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <rect
                    x="48"
                    y="24"
                    width="336"
                    height="176"
                    rx="4"
                    fill="none"
                    style={{ stroke: "var(--border-light)" }}
                    strokeWidth="1"
                  />

                  <g
                    style={{
                      stroke: "var(--border-light)",
                      strokeWidth: 0.5,
                      opacity: 0.5,
                    }}
                  >
                    {yTicks.map((tick) => (
                      <line key={`h-${tick.y}`} x1="48" y1={tick.y} x2="384" y2={tick.y} />
                    ))}
                    {points.map((point) => (
                      <line key={`v-${point.date}`} x1={point.x} y1="24" x2={point.x} y2="200" />
                    ))}
                  </g>

                  <g style={{ fill: "var(--text-sub)", fontSize: "10px", fontWeight: "bold" }}>
                    {yTicks.map((tick) => (
                      <text key={`yt-${tick.y}`} x="40" y={tick.y} textAnchor="end">
                        {Number(tick.value.toFixed(1))}
                      </text>
                    ))}
                  </g>

                  <g style={{ fontSize: "10px" }}>
                    {points.map((point, index) => (
                      <text
                        key={`xt-${point.date}`}
                        x={point.x}
                        y="218"
                        textAnchor="middle"
                        style={{
                          fill: index === points.length - 1 ? "var(--text-main)" : "var(--text-sub)",
                          fontWeight: index === points.length - 1 ? "bold" : "normal",
                        }}
                      >
                        {point.date}
                      </text>
                    ))}
                  </g>

                  <line
                    x1="48"
                    y1={targetY}
                    x2="384"
                    y2={targetY}
                    style={{ stroke: "var(--text-sub)" }}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />

                  <rect
                    x="276"
                    y={targetBadgeY}
                    width="100"
                    height="24"
                    rx="6"
                    style={{ fill: "var(--bg-body)", stroke: "var(--border-light)" }}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="326"
                    y={targetBadgeY + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    style={{ fill: "var(--text-sub)" }}
                  >
                    {"\uBAA9\uD45C"} {formatValue(activeStat.target, activeStat.unit)}
                  </text>

                  <polyline
                    points={polyline}
                    fill="none"
                    style={{ stroke: activeTier.color }}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {points.map((point) => (
                    <circle
                      key={`dot-${point.date}`}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      style={{ fill: "var(--bg-body)", stroke: activeTier.color }}
                      strokeWidth="1.5"
                    />
                  ))}

                  {points.length > 0 ? (
                    <g>
                      <circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="8"
                        style={{ fill: activeTier.color }}
                        filter="url(#levelDotGlow)"
                        opacity="0.4"
                      />
                      <circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="4"
                        style={{ fill: activeTier.color }}
                      />
                      <rect
                        x={points[points.length - 1].x - 48}
                        y={points[points.length - 1].y - 34}
                        width="96"
                        height="26"
                        rx="6"
                        style={{ fill: "var(--bg-body)", stroke: activeTier.color }}
                        strokeWidth="1.5"
                        opacity="0.95"
                      />
                      <text
                        x={points[points.length - 1].x}
                        y={points[points.length - 1].y - 17}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        style={{ fill: activeTier.color }}
                      >
                        {formatValue(points[points.length - 1].value, activeStat.unit)}
                      </text>
                    </g>
                  ) : null}
                </svg>
              </div>

              <div
                key={`summary-${selectedTier}-${selectedStat}`}
                id="summary-section"
                className="chart-animate mt-2 space-y-2 border-t pt-4 transition-colors duration-300"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div
                  className="flex justify-between text-xs font-bold transition-colors duration-300"
                  style={{ color: "var(--text-sub)" }}
                >
                  <span>
                    {"\uD604\uC7AC"}:{" "}
                    <span
                      className="font-mono text-[13px] transition-colors duration-300"
                      style={{ color: "var(--text-main)" }}
                    >
                      {formatValue(current, activeStat.unit)}
                    </span>
                  </span>
                  <span>
                    {"\uC774\uC804"}:{" "}
                    <span
                      className="font-mono text-[13px] transition-colors duration-300"
                      style={{ color: "var(--text-main)" }}
                    >
                      {formatValue(previous, activeStat.unit)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-bold transition-colors duration-300"
                    style={{ color: "var(--text-main)" }}
                  >
                    {"\uBCC0\uD654"}:{" "}
                    <span style={{ color: deltaColor }}>
                      {delta > 0 ? "+" : ""}
                      {delta.toFixed(activeStat.unit === "%" ? 1 : 0)} {activeStat.unit}
                    </span>
                  </span>
                  <div
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors duration-300"
                    style={{
                      backgroundColor: "var(--bg-card-hover)",
                      color: deltaColor,
                    }}
                  >
                    <TrendIcon className="h-3.5 w-3.5" />
                    <span>{trendLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
