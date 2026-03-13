"use client";

import { useMemo } from "react";
import { CalendarCheck, Flame, Activity, Timer } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
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

const statCards = [
  { label: "총 PT 출석일", unit: "일", Icon: CalendarCheck },
  { label: "총 볼륨", unit: "kg", Icon: Flame },
  { label: "운동 횟수", unit: "회", Icon: Activity },
  { label: "평균 운동시간", unit: "분", Icon: Timer },
] as const;

export default function StatGrid({ year, month }: StatGridProps) {
  const { attendance } = useAttendance();
  const { getUserWorkoutRecords } = useWorkoutRecords();
  const userRecords = getUserWorkoutRecords();
  const stats = useMemo(() => {
    const y = Number(year);
    const m = Number(month);
    if (!Number.isFinite(y) || !Number.isFinite(m)) {
      const now = new Date();
      return getMonthlyStats(now.getFullYear(), now.getMonth(), attendance, userRecords);
    }
    return getMonthlyStats(y, m, attendance, userRecords);
  }, [year, month, attendance, userRecords]);

  const values = [
    safeDisplay(stats.ptDays),
    formatVolume(stats.totalVolume),
    safeDisplay(stats.workoutCount),
    safeDisplay(stats.avgMinutes),
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statCards.map((s, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <s.Icon
              className="w-3.5 h-3.5 transition-colors duration-300"
              style={{ color: "var(--text-sub)" }}
            />
            <p className="text-[11px] font-bold transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
              {s.label}
            </p>
          </div>
          <p className="font-bebas text-3xl leading-none transition-colors duration-300" style={{ color: "var(--accent-main)" }}>
            {values[i]}
            <span className="text-sm font-sans font-medium ml-1" style={{ color: "var(--text-sub)" }}>
              {s.unit}
            </span>
          </p>
          <div
            className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "var(--accent-main)" }}
          />
        </div>
      ))}
    </div>
  );
}
