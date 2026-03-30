"use client";

import { useMemo } from "react";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import {
  formatCompactVolume,
  getMergedWorkoutRecords,
  getWeeklyVolumeTrend,
} from "@/utils/workoutInsights";

function widthPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(4, (value / max) * 100);
}

export default function VolumeChart() {
  const { getUserWorkoutRecords } = useWorkoutRecords();

  const weeklyTrend = useMemo(() => {
    const mergedRecords = getMergedWorkoutRecords(getUserWorkoutRecords());
    return getWeeklyVolumeTrend(mergedRecords, 8);
  }, [getUserWorkoutRecords]);

  const maxVolume = Math.max(...weeklyTrend.map((item) => item.volume), 0);
  const hasData = weeklyTrend.some((item) => item.volume > 0);

  if (!hasData) {
    return (
      <section className="space-y-2">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
          주간 볼륨 추이
        </h3>
        <p className="text-xs" style={{ color: "var(--text-sub)" }}>
          아직 표시할 볼륨 데이터가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
        주간 볼륨 추이
      </h3>

      <div className="space-y-2">
        {weeklyTrend.map((week) => {
          const activeColor = week.isCurrent ? "#f97316" : "var(--accent-main)";
          return (
            <div key={week.rangeLabel} className="grid grid-cols-[46px_1fr_56px] items-center gap-2">
              <span className="text-[11px] font-medium" style={{ color: "var(--text-sub)" }}>
                {week.shortLabel}
              </span>

              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--border-light)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPercent(week.volume, maxVolume)}%`,
                    backgroundColor: activeColor,
                  }}
                />
              </div>

              <span
                className="text-right text-[11px] font-semibold"
                style={{ color: week.isCurrent ? activeColor : "var(--text-main)" }}
              >
                {formatCompactVolume(week.volume)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
