"use client";

import { useMemo, useState } from "react";
import {
  ChartPie,
  LayoutGrid,
  Target,
  Tally4,
  type LucideIcon,
} from "lucide-react";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { getBodyPartInsights, getMergedWorkoutRecords } from "@/utils/workoutInsights";

type BodyPartView = "bars" | "pie" | "focus" | "grid";

const VIEW_OPTIONS: Array<{ id: BodyPartView; icon: LucideIcon }> = [
  { id: "bars", icon: Tally4 },
  { id: "pie", icon: ChartPie },
  { id: "focus", icon: Target },
  { id: "grid", icon: LayoutGrid },
];

function gaugeWidth(share: number): number {
  return Math.max(6, Math.min(100, Math.round(share)));
}

function buildPieGradient(
  parts: Array<{ share: number; accent: string }>
) {
  let current = 0;
  const stops = parts.map((part) => {
    const start = current;
    current += part.share;
    return `${part.accent} ${start}% ${current}%`;
  });
  if (current < 100) {
    stops.push(`var(--bg-card-hover) ${current}% 100%`);
  }
  return `conic-gradient(${stops.join(", ")})`;
}

export default function BodyPartStatus() {
  const { getUserWorkoutRecords } = useWorkoutRecords();
  const [activeView, setActiveView] = useState<BodyPartView>("bars");

  const parts = useMemo(() => {
    const merged = getMergedWorkoutRecords(getUserWorkoutRecords());
    return getBodyPartInsights(merged, 28).slice(0, 6);
  }, [getUserWorkoutRecords]);

  const totalSets = parts.reduce((sum, part) => sum + part.sets, 0);
  const dominantPart = parts[0] ?? null;
  const pieGradient = buildPieGradient(parts);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
          부위별 운동 현황
        </h3>

        <div
          className="flex rounded-xl p-1"
          style={{ backgroundColor: "var(--bg-card-hover)" }}
        >
          {VIEW_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = option.id === activeView;

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
        className="min-h-[220px] rounded-[1.75rem] border p-6 transition-all duration-300"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-card) 88%, transparent)",
          borderColor: "var(--border-light)",
        }}
      >
        {parts.length === 0 ? (
          <div className="flex min-h-[172px] flex-col items-center justify-center gap-2 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card-hover)",
                color: "var(--accent-main)",
              }}
            >
              <Tally4 size={18} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
              아직 표시할 부위별 데이터가 없습니다.
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-sub)" }}>
              운동 기록이 쌓이면 자극 비중과 세트 분포를 자동으로 보여줍니다.
            </p>
          </div>
        ) : null}

        {parts.length > 0 && activeView === "bars" ? (
          <div className="space-y-4">
            {parts.map((part) => (
              <div key={part.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: "var(--text-main)" }}>
                    {part.label}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-sub)" }}>
                    {Math.round(part.share)}% · {part.sets}s
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--bg-card-hover)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${gaugeWidth(part.share)}%`,
                      backgroundColor: part.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {parts.length > 0 && activeView === "pie" ? (
          <div className="flex min-h-[172px] items-center gap-5">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <div
                className="h-full w-full rounded-full"
                style={{ background: pieGradient }}
              />
              <div
                className="absolute flex h-20 w-20 flex-col items-center justify-center rounded-full border"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-light)",
                }}
              >
                <p className="text-[10px] font-semibold" style={{ color: "var(--text-sub)" }}>
                  TOTAL
                </p>
                <p className="font-bebas text-[28px]" style={{ color: "var(--text-main)" }}>
                  {totalSets}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {parts.map((part) => (
                <div key={part.key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: part.accent }}
                    />
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                      {part.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-sub)" }}>
                    {Math.round(part.share)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {parts.length > 0 && activeView === "focus" ? (
          <div className="space-y-4">
            <div
              className="rounded-[1.5rem] border px-4 py-4"
              style={{
                borderColor: `${dominantPart?.accent ?? "var(--accent-main)"}33`,
                backgroundColor: dominantPart?.softAccent ?? "var(--bg-card-hover)",
              }}
            >
              <p className="text-[10px] font-semibold tracking-[0.12em]" style={{ color: "var(--text-sub)" }}>
                DOMINANT FOCUS
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[16px] font-bold" style={{ color: "var(--text-main)" }}>
                    {dominantPart?.label ?? "-"}
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--text-sub)" }}>
                    최근 28일 동안 가장 많이 자극한 부위
                  </p>
                </div>
                <p
                  className="font-bebas text-[34px] leading-none"
                  style={{ color: dominantPart?.accent ?? "var(--accent-main)" }}
                >
                  {Math.round(dominantPart?.share ?? 0)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {parts.slice(0, 3).map((part) => (
                <div
                  key={part.key}
                  className="rounded-2xl border px-3 py-3"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <p className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                    {part.label}
                  </p>
                  <p
                    className="mt-2 font-bebas text-[24px] leading-none"
                    style={{ color: part.accent }}
                  >
                    {part.sets}s
                  </p>
                  <p className="mt-1 text-[9px]" style={{ color: "var(--text-sub)" }}>
                    {part.sessions} sessions
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {parts.length > 0 && activeView === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {parts.map((part) => (
              <div
                key={part.key}
                className="rounded-2xl border px-4 py-3"
                style={{
                  borderColor: "var(--border-light)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: "var(--text-main)" }}>
                      {part.label}
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-sub)" }}>
                      {part.sessions} sessions
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2 py-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: part.softAccent,
                      color: part.accent,
                    }}
                  >
                    {Math.round(part.share)}%
                  </span>
                </div>
                <p
                  className="mt-3 font-bebas text-[26px] leading-none"
                  style={{ color: part.accent }}
                >
                  {part.sets}s
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
