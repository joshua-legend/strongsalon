"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FreeArea from "@/components/workout/FreeArea";
import { useFreeExercises } from "@/components/workout/useFreeExercises";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { useAttendance } from "@/context/AttendanceContext";
import type { CardioEntry, CardioType, SetStatus } from "@/types";
import type { DayWorkoutRecord } from "@/data/workoutHistory";

interface RecordWorkoutAddSheetProps {
  open: boolean;
  dateKey: string | null;
  onClose: () => void;
}

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const CARDIO_LABELS: Record<CardioType, string> = {
  run: "러닝",
  cycle: "사이클",
  row: "로잉",
  skierg: "스키에르그",
};

function buildCardioValue(entry: CardioEntry): string {
  const distance = entry.distanceKm > 0 ? `${entry.distanceKm}km` : "";
  const time = entry.timeMinutes > 0 ? `${entry.timeMinutes}분` : "";
  if (distance && time) return `${distance} / ${time}`;
  if (distance) return distance;
  if (time) return time;
  return "";
}

export default function RecordWorkoutAddSheet({
  open,
  dateKey,
  onClose,
}: RecordWorkoutAddSheetProps) {
  const { appendWorkoutRecord } = useWorkoutRecords();
  const { addAttendance } = useAttendance();
  const [cardioEntries, setCardioEntries] = useState<CardioEntry[]>([]);

  const {
    freeExercises,
    orderedIds,
    selectedFavNames,
    toggleFav,
    addFreeSet,
    delFreeSet,
    onFSetChange,
    setSetStatus,
    removeFreeEx,
  } = useFreeExercises({}, () => {});

  const canSave = useMemo(() => {
    const hasStrength = orderedIds.some((id) => {
      const ex = freeExercises[id];
      if (!ex) return false;
      return ex.sets.some((s) => s.weight > 0 && s.reps > 0);
    });
    const hasCardio = cardioEntries.some(
      (entry) => entry.distanceKm > 0 || entry.timeMinutes > 0
    );
    return hasStrength || hasCardio;
  }, [orderedIds, freeExercises, cardioEntries]);

  const toggleCardio = (type: CardioType) => {
    setCardioEntries((prev) => {
      const exists = prev.some((entry) => entry.type === type);
      if (exists) return prev.filter((entry) => entry.type !== type);
      return [
        ...prev,
        {
          id: nextId("cardio"),
          type,
          distanceKm: 0,
          timeMinutes: 0,
          checked: false,
        },
      ];
    });
  };

  const updateCardio = (
    id: string,
    patch: Partial<Pick<CardioEntry, "distanceKm" | "timeMinutes">>
  ) => {
    setCardioEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
    );
  };

  const removeCardio = (id: string) => {
    setCardioEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const toggleCardioCheck = (id: string) => {
    setCardioEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, checked: !entry.checked } : entry
      )
    );
  };

  const closeSheet = () => {
    if (!open) return;
    onClose();
  };

  const handleSave = () => {
    if (!dateKey || !canSave) return;

    const exercises = orderedIds
      .map((id) => {
        const ex = freeExercises[id];
        if (!ex) return null;
        const sets = ex.sets
          .filter((s) => s.weight > 0 && s.reps > 0)
          .map((s) => ({ weight: s.weight, reps: s.reps }));
        if (sets.length === 0) return null;
        return {
          icon: ex.icon,
          name: ex.name,
          sets,
        };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);

    const validCardio = cardioEntries.filter(
      (entry) => entry.distanceKm > 0 || entry.timeMinutes > 0
    );

    if (exercises.length === 0 && validCardio.length === 0) return;

    const record: DayWorkoutRecord = {
      date: dateKey,
      type: "self",
      exercises,
    };

    if (validCardio.length > 0) {
      const first = validCardio[0];
      record.cardio = {
        type: first.type,
        label: CARDIO_LABELS[first.type],
        value: validCardio.map(buildCardioValue).join(", "),
      };
    }

    appendWorkoutRecord(record);
    addAttendance(dateKey, "self");
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={closeSheet}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="max-h-[86vh] w-full max-w-[480px] overflow-hidden rounded-t-2xl border border-b-0"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--border-light)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--border-light)" }}
            >
              <div>
                <p
                  className="font-bebas text-[11px] tracking-[0.12em]"
                  style={{ color: "var(--text-sub)" }}
                >
                  WORKOUT RECORD
                </p>
                <h3
                  className="font-bebas text-[18px] tracking-wider"
                  style={{ color: "var(--text-main)" }}
                >
                  운동 기록 추가
                </h3>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                style={{
                  borderColor: "var(--border-light)",
                  color: "var(--text-sub)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(86vh-132px)] overflow-y-auto px-4 py-4">
              <FreeArea
                freeExercises={freeExercises}
                orderedIds={orderedIds}
                cardioEntries={cardioEntries}
                isWorkoutActive={false}
                onUpdateCardio={updateCardio}
                onRemoveCardio={removeCardio}
                prData={{}}
                selectedFavNames={selectedFavNames}
                onToggleFav={toggleFav}
                onToggleCardio={toggleCardio}
                onAddSet={addFreeSet}
                onDeleteSet={delFreeSet}
                onSetChange={onFSetChange}
                onSetStatusChange={(
                  exId: string,
                  setId: string,
                  status: SetStatus
                ) => setSetStatus(exId, setId, status)}
                onRemove={removeFreeEx}
                onCheckPR={() => {}}
                onToggleCardioCheck={toggleCardioCheck}
              />
            </div>

            <div
              className="flex items-center gap-2 border-t px-4 py-3"
              style={{ borderColor: "var(--border-light)" }}
            >
              <button
                type="button"
                onClick={closeSheet}
                className="flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors"
                style={{
                  borderColor: "var(--border-light)",
                  color: "var(--text-sub)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 rounded-xl py-3 text-sm font-bold transition-all disabled:opacity-40"
                style={{
                  backgroundColor: "var(--accent-main)",
                  color: "var(--accent-text)",
                }}
              >
                기록 저장
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
