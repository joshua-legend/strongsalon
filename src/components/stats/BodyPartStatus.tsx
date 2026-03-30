"use client";

import { useMemo } from "react";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { getBodyPartInsights, getMergedWorkoutRecords } from "@/utils/workoutInsights";

function gaugeWidth(share: number): number {
  return Math.max(6, Math.min(100, share));
}

export default function BodyPartStatus() {
  const { getUserWorkoutRecords } = useWorkoutRecords();

  const parts = useMemo(() => {
    const merged = getMergedWorkoutRecords(getUserWorkoutRecords());
    return getBodyPartInsights(merged, 28).slice(0, 6);
  }, [getUserWorkoutRecords]);

  if (parts.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
          부위별 운동 현황
        </h3>
        <p className="text-xs" style={{ color: "var(--text-sub)" }}>
          아직 표시할 부위별 데이터가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
        부위별 운동 현황
      </h3>

      <div className="space-y-2">
        {parts.map((part) => (
          <div key={part.key} className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-main)" }}>
                {part.label}
              </span>
              <span className="text-[11px]" style={{ color: "var(--text-sub)" }}>
                {Math.round(part.share)}% · {part.sets} sets
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--border-light)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${gaugeWidth(part.share)}%`,
                  backgroundColor: part.accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
