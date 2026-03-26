"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  Dumbbell,
  FingerprintPattern,
  Flame,
  Minus,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import type { User } from "@/types/user";

type TierId = "standard" | "advanced" | "pro" | "elite" | "the-strong";
type StatId = "strength" | "stamina" | "inbody";

interface TierMeta {
  id: TierId;
  label: string;
  displayName: string;
  color: string;
  glowBg: string;
  gradient: string;
  rankLabel: string;
}

interface StatSeriesPoint {
  label: string;
  value: number;
}

interface StatModel {
  id: StatId;
  label: string;
  icon: LucideIcon;
  grade: string;
  points: number;
  unit: string;
  currentValue: number;
  previousValue: number;
  targetValue: number;
  higherIsBetter: boolean;
  series: StatSeriesPoint[];
}

const TIERS: TierMeta[] = [
  {
    id: "standard",
    label: "Standard",
    displayName: "STANDARD",
    color: "#94a3b8",
    glowBg: "rgba(148, 163, 184, 0.18)",
    gradient:
      "linear-gradient(140deg, #09090b 0%, #18181b 34%, #27272a 70%, #3f3f46 100%)",
    rankLabel: "TOP 18%",
  },
  {
    id: "advanced",
    label: "Advanced",
    displayName: "ADVANCED",
    color: "#38bdf8",
    glowBg: "rgba(56, 189, 248, 0.18)",
    gradient:
      "linear-gradient(140deg, #082f49 0%, #0f172a 32%, #1d4ed8 70%, #38bdf8 100%)",
    rankLabel: "TOP 9%",
  },
  {
    id: "pro",
    label: "Pro",
    displayName: "PRO",
    color: "#a3e635",
    glowBg: "rgba(163, 230, 53, 0.18)",
    gradient:
      "linear-gradient(140deg, #0a0a0a 0%, #14532d 34%, #365314 68%, #84cc16 100%)",
    rankLabel: "TOP 4%",
  },
  {
    id: "elite",
    label: "Elite",
    displayName: "ELITE",
    color: "#fb7185",
    glowBg: "rgba(251, 113, 133, 0.18)",
    gradient:
      "linear-gradient(140deg, #111827 0%, #3f0d24 34%, #7f1d1d 70%, #fb7185 100%)",
    rankLabel: "TOP 1%",
  },
  {
    id: "the-strong",
    label: "The Strong",
    displayName: "THE STRONG",
    color: "#f5d061",
    glowBg: "rgba(245, 208, 97, 0.2)",
    gradient:
      "linear-gradient(140deg, #120d06 0%, #2b2112 32%, #6b4f1d 70%, #f5d061 100%)",
    rankLabel: "TOP 0.3%",
  },
];

const SERIES_LABELS = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatMetric(value: number, unit: string) {
  if (unit === "%") return `${value.toFixed(1)}%`;
  if (unit === "kg") return `${Math.round(value)}kg`;
  return `${Math.round(value)}pt`;
}

function gradeFromPoints(points: number) {
  if (points >= 96) return "S";
  if (points >= 90) return "A+";
  if (points >= 84) return "A";
  if (points >= 76) return "B+";
  if (points >= 68) return "B";
  if (points >= 60) return "C+";
  return "C";
}

function getInitialTier(level?: User["level"]): TierId {
  if (level === "ADVANCED") return "elite";
  if (level === "INTERMEDIATE") return "pro";
  return "advanced";
}

function buildDashboardStats(user: User | null): StatModel[] {
  const liftTotal = user?.liftTotal ?? 320;
  const bodyFat = user?.bodyComp?.fatPct ?? 18.4;
  const muscle = user?.bodyComp?.muscle ?? 33.2;
  const attendRate = user?.monthAttendRate ?? 72;
  const streak = user?.streak ?? 10;

  const strengthPoints = clamp(Math.round(liftTotal / 4.15), 52, 99);
  const staminaPoints = clamp(Math.round(attendRate * 0.72 + streak * 0.8), 48, 98);
  const inbodyPoints = clamp(Math.round(64 + muscle * 0.56 - bodyFat * 0.48), 45, 97);

  const strengthCurrent = liftTotal;
  const strengthSeries = [
    strengthCurrent - 44,
    strengthCurrent - 31,
    strengthCurrent - 22,
    strengthCurrent - 14,
    strengthCurrent - 8,
    strengthCurrent,
  ];

  const staminaCurrent = clamp(Math.round(attendRate * 0.9 + streak * 1.05), 48, 98);
  const staminaSeries = [
    staminaCurrent - 16,
    staminaCurrent - 12,
    staminaCurrent - 9,
    staminaCurrent - 7,
    staminaCurrent - 3,
    staminaCurrent,
  ];

  const inbodyCurrent = Number(bodyFat.toFixed(1));
  const inbodySeries = [
    Number((inbodyCurrent + 3.1).toFixed(1)),
    Number((inbodyCurrent + 2.4).toFixed(1)),
    Number((inbodyCurrent + 1.8).toFixed(1)),
    Number((inbodyCurrent + 1.1).toFixed(1)),
    Number((inbodyCurrent + 0.4).toFixed(1)),
    inbodyCurrent,
  ];

  return [
    {
      id: "strength",
      label: "Strength",
      icon: Dumbbell,
      grade: gradeFromPoints(strengthPoints),
      points: strengthPoints,
      unit: "kg",
      currentValue: strengthCurrent,
      previousValue: strengthSeries[strengthSeries.length - 2],
      targetValue: strengthCurrent + 20,
      higherIsBetter: true,
      series: SERIES_LABELS.map((label, index) => ({
        label,
        value: strengthSeries[index],
      })),
    },
    {
      id: "stamina",
      label: "Stamina",
      icon: Flame,
      grade: gradeFromPoints(staminaPoints),
      points: staminaPoints,
      unit: "pt",
      currentValue: staminaCurrent,
      previousValue: staminaSeries[staminaSeries.length - 2],
      targetValue: staminaCurrent + 8,
      higherIsBetter: true,
      series: SERIES_LABELS.map((label, index) => ({
        label,
        value: staminaSeries[index],
      })),
    },
    {
      id: "inbody",
      label: "Inbody",
      icon: Shield,
      grade: gradeFromPoints(inbodyPoints),
      points: inbodyPoints,
      unit: "%",
      currentValue: inbodyCurrent,
      previousValue: inbodySeries[inbodySeries.length - 2],
      targetValue: Number(Math.max(inbodyCurrent - 2.2, 10).toFixed(1)),
      higherIsBetter: false,
      series: SERIES_LABELS.map((label, index) => ({
        label,
        value: inbodySeries[index],
      })),
    },
  ];
}

function LevelChart({ stat }: { stat: StatModel }) {
  const width = 328;
  const height = 212;
  const padTop = 20;
  const padRight = 24;
  const padBottom = 38;
  const padLeft = 22;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const allValues = [...stat.series.map((item) => item.value), stat.targetValue];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = Math.max(maxValue - minValue, stat.unit === "%" ? 2.4 : 10);
  const paddedMin = stat.unit === "%"
    ? Math.max(0, minValue - range * 0.2)
    : Math.max(0, minValue - range * 0.18);
  const paddedMax = maxValue + range * 0.22;

  const toX = (index: number) =>
    padLeft + (index / Math.max(stat.series.length - 1, 1)) * chartWidth;
  const toY = (value: number) =>
    padTop + chartHeight - ((value - paddedMin) / (paddedMax - paddedMin)) * chartHeight;

  const polylinePoints = stat.series
    .map((point, index) => `${toX(index)},${toY(point.value)}`)
    .join(" ");

  const targetY = toY(stat.targetValue);
  const lastIndex = stat.series.length - 1;
  const lastPoint = stat.series[lastIndex];
  const lastX = toX(lastIndex);
  const lastY = toY(lastPoint.value);

  return (
    <svg
      className="h-[220px] w-full"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((step) => {
        const y = padTop + (chartHeight / 3) * step;
        return (
          <line
            key={step}
            x1={padLeft}
            x2={width - padRight}
            y1={y}
            y2={y}
            stroke="var(--border-light)"
            strokeDasharray="4 6"
            opacity="0.7"
          />
        );
      })}

      {stat.series.map((point, index) => (
        <text
          key={point.label}
          x={toX(index)}
          y={height - 12}
          textAnchor="middle"
          className="font-bebas"
          fontSize="10"
          fill="var(--text-sub)"
        >
          {point.label}
        </text>
      ))}

      <line
        x1={padLeft}
        x2={width - padRight}
        y1={targetY}
        y2={targetY}
        stroke="var(--dynamic-theme-color)"
        strokeDasharray="6 6"
        opacity="0.75"
      />
      <g transform={`translate(${width - padRight - 74}, ${targetY - 16})`}>
        <rect
          width="74"
          height="22"
          rx="11"
          fill="var(--bg-card)"
          stroke="var(--dynamic-theme-color)"
        />
        <text
          x="37"
          y="14"
          textAnchor="middle"
          className="font-bebas"
          fontSize="11"
          fill="var(--dynamic-theme-color)"
        >
          TARGET
        </text>
      </g>

      <polyline
        points={polylinePoints}
        stroke="var(--dynamic-theme-color)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {stat.series.map((point, index) => {
        const x = toX(index);
        const y = toY(point.value);
        const isLast = index === lastIndex;
        return (
          <g key={`${point.label}-${point.value}`}>
            {isLast ? (
              <>
                <circle cx={x} cy={y} r="15" fill="var(--dynamic-theme-bg)" />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  stroke="var(--dynamic-theme-color)"
                  opacity="0.32"
                />
              </>
            ) : null}
            <circle
              cx={x}
              cy={y}
              r={isLast ? 5.2 : 3.6}
              fill="var(--bg-card)"
              stroke="var(--dynamic-theme-color)"
              strokeWidth={isLast ? 3 : 2.2}
            />
          </g>
        );
      })}

      <g transform={`translate(${lastX - 30}, ${lastY - 40})`}>
        <rect
          width="60"
          height="24"
          rx="12"
          fill="var(--bg-card)"
          stroke="var(--dynamic-theme-color)"
        />
        <text
          x="30"
          y="15"
          textAnchor="middle"
          className="font-bebas"
          fontSize="11"
          fill="var(--text-main)"
        >
          {formatMetric(lastPoint.value, stat.unit)}
        </text>
      </g>
    </svg>
  );
}

export default function PremiumLevelDashboard() {
  const { user } = useUser();
  const [selectedTier, setSelectedTier] = useState<TierId>(getInitialTier(user?.level));
  const [selectedStat, setSelectedStat] = useState<StatId>("strength");

  const stats = buildDashboardStats(user);
  const activeTier = TIERS.find((tier) => tier.id === selectedTier) ?? TIERS[2];
  const activeStat = stats.find((stat) => stat.id === selectedStat) ?? stats[0];

  const totalScore = Math.round(
    stats.reduce((acc, stat) => acc + stat.points * 12, 0) + (user?.streak ?? 0) * 8
  );

  const delta = Number(
    (activeStat.currentValue - activeStat.previousValue).toFixed(
      activeStat.unit === "%" ? 1 : 0
    )
  );
  const isPositive = activeStat.higherIsBetter ? delta > 0 : delta < 0;
  const isNeutral = delta === 0;
  const deltaLabel = isNeutral
    ? "유지 중"
    : isPositive
      ? "목표에 가까워지고 있어요"
      : "리듬을 다시 끌어올릴 시점이에요";
  const DeltaIcon = isNeutral ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;

  const themeStyle = {
    "--dynamic-theme-color": activeTier.color,
    "--dynamic-theme-bg": activeTier.glowBg,
  } as CSSProperties;

  return (
    <section className="space-y-4" style={themeStyle}>
      <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 fade-up fade-in-1">
        {TIERS.map((tier) => {
          const isActive = tier.id === selectedTier;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95"
              style={{
                backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                color: isActive ? "var(--text-main)" : "var(--text-sub)",
                boxShadow: isActive
                  ? "0 10px 24px rgba(0, 0, 0, 0.14)"
                  : "none",
                border: `1px solid ${isActive ? "var(--border-light)" : "transparent"}`,
              }}
            >
              {tier.label}
            </button>
          );
        })}
      </div>

      <article
        className="premium-level-card rounded-[1.25rem] border p-5 shadow-2xl fade-up fade-in-2"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background: activeTier.gradient,
        }}
      >
        <svg className="premium-level-noise" viewBox="0 0 100 100" preserveAspectRatio="none">
          <filter id="level-noise-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100" height="100" filter="url(#level-noise-filter)" opacity="0.95" />
        </svg>

        <div className="relative z-[2]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.24em] text-white/66">
                FITLOG PRIME
              </p>
              <p className="mt-1 text-xs text-white/46">Premium Membership Dashboard</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <FingerprintPattern className="h-5 w-5 text-white/80" />
            </div>
          </div>

          <div className="mt-10">
            <h2
              className="text-[2rem] leading-none text-white sm:text-[2.35rem]"
              style={{
                fontFamily: '"Iowan Old Style", "Times New Roman", serif',
                fontStyle: "italic",
                letterSpacing: "0.04em",
              }}
            >
              {activeTier.displayName}
            </h2>
          </div>

          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.24em] text-white/48">TOTAL SCORE</p>
              <p className="font-bebas text-[4.4rem] leading-[0.82] text-white">
                {totalScore.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-[0.24em] text-white/48">OVERALL RANK</p>
              <p className="font-bebas text-[2.35rem] leading-none text-white">
                {activeTier.rankLabel}
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-3 gap-3 fade-up fade-in-3">
        {stats.map((stat) => {
          const isActive = stat.id === selectedStat;
          const Icon = stat.icon;
          return (
            <button
              key={stat.id}
              type="button"
              onClick={() => setSelectedStat(stat.id)}
              className="relative overflow-hidden rounded-[1.15rem] border p-3 text-left transition-all duration-300 active:scale-[0.98]"
              style={{
                transform: isActive ? "translateY(-4px)" : "translateY(0px)",
                borderColor: isActive ? "var(--dynamic-theme-color)" : "var(--border-light)",
                backgroundColor: "var(--bg-card)",
                boxShadow: isActive ? "0 18px 30px rgba(0, 0, 0, 0.18)" : "none",
              }}
            >
              {isActive ? (
                <div
                  className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl"
                  style={{ backgroundColor: "var(--dynamic-theme-bg)" }}
                />
              ) : null}

              <div className="relative z-[1]">
                <Icon
                  className="h-4 w-4 transition-colors duration-300"
                  style={{ color: isActive ? "var(--dynamic-theme-color)" : "var(--text-sub)" }}
                />
                <p
                  className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300"
                  style={{ color: isActive ? "var(--dynamic-theme-color)" : "var(--text-sub)" }}
                >
                  {stat.label}
                </p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div>
                    <p
                      className="font-bebas text-[1.35rem] leading-none transition-colors duration-300"
                      style={{ color: isActive ? "var(--text-main)" : "var(--text-main)" }}
                    >
                      {stat.grade}
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-sub)" }}>
                      Grade
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-bebas text-[1.65rem] leading-none transition-colors duration-300"
                      style={{ color: isActive ? "var(--dynamic-theme-color)" : "var(--text-main)" }}
                    >
                      {stat.points}
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-sub)" }}>
                      Points
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="relative overflow-hidden rounded-[1.35rem] border p-4 fade-up fade-in-4"
        style={{
          borderColor: "var(--border-light)",
          background:
            "radial-gradient(circle at top right, var(--dynamic-theme-bg), transparent 34%), var(--bg-card)",
        }}
      >
        <div
          className="pointer-events-none absolute right-5 top-5 h-24 w-24 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--dynamic-theme-bg)" }}
        />
        <div className="relative z-[1]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--dynamic-theme-color)" }}
              >
                Tracking Dashboard
              </p>
              <h3
                className="mt-2 text-lg font-semibold"
                style={{ color: "var(--text-main)" }}
              >
                {activeStat.label} Progress
              </h3>
            </div>
            <div
              className="rounded-2xl border px-3 py-2"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <BarChart2 className="h-4 w-4" style={{ color: "var(--dynamic-theme-color)" }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStat.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-4 space-y-4"
            >
              <LevelChart stat={activeStat} />

              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--text-sub)" }}>
                    Current
                  </p>
                  <p className="mt-2 font-bebas text-[2rem] leading-none" style={{ color: "var(--text-main)" }}>
                    {formatMetric(activeStat.currentValue, activeStat.unit)}
                  </p>
                  <p className="mt-3 text-xs" style={{ color: "var(--text-sub)" }}>
                    이전 기록 {formatMetric(activeStat.previousValue, activeStat.unit)}
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: isPositive
                      ? "var(--dynamic-theme-color)"
                      : isNeutral
                        ? "var(--border-light)"
                        : "var(--accent-danger)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--text-sub)" }}>
                      Summary
                    </p>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{
                        color: isPositive
                          ? "var(--dynamic-theme-color)"
                          : isNeutral
                            ? "var(--text-sub)"
                            : "var(--accent-danger)",
                        backgroundColor: isPositive
                          ? "var(--dynamic-theme-bg)"
                          : isNeutral
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(251,113,133,0.12)",
                      }}
                    >
                      <DeltaIcon className="h-3.5 w-3.5" />
                      {isNeutral
                        ? "0"
                        : `${delta > 0 ? "+" : ""}${delta.toFixed(activeStat.unit === "%" ? 1 : 0)}`}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-main)" }}>
                    {deltaLabel}
                  </p>
                  <p className="mt-2 text-xs leading-5" style={{ color: "var(--text-sub)" }}>
                    목표 {formatMetric(activeStat.targetValue, activeStat.unit)}까지의 흐름을
                    추적 중입니다.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
