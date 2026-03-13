"use client";

import type { DayWorkoutRecord, WorkoutConditionValue } from "@/data/workoutHistory";

type WorkoutRecord = DayWorkoutRecord;

const CONDITION_MAP: Record<WorkoutConditionValue, { emoji: string; label: string; color: string }> = {
  최악: { emoji: "😫", label: "최악", color: "rgb(239,68,68)" },
  나쁨: { emoji: "😕", label: "나쁨", color: "rgb(251,146,60)" },
  좋음: { emoji: "😊", label: "좋음", color: "rgb(163,230,53)" },
  최고: { emoji: "💪", label: "최고", color: "rgb(96,165,250)" },
  불타: { emoji: "🔥", label: "불타", color: "rgb(251,191,36)" },
};

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${y}. ${String(m).padStart(2, "0")}. ${String(d).padStart(2, "0")}`;
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0 && s > 0) return `${m}분 ${s}초`;
  if (m > 0) return `${m}분`;
  return `${s}초`;
}

interface DayWorkoutDetailProps {
  dateKey: string;
  record: WorkoutRecord | undefined;
  attendType?: string;
  typeColor: Record<string, string>;
  typeLabel: Record<string, string>;
  onClose: () => void;
}

export default function DayWorkoutDetail({
  dateKey,
  record,
  attendType,
  typeColor,
  typeLabel,
  onClose,
}: DayWorkoutDetailProps) {
  if (!record && !attendType) {
    return (
      <div className="mt-4 pt-4 flex flex-col gap-3 border-t transition-colors duration-300" style={{ borderColor: "var(--border-light)" }}>
        <div className="flex items-center justify-between">
          <span className="font-bebas text-[15px] tracking-wider transition-colors duration-300" style={{ color: "var(--text-main)" }}>
            {formatDisplayDate(dateKey)}
          </span>
          <button
            onClick={onClose}
            className="font-bebas text-[11px] px-2.5 py-1.5 rounded-lg transition-all duration-300 border hover:scale-95 active:scale-90"
            style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)", color: "var(--text-sub)" }}
          >
            닫기
          </button>
        </div>
        <p className="font-bebas text-[10px] py-4 text-center transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
          해당 날짜에 운동 기록이 없습니다
        </p>
      </div>
    );
  }

  const hasExercises = record?.exercises && record.exercises.length > 0;
  const hasCardio = !!record?.cardio;
  const hasDuration = record?.durationSec != null && record.durationSec > 0;
  const hasCondition = !!record?.condition;
  const hasNoDetail = !hasExercises && !hasCardio && !hasDuration;

  return (
    <div className="mt-4 pt-4 flex flex-col gap-3 border-t transition-colors duration-300" style={{ borderColor: "var(--border-light)" }}>
      {/* Header: 날짜 + 닫기 */}
      <div className="flex items-center justify-between">
        <span className="font-bebas text-[15px] tracking-wider transition-colors duration-300" style={{ color: "var(--text-main)" }}>
          {formatDisplayDate(dateKey)}
        </span>
        <button
          onClick={onClose}
          className="font-bebas text-[11px] px-2.5 py-1.5 rounded-lg transition-all duration-300 border hover:scale-95 active:scale-90"
          style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)", color: "var(--text-sub)" }}
        >
          닫기
        </button>
      </div>

      {/* 컨디션 + 운동시간 요약 바 */}
      {(hasCondition || hasDuration) && (
        <div className="flex items-center gap-2">
          {hasCondition && record?.condition && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
              style={{
                borderColor: `${CONDITION_MAP[record.condition].color}40`,
                background: `${CONDITION_MAP[record.condition].color}10`,
              }}
            >
              <span className="font-bebas text-[12px] leading-none">{CONDITION_MAP[record.condition].emoji}</span>
              <span
                className="font-bebas text-[9px]"
                style={{ color: CONDITION_MAP[record.condition].color }}
              >
                {CONDITION_MAP[record.condition].label}
              </span>
            </div>
          )}
          {hasDuration && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors duration-300" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}>
              <span className="font-bebas text-[11px] leading-none">⏱️</span>
              <span className="font-bebas text-[9px] transition-colors duration-300" style={{ color: "var(--text-main)" }}>
                {formatDuration(record!.durationSec!)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 근력 운동 */}
      {hasExercises && (
        <div className="flex flex-col gap-2.5">
          {record!.exercises.map((ex, idx) => {
            const maxWeight = Math.max(...ex.sets.map((s) => s.weight));
            const totalVolume = ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

            return (
              <div key={idx} className="rounded-xl overflow-hidden border transition-colors duration-300" style={{ borderColor: "var(--border-light)" }}>
                {/* 종목 타이틀 영역 */}
                <div
                  className="flex items-center justify-between px-3 py-2.5 transition-colors duration-300"
                  style={{ backgroundColor: "var(--bg-card-hover)" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-sm">{ex.icon}</span>
                    <span className="font-bebas text-[12px] transition-colors duration-300" style={{ color: "var(--text-main)" }}>
                      {ex.name}
                    </span>
                  </div>
                  <span className="font-bebas text-[11px] tracking-widest transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
                    {ex.sets.length} SETS · {totalVolume > 0 ? totalVolume.toLocaleString() : ex.sets.reduce((s, r) => s + r.reps, 0)} {totalVolume > 0 ? "kg" : ""}
                  </span>
                </div>
                {/* 세트 리스트 영역 */}
                <div className="px-3 py-2 transition-colors duration-300" style={{ backgroundColor: "var(--bg-body)" }}>
                  <div className="grid grid-cols-3 gap-x-2 mb-1.5">
                    <span className="font-bebas text-[10px] text-center transition-colors duration-300" style={{ color: "var(--text-sub)" }}>SET</span>
                    <span className="font-bebas text-[10px] text-center transition-colors duration-300" style={{ color: "var(--text-sub)" }}>WEIGHT</span>
                    <span className="font-bebas text-[10px] text-center transition-colors duration-300" style={{ color: "var(--text-sub)" }}>REPS</span>
                  </div>
                  {ex.sets.map((s, si) => {
                    const isHighlight = s.weight === maxWeight && s.weight > 0;
                    const isLast = si === ex.sets.length - 1;
                    return (
                      <div
                        key={si}
                        className="grid grid-cols-3 gap-x-2 py-1 transition-colors duration-300"
                        style={!isLast ? { borderBottom: "1px solid var(--border-light)" } : undefined}
                      >
                        <span className="font-bebas text-[11px] text-center transition-colors duration-300" style={{ color: "var(--text-sub)" }}>{si + 1}</span>
                        <span
                          className="font-bebas text-[12px] text-center tracking-wide transition-colors duration-300"
                          style={{ color: isHighlight ? "var(--accent-main)" : "var(--text-main)" }}
                        >
                          {s.weight > 0 ? `${s.weight} kg` : "-"}
                        </span>
                        <span
                          className="font-bebas text-[12px] text-center transition-colors duration-300"
                          style={{ color: isHighlight ? "var(--accent-main)" : "var(--text-main)" }}
                        >
                          {s.reps}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 유산소 */}
      {hasCardio && (
        <div
          className="rounded-xl p-2.5 flex items-center justify-between border transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
        >
          <span className="font-bebas text-[11px] transition-colors duration-300" style={{ color: "var(--text-main)" }}>🏃 {record!.cardio!.label}</span>
          <span className="font-bebas text-[10px] transition-colors duration-300" style={{ color: "var(--text-sub)" }}>{record!.cardio!.value}</span>
        </div>
      )}

      {/* 기록 없음 */}
      {attendType && hasNoDetail && (
        <p className="font-bebas text-[10px] py-2 transition-colors duration-300" style={{ color: "var(--text-sub)" }}>상세 운동 기록이 없습니다</p>
      )}
    </div>
  );
}
