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
  return `${y}년 ${m}월 ${d}일`;
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
      <div className="mt-4 pt-3 flex flex-col gap-2 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="font-bebas text-[10px] text-neutral-400">
            {formatDisplayDate(dateKey)}
          </span>
          <button onClick={onClose} className="text-[12px] px-2 py-1 rounded text-neutral-400 bg-neutral-950">
            닫기
          </button>
        </div>
        <p className="font-bebas text-[10px] py-4 text-center text-neutral-400">
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
    <div className="mt-4 pt-3 flex flex-col gap-3 border-t border-neutral-800">
      {/* Header: 날짜 + 타입 + 닫기 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bebas text-[10px] text-neutral-400">
            {formatDisplayDate(dateKey)}
          </span>
          {attendType && (
            <span
              className="font-bebas text-[8px] px-1.5 py-0.5 rounded"
              style={{
                background: `${typeColor[attendType]}25`,
                color: typeColor[attendType],
              }}
            >
              {typeLabel[attendType]}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-[12px] px-2 py-1 rounded text-neutral-400 bg-neutral-950">
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
              <span className="text-[12px] leading-none">{CONDITION_MAP[record.condition].emoji}</span>
              <span
                className="font-bebas text-[9px]"
                style={{ color: CONDITION_MAP[record.condition].color }}
              >
                {CONDITION_MAP[record.condition].label}
              </span>
            </div>
          )}
          {hasDuration && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <span className="text-[11px] leading-none">⏱️</span>
              <span className="font-bebas text-[9px] text-neutral-300">
                {formatDuration(record!.durationSec!)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 근력 운동 */}
      {hasExercises && (
        <div className="flex flex-col gap-2">
          {record!.exercises.map((ex, idx) => {
            const maxWeight = Math.max(...ex.sets.map((s) => s.weight));
            const totalVolume = ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

            return (
              <div key={idx} className="rounded-lg overflow-hidden border border-neutral-800">
                {/* 종목 헤더 */}
                <div className="flex items-center justify-between px-3 py-2 bg-neutral-900">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px]">{ex.icon}</span>
                    <span className="font-bebas text-[11px] text-white">{ex.name}</span>
                  </div>
                  <span className="font-bebas text-[8px] text-neutral-500">
                    {ex.sets.length}세트 · {totalVolume > 0 ? `${totalVolume.toLocaleString()}kg` : `${ex.sets.reduce((s, r) => s + r.reps, 0)}회`}
                  </span>
                </div>
                {/* 세트 테이블 */}
                <div className="px-3 py-1.5 bg-neutral-950">
                  <div className="grid grid-cols-3 gap-x-2 mb-1">
                    <span className="font-bebas text-[7px] text-neutral-600 text-center">세트</span>
                    <span className="font-bebas text-[7px] text-neutral-600 text-center">무게</span>
                    <span className="font-bebas text-[7px] text-neutral-600 text-center">횟수</span>
                  </div>
                  {ex.sets.map((s, si) => {
                    const isMax = s.weight === maxWeight && s.weight > 0;
                    return (
                      <div
                        key={si}
                        className="grid grid-cols-3 gap-x-2 py-[3px]"
                        style={si < ex.sets.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.04)" } : undefined}
                      >
                        <span className="font-bebas text-[9px] text-neutral-500 text-center">{si + 1}</span>
                        <span
                          className="font-bebas text-[9px] text-center"
                          style={{ color: isMax ? "rgb(163,230,53)" : "rgb(212,212,212)" }}
                        >
                          {s.weight > 0 ? `${s.weight}kg` : "-"}
                        </span>
                        <span
                          className="font-bebas text-[9px] text-center"
                          style={{ color: isMax ? "rgb(163,230,53)" : "rgb(212,212,212)" }}
                        >
                          {s.reps}회
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
        <div className="rounded-lg p-2.5 flex items-center justify-between bg-neutral-900 border border-neutral-800">
          <span className="font-bebas text-[11px] text-white">🏃 {record!.cardio!.label}</span>
          <span className="font-bebas text-[10px] text-neutral-400">{record!.cardio!.value}</span>
        </div>
      )}

      {/* 기록 없음 */}
      {attendType && hasNoDetail && (
        <p className="font-bebas text-[10px] py-2 text-neutral-400">상세 운동 기록이 없습니다</p>
      )}
    </div>
  );
}
