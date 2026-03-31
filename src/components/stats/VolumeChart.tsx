"use client";

import { useMemo, useState } from "react";
import {
  ChartColumn,
  CircleDashed,
  Grid3x3,
  List,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import {
  formatCompactVolume,
  getMergedWorkoutRecords,
  getWeeklyVolumeTrend,
} from "@/utils/workoutInsights";

type VolumeView = "bars" | "trend" | "list" | "radial" | "target" | "grid";

const VIEW_OPTIONS: Array<{ id: VolumeView; icon: LucideIcon }> = [
  { id: "bars", icon: ChartColumn },
  { id: "trend", icon: TrendingUp },
  { id: "list", icon: List },
  { id: "radial", icon: CircleDashed },
  { id: "target", icon: Target },
  { id: "grid", icon: Grid3x3 },
];

function barHeightPercent(value: number, max: number) {
  if (max <= 0 || value <= 0) return 12;
  return Math.max(18, Math.round((value / max) * 100));
}

function sparklinePath(values: number[], width: number, height: number) {
  if (values.length === 0) return "";
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function VolumeChart() {
  const { getUserWorkoutRecords } = useWorkoutRecords();
  const [activeView, setActiveView] = useState<VolumeView>("bars");

  const weeklyTrend = useMemo(() => {
    const mergedRecords = getMergedWorkoutRecords(getUserWorkoutRecords());
    return getWeeklyVolumeTrend(mergedRecords, 8);
  }, [getUserWorkoutRecords]);

  const maxVolume = Math.max(...weeklyTrend.map((item) => item.volume), 0);
  const totalVolume = weeklyTrend.reduce((sum, item) => sum + item.volume, 0);
  const averageVolume = weeklyTrend.length > 0 ? Math.round(totalVolume / weeklyTrend.length) : 0;
  const bestWeek = weeklyTrend.reduce(
    (best, week) => (week.volume > best.volume ? week : best),
    weeklyTrend[0] ?? null
  );
  const currentWeek = weeklyTrend.find((item) => item.isCurrent) ?? weeklyTrend[weeklyTrend.length - 1];
  const hasData = weeklyTrend.some((item) => item.volume > 0);
  const linePath = sparklinePath(
    weeklyTrend.map((item) => item.volume),
    280,
    88
  );

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
          주간 볼륨 추이
        </h3>

        <div
          className="custom-scrollbar no-scrollbar flex overflow-x-auto rounded-xl p-1"
          style={{ backgroundColor: "var(--bg-card-hover)" }}
        >
          {VIEW_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = activeView === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveView(option.id)}
                className="flex min-w-[32px] items-center justify-center rounded-lg p-1.5 transition-all"
                style={{
                  backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                  color: isActive ? "var(--accent-main)" : "var(--text-sub)",
                  boxShadow: isActive ? "0 6px 18px rgba(15, 23, 42, 0.12)" : "none",
                }}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="min-h-[180px] rounded-[1.75rem] border p-6 transition-all duration-300"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-card) 82%, transparent)",
          borderColor: "var(--border-light)",
        }}
      >
        {!hasData ? (
          <div className="flex min-h-[132px] flex-col items-center justify-center gap-2 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card-hover)",
                color: "var(--accent-main)",
              }}
            >
              <ChartColumn size={18} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
              아직 표시할 볼륨 데이터가 없습니다.
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-sub)" }}>
              운동 기록이 쌓이면 최근 8주 추이를 자동으로 보여줍니다.
            </p>
          </div>
        ) : null}

        {hasData && activeView === "bars" ? (
          <div className="flex items-end justify-between gap-1 px-1">
            {weeklyTrend.map((week) => {
              const isCurrent = week.isCurrent;
              return (
                <div key={week.rangeLabel} className="group flex flex-1 flex-col items-center">
                  <div className="flex h-24 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[10px] rounded-t-full transition-all duration-700"
                      style={{
                        height: `${barHeightPercent(week.volume, maxVolume)}%`,
                        backgroundColor: isCurrent ? "#f97316" : "var(--accent-main)",
                        opacity: isCurrent ? 1 : 0.62,
                      }}
                    />
                  </div>
                  <span className="mt-2 text-[9px] font-medium" style={{ color: "var(--text-sub)" }}>
                    {week.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {hasData && activeView === "trend" ? (
          <div className="space-y-4">
            <svg viewBox="0 0 280 88" className="h-28 w-full overflow-visible">
              <path
                d={linePath}
                fill="none"
                stroke="var(--accent-main)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {weeklyTrend.map((week, index) => {
                const x = weeklyTrend.length === 1 ? 140 : (index / (weeklyTrend.length - 1)) * 280;
                const y =
                  88 -
                  ((week.volume - Math.min(...weeklyTrend.map((item) => item.volume), 0)) /
                    Math.max(
                      1,
                      Math.max(...weeklyTrend.map((item) => item.volume), 0) -
                        Math.min(...weeklyTrend.map((item) => item.volume), 0)
                    )) *
                    88;

                return (
                  <circle
                    key={week.rangeLabel}
                    cx={x}
                    cy={y}
                    r={week.isCurrent ? 4.5 : 3}
                    fill={week.isCurrent ? "#f97316" : "var(--accent-main)"}
                  />
                );
              })}
            </svg>

            <div className="flex justify-between gap-2">
              {weeklyTrend.map((week) => (
                <span
                  key={week.rangeLabel}
                  className="flex-1 text-center text-[9px] font-medium"
                  style={{ color: week.isCurrent ? "#f97316" : "var(--text-sub)" }}
                >
                  {week.shortLabel}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {hasData && activeView === "list" ? (
          <div className="space-y-2">
            {weeklyTrend
              .slice()
              .reverse()
              .map((week) => (
                <div
                  key={week.rangeLabel}
                  className="flex items-center justify-between rounded-2xl border px-3 py-2.5"
                  style={{
                    borderColor: week.isCurrent ? "rgba(249,115,22,0.24)" : "var(--border-light)",
                    backgroundColor: week.isCurrent ? "rgba(249,115,22,0.08)" : "var(--bg-card)",
                  }}
                >
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                      {week.rangeLabel}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                      {week.sessions} sessions
                    </p>
                  </div>
                  <p
                    className="font-bebas text-[22px] leading-none"
                    style={{ color: week.isCurrent ? "#f97316" : "var(--accent-main)" }}
                  >
                    {formatCompactVolume(week.volume)}
                  </p>
                </div>
              ))}
          </div>
        ) : null}

        {hasData && activeView === "radial" ? (
          <div className="flex min-h-[132px] items-center justify-between gap-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="var(--border-light)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="var(--accent-main)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={276.46}
                  strokeDashoffset={
                    276.46 -
                    276.46 * ((currentWeek?.volume ?? 0) / Math.max(maxVolume, 1))
                  }
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-[10px] font-semibold" style={{ color: "var(--text-sub)" }}>
                  THIS WEEK
                </p>
                <p className="font-bebas text-[24px]" style={{ color: "var(--text-main)" }}>
                  {formatCompactVolume(currentWeek?.volume ?? 0)}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="rounded-2xl border px-3 py-3" style={{ borderColor: "var(--border-light)" }}>
                <p className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                  Best Week
                </p>
                <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--text-main)" }}>
                  {bestWeek?.rangeLabel ?? "-"}
                </p>
                <p className="font-bebas text-[22px]" style={{ color: "var(--accent-main)" }}>
                  {formatCompactVolume(bestWeek?.volume ?? 0)}
                </p>
              </div>
              <div className="rounded-2xl border px-3 py-3" style={{ borderColor: "var(--border-light)" }}>
                <p className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                  8-Week Avg
                </p>
                <p className="font-bebas mt-1 text-[22px]" style={{ color: "var(--text-main)" }}>
                  {formatCompactVolume(averageVolume)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {hasData && activeView === "target" ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-sub)" }}>
                  이번 주 vs 최고 주간 볼륨
                </p>
                <p className="mt-1 text-[14px] font-bold" style={{ color: "var(--text-main)" }}>
                  {currentWeek?.rangeLabel ?? "-"}
                </p>
              </div>
              <p className="font-bebas text-[28px]" style={{ color: "#f97316" }}>
                {Math.round(((currentWeek?.volume ?? 0) / Math.max(bestWeek?.volume ?? 1, 1)) * 100)}%
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-card-hover)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(
                    10,
                    ((currentWeek?.volume ?? 0) / Math.max(bestWeek?.volume ?? 1, 1)) * 100
                  )}%`,
                  background:
                    "linear-gradient(90deg, var(--accent-main) 0%, #f97316 100%)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border px-3 py-3" style={{ borderColor: "var(--border-light)" }}>
                <p className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                  Current
                </p>
                <p className="font-bebas text-[24px]" style={{ color: "var(--text-main)" }}>
                  {formatCompactVolume(currentWeek?.volume ?? 0)}
                </p>
              </div>
              <div className="rounded-2xl border px-3 py-3" style={{ borderColor: "var(--border-light)" }}>
                <p className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                  Best
                </p>
                <p className="font-bebas text-[24px]" style={{ color: "var(--accent-main)" }}>
                  {formatCompactVolume(bestWeek?.volume ?? 0)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {hasData && activeView === "grid" ? (
          <div className="grid grid-cols-4 gap-2">
            {weeklyTrend.map((week) => (
              <div
                key={week.rangeLabel}
                className="rounded-2xl border px-3 py-3"
                style={{
                  borderColor: week.isCurrent ? "rgba(249,115,22,0.24)" : "var(--border-light)",
                  backgroundColor: week.isCurrent ? "rgba(249,115,22,0.08)" : "var(--bg-card)",
                }}
              >
                <p className="text-[10px] font-medium" style={{ color: "var(--text-sub)" }}>
                  {week.shortLabel}
                </p>
                <p
                  className="mt-2 font-bebas text-[20px] leading-none"
                  style={{ color: week.isCurrent ? "#f97316" : "var(--accent-main)" }}
                >
                  {formatCompactVolume(week.volume)}
                </p>
                <p className="mt-1 text-[9px]" style={{ color: "var(--text-sub)" }}>
                  {week.sessions}회
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
