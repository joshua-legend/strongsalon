"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { exercisesInfo } from "@/data/exercises-info";
import { EXERCISE_GROUPS } from "@/data/workout";
import type { CardioType } from "@/types";

const STRENGTH_CATEGORIES = ["가슴", "하체", "등", "어깨", "팔", "코어"] as const;

const strengthExercises = exercisesInfo.filter(
  (ex) => ex.category !== "유산소"
);

const cardioGroup = EXERCISE_GROUPS.find((g) => g.label === "유산소");

interface ExerciseAddBottomSheetProps {
  open: boolean;
  onClose: () => void;
  selectedNames: Set<string>;
  cardioTypes: CardioType[];
  onToggleFav: (icon: string, name: string) => void;
  onToggleCardio: (type: CardioType) => void;
}

export default function ExerciseAddBottomSheet({
  open,
  onClose,
  selectedNames,
  cardioTypes,
  onToggleFav,
  onToggleCardio,
}: ExerciseAddBottomSheetProps) {
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

  const handleStrengthClick = (icon: string, name: string) => {
    onToggleFav(icon, name);
    onClose();
  };

  const handleCardioClick = (type: CardioType) => {
    onToggleCardio(type);
    onClose();
  };

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
          className="w-full max-w-md rounded-t-2xl overflow-hidden max-h-[80vh] flex flex-col"
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
            <h3 className="font-bebas text-lg tracking-wider" style={{ color: "var(--text-main)" }}>
              운동 종목 추가
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
              style={{ color: "var(--text-sub)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Exercise list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {/* Strength exercises by category */}
            {STRENGTH_CATEGORIES.map((cat) => {
              const items = strengthExercises.filter((e) => e.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <div
                    className="font-bebas text-[11px] tracking-widest uppercase mb-2"
                    style={{ color: "var(--text-sub)" }}
                  >
                    {cat}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((ex) => {
                      const isSelected = selectedNames.has(ex.name);
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => handleStrengthClick(ex.icon, ex.name)}
                          className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl border transition-all duration-300 font-bebas text-[12px] tracking-wider"
                          style={
                            isSelected
                              ? {
                                  borderColor: "var(--accent-main)",
                                  backgroundColor: "var(--accent-bg)",
                                  color: "var(--accent-main)",
                                }
                              : {
                                  borderColor: "var(--border-light)",
                                  backgroundColor: "var(--bg-body)",
                                  color: "var(--text-main)",
                                }
                          }
                        >
                          <span className="text-base">{ex.icon}</span>
                          <span>{ex.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Cardio */}
            {cardioGroup?.cardio && cardioGroup.cardio.length > 0 && (
              <div>
                <div
                  className="font-bebas text-[11px] tracking-widest uppercase mb-2"
                  style={{ color: "var(--text-sub)" }}
                >
                  유산소
                </div>
                <div className="flex flex-wrap gap-2">
                  {cardioGroup.cardio.map((c) => {
                    const isSelected = cardioTypes.includes(c.type);
                    return (
                      <button
                        key={c.type}
                        type="button"
                        onClick={() => handleCardioClick(c.type)}
                        className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl border transition-all duration-300 font-bebas text-[12px] tracking-wider"
                        style={
                          isSelected
                            ? {
                                borderColor: "var(--accent-sub)",
                                backgroundColor: "rgba(34,197,94,0.1)",
                                color: "var(--accent-sub)",
                              }
                            : {
                                borderColor: "var(--border-light)",
                                backgroundColor: "var(--bg-body)",
                                color: "var(--text-main)",
                              }
                        }
                      >
                        <span className="text-base">{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
