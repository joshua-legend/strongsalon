"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FreeExercise, CardioEntry, CardioType, SetStatus } from "@/types";
import RoutineCard from "./RoutineCard";
import ExerciseAddBottomSheet from "./ExerciseAddBottomSheet";
import SetEditBottomSheet from "./SetEditBottomSheet";

const CARDIO_META: Record<CardioType, { label: string; emoji: string }> = {
  run: { label: "런닝", emoji: "🏃" },
  cycle: { label: "싸이클", emoji: "🚴" },
  row: { label: "로잉", emoji: "🚣" },
  skierg: { label: "스키에르그", emoji: "⛷️" },
};

interface FreeAreaProps {
  freeExercises: Record<string, FreeExercise>;
  orderedIds: string[];
  cardioEntries: CardioEntry[];
  isWorkoutActive: boolean;
  onUpdateCardio: (id: string, patch: Partial<Pick<CardioEntry, "distanceKm" | "timeMinutes">>) => void;
  onRemoveCardio: (id: string) => void;
  prData: Record<string, number>;
  selectedFavNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  onToggleCardio: (type: "run" | "cycle" | "row" | "skierg") => void;
  onAddSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
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
  onSetStatusChange: _onSetStatusChange,
  onCheckPR: _onCheckPR,
  prData: _prData,
}: FreeAreaProps) {
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editExId, setEditExId] = useState<string | null>(null);

  const totalCount = orderedIds.length + cardioEntries.length;
  const isEmpty = totalCount === 0;

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
        <span className="font-bebas text-sm font-bold tracking-wider" style={{ color: "var(--accent-main)" }}>
          운동 종목 추가하기
        </span>
      </button>

      {/* Empty State */}
      {isEmpty && (
        <div
          className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-3 text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p className="font-bebas text-sm tracking-wider" style={{ color: "var(--text-sub)" }}>
            아직 추가된 운동이 없어요
          </p>
          <p className="text-xs" style={{ color: "var(--text-sub)" }}>
            위 버튼을 눌러 운동 종목을 추가해 보세요
          </p>
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
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
            <h3 className="font-bebas text-[16px] font-bold tracking-wider uppercase" style={{ color: "var(--accent-main)" }}>
              내 운동
            </h3>
            <p className="font-bebas text-[10px] mt-0.5 tracking-wider" style={{ color: "var(--text-sub)" }}>
              {totalCount}종목
            </p>
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
                />
              );
            })}
            {cardioEntries.map((e) => {
              const filled = e.distanceKm > 0 && e.timeMinutes > 0;
              return (
                <div
                  key={e.id}
                  className="rounded-2xl border overflow-hidden transition-all"
                  style={{
                    backgroundColor: e.checked ? "var(--accent-bg)" : "var(--bg-body)",
                    borderColor: e.checked ? "var(--accent-main)" : "var(--border-light)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 py-3 px-4">
                    <div
                      className="flex items-center gap-1.5 font-bebas text-[15px] font-bold shrink-0 tracking-wider"
                      style={{ color: "var(--accent-sub)" }}
                    >
                      <span>{CARDIO_META[e.type].emoji}</span>
                      <span>{CARDIO_META[e.type].label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <label className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider">
                        <input
                          type="number"
                          min={0}
                          step={0.1}
                          value={e.distanceKm || ""}
                          onChange={(ev) =>
                            onUpdateCardio(e.id, { distanceKm: parseFloat(ev.target.value) || 0 })
                          }
                          className="w-16 rounded-xl py-1.5 px-2 font-bebas text-[13px] outline-none transition-all border focus:border-[var(--border-focus)]"
                          style={{
                            backgroundColor: "var(--bg-body)",
                            borderColor: "var(--border-light)",
                            color: "var(--text-main)",
                          }}
                        />
                        <span style={{ color: "var(--text-main)" }}>km</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={e.timeMinutes || ""}
                          onChange={(ev) =>
                            onUpdateCardio(e.id, { timeMinutes: parseInt(ev.target.value, 10) || 0 })
                          }
                          className="w-14 rounded-xl py-1.5 px-2 font-bebas text-[13px] outline-none transition-all border focus:border-[var(--border-focus)]"
                          style={{
                            backgroundColor: "var(--bg-body)",
                            borderColor: "var(--border-light)",
                            color: "var(--text-main)",
                          }}
                        />
                        <span style={{ color: "var(--text-main)" }}>분</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveCardio(e.id)}
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]"
                      style={{ color: "var(--text-sub)" }}
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </div>

                  {isWorkoutActive && filled && (
                    <div className="px-4 pb-3">
                      <button
                        type="button"
                        onClick={() => onToggleCardioCheck(e.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bebas text-[12px] tracking-wider transition-all active:scale-95 border"
                        style={
                          e.checked
                            ? {
                                backgroundColor: "var(--accent-bg)",
                                borderColor: "var(--accent-main)",
                                color: "var(--accent-main)",
                              }
                            : {
                                backgroundColor: "transparent",
                                borderColor: "var(--border-light)",
                                color: "var(--text-sub)",
                              }
                        }
                      >
                        <span className="text-[16px]">{e.checked ? "✅" : "⬜"}</span>
                        <span>{e.checked ? "유산소 완료!" : "유산소 완료 체크"}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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
