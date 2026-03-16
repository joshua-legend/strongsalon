"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import type { FreeExercise, SetStatus } from "@/types";
import { getExerciseCategory, exercisesInfo } from "@/data/exercises-info";

interface RoutineCardProps {
  id: string;
  exercise: FreeExercise;
  onCardClick: () => void;
  onRemove: (exId: string) => void;
  isWorkoutActive: boolean;
  isCurrent: boolean;
  onSetStatusChange: (exId: string, setId: string, status: SetStatus) => void;
}

const REST_DURATION = 90;

export default function RoutineCard({
  id,
  exercise,
  onCardClick,
  onRemove,
  isWorkoutActive,
  isCurrent,
  onSetStatusChange,
}: RoutineCardProps) {
  const category = getExerciseCategory(exercise.name);
  const firstSet = exercise.sets[0];
  const setCount = exercise.sets.length;
  const hasUnsetWeight = setCount > 0 && exercise.sets.some((s) => s.weight === 0);
  const tip = exercisesInfo.find((e) => e.name === exercise.name)?.tips ?? null;

  // 휴식 타이머
  const [restSec, setRestSec] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestSec(REST_DURATION);
    timerRef.current = setInterval(() => {
      setRestSec((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // restSec=0 되면 2초 후 자동 소거
  useEffect(() => {
    if (restSec === 0) {
      const t = setTimeout(() => setRestSec(null), 2000);
      return () => clearTimeout(t);
    }
  }, [restSec]);

  const handleSetStatus = (setId: string, status: SetStatus) => {
    onSetStatusChange(id, setId, status);
    startRest();
  };

  // ─────────────────────────────────────────
  // READY 모드 (기존 카드)
  // ─────────────────────────────────────────
  if (!isWorkoutActive) {
    const summary =
      setCount > 0 && firstSet
        ? `${setCount} SET · ${firstSet.weight > 0 ? firstSet.weight : "—"} KG · ${firstSet.reps > 0 ? firstSet.reps : "—"} REPS`
        : `0 SET · — · —`;

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCardClick();
          }
        }}
        className="rounded-2xl border p-4 cursor-pointer transition-all duration-300 hover:bg-[var(--bg-card-hover)] active:scale-[0.99]"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: hasUnsetWeight ? "#f59e0b" : "var(--border-light)",
          borderWidth: hasUnsetWeight ? "1.5px" : "1px",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="font-bebas text-[12px] font-bold px-2 py-0.5 rounded-md tracking-wider"
                style={{
                  backgroundColor: "var(--accent-bg)",
                  color: "var(--accent-main)",
                  border: "1px solid var(--border-light)",
                }}
              >
                {category}
              </span>
              <span
                className="font-bebas text-[16px] font-bold tracking-wider truncate"
                style={{ color: "var(--text-main)" }}
              >
                {exercise.icon} {exercise.name}
              </span>
              {hasUnsetWeight && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    color: "#f59e0b",
                    border: "1px solid #f59e0b",
                  }}
                >
                  KG 미입력
                </span>
              )}
            </div>
            <div
              className="font-bebas text-[13px] font-bold tracking-widest"
              style={{ color: "var(--text-sub)" }}
            >
              {summary}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 hover:bg-[var(--bg-body)]"
            style={{ color: "var(--text-sub)" }}
            aria-label="종목 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // IN PROGRESS 모드 (가이드 PT 카드)
  // ─────────────────────────────────────────
  const nextPendingSetId =
    exercise.sets.find((s) => s.status === "pending")?.id ?? null;
  const allDone =
    setCount > 0 && exercise.sets.every((s) => s.status !== "pending");

  return (
    <div
      className="rounded-2xl border p-4 transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: isCurrent ? "var(--accent-main)" : "var(--border-light)",
        borderWidth: isCurrent ? "2px" : "1px",
        boxShadow: isCurrent
          ? "0 0 0 3px var(--accent-bg)"
          : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        opacity: allDone ? 0.7 : 1,
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="font-bebas text-[12px] font-bold px-2 py-0.5 rounded-md tracking-wider shrink-0"
            style={{
              backgroundColor: "var(--accent-bg)",
              color: "var(--accent-main)",
              border: "1px solid var(--border-light)",
            }}
          >
            {category}
          </span>
          <span
            className="font-bebas text-[16px] font-bold tracking-wider truncate"
            style={{ color: "var(--text-main)" }}
          >
            {exercise.icon} {exercise.name}
          </span>
          {allDone && (
            <span
              className="font-bebas text-[10px] px-1.5 py-0.5 rounded-md shrink-0 tracking-wider"
              style={{
                backgroundColor: "var(--accent-bg)",
                color: "var(--accent-main)",
                border: "1px solid var(--border-light)",
              }}
            >
              완료 ✓
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onCardClick}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-body)]"
            style={{ color: "var(--text-sub)" }}
            aria-label="세트 편집"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-body)]"
            style={{ color: "var(--text-sub)" }}
            aria-label="종목 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 코칭 팁 */}
      {tip && !allDone && (
        <div
          className="flex items-start gap-1.5 px-3 py-2 rounded-lg mb-3"
          style={{
            backgroundColor: "var(--accent-bg)",
            border: "1px solid var(--border-light)",
          }}
        >
          <span className="text-[10px] shrink-0 mt-0.5">💡</span>
          <p
            className="text-[11px] leading-snug"
            style={{ color: "var(--accent-main)" }}
          >
            {tip}
          </p>
        </div>
      )}

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-[28px_1fr_1fr_36px_36px] gap-1.5 px-1 mb-1">
        {["SET", "KG", "REPS", "", ""].map((h, i) => (
          <span
            key={i}
            className="font-bebas text-[10px] text-center"
            style={{ color: "var(--text-sub)" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* 세트 행 */}
      <div className="flex flex-col gap-1">
        {exercise.sets.map((set, idx) => {
          const isDone = set.status === "clear" || set.status === "fail";
          const isNext = set.id === nextPendingSetId;

          return (
            <div
              key={set.id}
              className="grid grid-cols-[28px_1fr_1fr_36px_36px] gap-1.5 items-center py-1.5 rounded-lg px-1 transition-all duration-200"
              style={{
                backgroundColor: isNext ? "var(--accent-bg)" : "transparent",
                border: isNext
                  ? "1px solid var(--border-light)"
                  : "1px solid transparent",
                opacity: isDone ? 0.45 : 1,
              }}
            >
              {/* SET 번호 */}
              <span
                className="font-bebas text-[12px] text-center"
                style={{
                  color: isNext ? "var(--accent-main)" : "var(--text-sub)",
                }}
              >
                {idx + 1}
              </span>

              {/* KG */}
              <span
                className="font-bebas text-[14px] text-center"
                style={{ color: "var(--text-main)" }}
              >
                {set.weight > 0 ? set.weight : "—"}
              </span>

              {/* REPS */}
              <span
                className="font-bebas text-[14px] text-center"
                style={{ color: "var(--text-main)" }}
              >
                {set.reps > 0 ? set.reps : "—"}
              </span>

              {/* ✓ Clear 버튼 */}
              <button
                type="button"
                disabled={isDone}
                onClick={() => handleSetStatus(set.id, "clear")}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 disabled:pointer-events-none"
                style={{
                  backgroundColor:
                    set.status === "clear"
                      ? "var(--accent-main)"
                      : "var(--bg-body)",
                  color:
                    set.status === "clear" ? "var(--accent-text)" : "var(--text-sub)",
                  border: "1px solid var(--border-light)",
                  opacity: isDone && set.status !== "clear" ? 0.3 : 1,
                }}
                aria-label={`${idx + 1}세트 완료`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              {/* ✗ Fail 버튼 */}
              <button
                type="button"
                disabled={isDone}
                onClick={() => handleSetStatus(set.id, "fail")}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 disabled:pointer-events-none"
                style={{
                  backgroundColor:
                    set.status === "fail" ? "#f59e0b" : "var(--bg-body)",
                  color: set.status === "fail" ? "white" : "var(--text-sub)",
                  border: "1px solid var(--border-light)",
                  opacity: isDone && set.status !== "fail" ? 0.3 : 1,
                }}
                aria-label={`${idx + 1}세트 실패`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 휴식 타이머 */}
      {restSec !== null && (
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor:
              restSec === 0 ? "var(--accent-bg)" : "rgba(245, 158, 11, 0.08)",
            border: `1px solid ${restSec === 0 ? "var(--accent-main)" : "#f59e0b"}`,
          }}
        >
          <span className="text-[11px]">{restSec === 0 ? "✅" : "⏱"}</span>
          <span
            className="font-bebas text-[13px] tracking-wider"
            style={{
              color: restSec === 0 ? "var(--accent-main)" : "#f59e0b",
            }}
          >
            {restSec === 0
              ? "다음 세트 시작!"
              : `휴식 중  ${Math.floor(restSec / 60)}:${String(restSec % 60).padStart(2, "0")}`}
          </span>
          <button
            type="button"
            onClick={() => {
              setRestSec(null);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            }}
            className="ml-auto flex items-center justify-center"
            style={{ color: "var(--text-sub)" }}
            aria-label="타이머 종료"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
