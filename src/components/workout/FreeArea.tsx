"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FreeExercise, CardioEntry, SetStatus } from "@/types";
import RoutineCard from "./RoutineCard";
import CardioCard from "./CardioCard";
import ExerciseAddBottomSheet from "./ExerciseAddBottomSheet";
import SetEditBottomSheet from "./SetEditBottomSheet";

interface FreeAreaProps {
  freeExercises: Record<string, FreeExercise>;
  orderedIds: string[];
  cardioEntries: CardioEntry[];
  isWorkoutActive: boolean;
  onUpdateCardio: (
    id: string,
    patch: Partial<Pick<CardioEntry, "distanceKm" | "timeMinutes">>,
  ) => void;
  onRemoveCardio: (id: string) => void;
  prData: Record<string, number>;
  selectedFavNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  onToggleCardio: (type: "run" | "cycle" | "row" | "skierg") => void;
  onAddSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (
    exId: string,
    setId: string,
    weight: number,
    reps: number,
  ) => void;
  onSetStatusChange: (exId: string, setId: string, status: SetStatus) => void;
  onRemove: (exId: string) => void;
  onCheckPR: (name: string, diff: number) => void;
  onToggleCardioCheck: (id: string) => void;
}

export default function FreeArea({
  freeExercises,
  orderedIds,
  cardioEntries,
  isWorkoutActive,
  onUpdateCardio,
  onRemoveCardio,
  selectedFavNames,
  onToggleFav,
  onToggleCardio,
  onAddSet,
  onDeleteSet,
  onSetChange,
  onRemove,
  onToggleCardioCheck,
  onSetStatusChange,
  onCheckPR: _onCheckPR,
  prData: _prData,
}: FreeAreaProps) {
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editExId, setEditExId] = useState<string | null>(null);

  const totalCount = orderedIds.length + cardioEntries.length;
  const isEmpty = totalCount === 0;

  // 현재 운동 중인 첫 번째 종목 (pending 세트가 남은 첫 번째)
  const currentExId = isWorkoutActive
    ? orderedIds.find((id) =>
        freeExercises[id]?.sets.some((s) => s.status === "pending"),
      ) ?? null
    : null;

  // 완료된 종목 수 (모든 세트가 clear/fail)
  const completedExCount = isWorkoutActive
    ? orderedIds.filter((id) => {
        const ex = freeExercises[id];
        return (
          ex &&
          ex.sets.length > 0 &&
          ex.sets.every((s) => s.status !== "pending")
        );
      }).length
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 운동 종목 추가 버튼 */}
      <button
        type="button"
        onClick={() => setAddSheetOpen(true)}
        className="w-full rounded-2xl border p-4 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[var(--bg-card-hover)]"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-light)",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
      >
        <Plus className="w-4 h-4" style={{ color: "var(--accent-main)" }} />
        <span
          className="font-bebas text-sm font-bold tracking-wider"
          style={{ color: "var(--accent-main)" }}
        >
          운동 종목 추가하기
        </span>
      </button>

      {/* Empty State */}
      {isEmpty && (
        <div
          className="rounded-2xl border px-5 py-7 flex flex-col items-center gap-5 text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p className="text-3xl leading-none">🏋️</p>
          <div className="flex flex-col gap-1.5">
            <p
              className="font-bebas text-[17px] tracking-wider"
              style={{ color: "var(--text-main)" }}
            >
              오늘 운동을 추가해보세요
            </p>
            <p className="text-[12px] font-medium" style={{ color: "var(--text-sub)" }}>
              종목 추가 후 카드를 눌러 KG · 횟수를 설정하세요
            </p>
          </div>

          {/* 스텝 인디케이터 */}
          <div className="w-full flex items-center justify-center gap-0">
            {[
              { num: "1", label: "종목 추가" },
              { num: "2", label: "KG · 횟수" },
              { num: "3", label: "운동 시작" },
            ].map(({ num, label }, i, arr) => (
              <div key={num} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="font-bebas text-[13px] w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
                  >
                    {num}
                  </span>
                  <span
                    className="text-[10px] font-medium whitespace-nowrap"
                    style={{ color: "var(--text-sub)" }}
                  >
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="w-8 h-px mb-4 mx-1"
                    style={{ backgroundColor: "var(--border-light)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 내 운동 목록 */}
      {!isEmpty && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div>
              <h3
                className="font-bebas text-[16px] font-bold tracking-wider uppercase"
                style={{ color: "var(--accent-main)" }}
              >
                내 운동
              </h3>
              <p
                className="font-bebas text-[10px] mt-0.5 tracking-wider"
                style={{ color: "var(--text-sub)" }}
              >
                {totalCount}종목
              </p>
            </div>
            {isWorkoutActive && (
              <span
                className="font-bebas text-[11px] px-2.5 py-0.5 rounded-full tracking-wider"
                style={{
                  backgroundColor: "var(--accent-bg)",
                  color: "var(--accent-main)",
                  border: "1px solid var(--border-light)",
                }}
              >
                {completedExCount} / {orderedIds.length} 완료
              </span>
            )}
          </div>

          <div className="p-3 flex flex-col gap-3">
            {orderedIds.map((id) => {
              const ex = freeExercises[id];
              if (!ex) return null;
              return (
                <RoutineCard
                  key={id}
                  id={id}
                  exercise={ex}
                  onCardClick={() => setEditExId(id)}
                  onRemove={onRemove}
                  isWorkoutActive={isWorkoutActive}
                  isCurrent={id === currentExId}
                  onSetStatusChange={onSetStatusChange}
                />
              );
            })}
            {cardioEntries.map((e) => (
              <CardioCard
                key={e.id}
                entry={e}
                isWorkoutActive={isWorkoutActive}
                onUpdate={(patch) => onUpdateCardio(e.id, patch)}
                onRemove={() => onRemoveCardio(e.id)}
                onToggleCheck={() => onToggleCardioCheck(e.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 바텀 시트들 */}
      <ExerciseAddBottomSheet
        open={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        selectedNames={selectedFavNames}
        cardioTypes={cardioEntries.map((e) => e.type)}
        onToggleFav={onToggleFav}
        onToggleCardio={onToggleCardio}
      />

      {editExId && freeExercises[editExId] && (
        <SetEditBottomSheet
          open={!!editExId}
          onClose={() => setEditExId(null)}
          exId={editExId}
          exercise={freeExercises[editExId]}
          isWorkoutActive={isWorkoutActive}
          onSetChange={onSetChange}
          onDeleteSet={onDeleteSet}
          onAddSet={onAddSet}
        />
      )}
    </div>
  );
}
