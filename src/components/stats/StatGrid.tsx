"use client";

import { useMemo } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import { getMonthlyStats } from "@/utils/monthlyStats";

function formatVolume(kg: number): string {
  const n = Number(kg);
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

function safeDisplay(val: unknown): string {
  const n = Number(val);
  return Number.isFinite(n) ? String(Math.round(n)) : "0";
}

interface StatGridProps {
  year: number;
  month: number;
}

export default function StatGrid({ year, month }: StatGridProps) {
  const { attendance } = useAttendance();
  const stats = useMemo(() => {
    const y = Number(year);
    const m = Number(month);
    if (!Number.isFinite(y) || !Number.isFinite(m)) {
      const now = new Date();
      return getMonthlyStats(now.getFullYear(), now.getMonth(), attendance);
    }
    return getMonthlyStats(y, m, attendance);
  }, [year, month, attendance]);

  const monthLabel = `${Number.isFinite(Number(month)) ? Number(month) + 1 : 1}월`;

  const cards = [
    { label: `${monthLabel} 총 PT 출석일`, value: safeDisplay(stats.ptDays), unit: "일", color: "rgb(249,115,22)", icon: "🏋️" },
    { label: `${monthLabel} 개인운동 출석률`, value: safeDisplay(stats.selfRate), unit: "%", color: "rgb(163,230,53)", icon: "📊" },
    { label: `${monthLabel} 총 볼륨`, value: formatVolume(stats.totalVolume), unit: "kg", color: "rgb(249,115,22)", icon: "🔥" },
    { label: `${monthLabel} 운동 횟수`, value: safeDisplay(stats.workoutCount), unit: "회", color: "rgb(168,85,247)", icon: "🔄" },
    { label: `${monthLabel} 평균 운동시간`, value: safeDisplay(stats.avgMinutes), unit: "분", color: "rgb(34,211,238)", icon: "⏱️" },
    { label: `${monthLabel} 연속 출석`, value: safeDisplay(stats.streak), unit: "일", color: "rgb(234,179,8)", icon: "🔥" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((s, i) => (
        <div key={i} className="card relative overflow-hidden group">
          <p className="card-label mb-2">
            {s.icon} {s.label}
          </p>
          <p
            className="font-bebas text-[32px] leading-none mb-1"
            style={{ color: s.color }}
          >
            {s.value}
            <span className="text-[16px] text-neutral-400">
              {s.unit}
            </span>
          </p>
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: s.color }}
          />
        </div>
      ))}
    </div>
  );
}
