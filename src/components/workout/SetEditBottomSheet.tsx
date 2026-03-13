"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import type { FreeExercise } from "@/types";

interface SetEditBottomSheetProps {
  open: boolean;
  onClose: () => void;
  exId: string;
  exercise: FreeExercise;
  isWorkoutActive: boolean;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onAddSet: (exId: string) => void;
  onSetStatusChange?: (exId: string, setId: string, status: "pending" | "clear" | "fail") => void;
}

export default function SetEditBottomSheet({
  open,
  onClose,
  exId,
  exercise,
  isWorkoutActive,
  onSetChange,
  onDeleteSet,
  onAddSet,
}: SetEditBottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-t-2xl overflow-hidden max-h-[85vh] flex flex-col"
          style={{
            backgroundColor: "var(--bg-card)",
            borderTop: "1px solid var(--border-light)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-4 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{exercise.icon}</span>
              <h3 className="font-bebas text-lg tracking-wider" style={{ color: "var(--text-main)" }}>
                {exercise.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
              style={{ color: "var(--text-sub)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sets list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="grid grid-cols-[32px_1fr_1fr_40px] gap-2 mb-2 px-1">
              <span className="font-bebas text-[10px] text-center" style={{ color: "var(--text-sub)" }}>
                SET
              </span>
              <span className="font-bebas text-[10px] text-center" style={{ color: "var(--text-sub)" }}>
                KG
              </span>
              <span className="font-bebas text-[10px] text-center" style={{ color: "var(--text-sub)" }}>
                REPS
              </span>
              <span />
            </div>

            {exercise.sets.map((set, idx) => (
              <div
                key={set.id}
                className="grid grid-cols-[32px_1fr_1fr_40px] gap-2 items-center py-2 border-b last:border-b-0"
                style={{ borderColor: "var(--border-light)" }}
              >
                <span
                  className="font-bebas text-[12px] text-center"
                  style={{ color: "var(--text-sub)" }}
                >
                  {idx + 1}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={2.5}
                  value={set.weight || ""}
                  onChange={(e) =>
                    onSetChange(exId, set.id, parseFloat(e.target.value) || 0, set.reps)
                  }
                  className="w-full px-3 py-2 rounded-lg font-bebas text-sm text-center outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--bg-body)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-main)",
                  }}
                  placeholder="0"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={set.reps || ""}
                  onChange={(e) =>
                    onSetChange(exId, set.id, set.weight, parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full px-3 py-2 rounded-lg font-bebas text-sm text-center outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--bg-body)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-main)",
                  }}
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => onDeleteSet(exId, set.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-body)]"
                  style={{ color: "var(--text-sub)" }}
                  aria-label="세트 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onAddSet(exId)}
              className="w-full mt-4 py-3 rounded-xl border border-dashed font-bebas text-sm tracking-wider transition-all hover:bg-[var(--accent-bg)]"
              style={{
                borderColor: "var(--accent-main)",
                color: "var(--accent-main)",
              }}
            >
              ＋ 세트 추가
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
