"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useWorkoutLog } from "./useWorkoutLog";
import CondBox from "./CondBox";
import FreeArea from "./FreeArea";
import CustomDropdown, { type DropdownOption } from "@/components/ui/CustomDropdown";
import { getMockRecommendation } from "@/data/workoutRecommendation";

const EST_TIME_OPTIONS: DropdownOption<number>[] = [
  { value: 30, label: "30분" },
  { value: 45, label: "45분" },
  { value: 60, label: "60분" },
  { value: 90, label: "90분" },
];

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const { exitWorkout, setSelectedSplit } = useApp();
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [mode, setMode] = useState<"recommended" | "free">("free");

  const [recommendationReason, setRecommendationReason] = useState<string | null>(null);

  const handleModeSelect = (m: "recommended" | "free") => {
    if (m === mode) return;
    setMode(m);
    if (m === "free") {
      setSelectedSplit(null);
      log.resetExercises();
      setRecommendationReason(null);
    } else {
      setSelectedSplit(null);
      const rec = getMockRecommendation();
      log.loadFromRecommendation(rec);
      setRecommendationReason(rec.reason ?? null);
    }
  };

  const handleButtonClick = () => {
    if (log.workoutPhase === "ready") {
      log.startWorkout();
    } else if (log.workoutPhase === "inProgress") {
      log.completeWorkout();
    }
  };

  const handleOverlayEnterComplete = () => {
    setTimeout(() => setOverlayExiting(true), 2500);
  };

  const handleExitComplete = () => {
    exitWorkout();
  };

  const showOverlay = log.workoutPhase === "completed";
  const isReady = log.workoutPhase === "ready";
  const isInProgress = log.workoutPhase === "inProgress";

  const bottomNavHeight = 72;
  const ctaBottomMargin = 16; // bt-m: 버튼과 바텀 네비 사이 간격
  const ctaBarHeight = 88; // 스크롤 영역 padding-bottom

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg-body)]">
      {/* 스크롤 영역 (형제 1) */}
      <div
        className="flex-1 overflow-auto px-4 py-4"
        style={{ paddingBottom: ctaBarHeight }}
      >
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col gap-3.5">
            {/* 운동 시간 / 컨디션 드롭다운 */}
            <div className="grid grid-cols-2 gap-3">
              <CustomDropdown<number>
                value={log.estMinutes}
                options={EST_TIME_OPTIONS}
                onChange={log.setEstMinutes}
                subLabel="예상 운동시간"
              />
              <CondBox value={log.condition} onChange={log.setCondition} />
            </div>

            {/* 모드 선택: 추천 / 자유 (Segmented Control) */}
            <div className="relative flex gap-2 rounded-2xl p-1 border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
              <button
                type="button"
                onClick={() => handleModeSelect("recommended")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-[13px] font-bold text-white ${
                  mode === "recommended"
                    ? "bg-[var(--accent-main)] border border-[var(--accent-main)] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    : "bg-black/20 border border-transparent"
                }`}
              >
                <span className="text-base">✨</span>
                <span>추천</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeSelect("free")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-[13px] font-bold text-white ${
                  mode === "free"
                    ? "bg-[var(--accent-main)] border border-[var(--accent-main)] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    : "bg-black/20 border border-transparent"
                }`}
              >
                <Hand className="w-4 h-4 shrink-0" strokeWidth={2} style={{ color: "inherit" }} />
                <span>자유</span>
              </button>
            </div>

            {/* 추천 모드 시 추천 이유 */}
            <AnimatePresence mode="wait">
              {mode === "recommended" && recommendationReason && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className="rounded-2xl px-4 py-3 mt-1 border"
                    style={{ backgroundColor: "var(--accent-bg)", borderColor: "var(--border-light)" }}
                  >
                    <p className="text-[12px] transition-colors duration-300" style={{ color: "var(--accent-main)" }}>
                      ✨ {recommendationReason}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <FreeArea
              freeExercises={log.freeExercises}
              orderedIds={log.orderedIds}
              cardioEntries={log.cardioEntries}
              isWorkoutActive={isInProgress}
              onUpdateCardio={log.updateCardio}
              onRemoveCardio={log.removeCardio}
              prData={log.prData}
              selectedFavNames={log.selectedFavNames}
              onToggleFav={log.toggleFav}
              onToggleCardio={log.toggleCardio}
              onAddSet={(id) => log.addFreeSet(id)}
              onDeleteSet={log.delFreeSet}
              onSetChange={log.onFSetChange}
              onSetStatusChange={log.setSetStatus}
              onRemove={log.removeFreeEx}
              onCheckPR={log.showPR}
              onToggleCardioCheck={log.toggleCardioCheck}
            />
          </div>
        </div>
      </div>

      {/* 고정 CTA 바 - 바텀 네비처럼 하단 고정 (bt-m 적용) */}
      <div
        className="fixed left-0 right-0 w-full max-w-[480px] mx-auto z-30 px-4 flex justify-center"
        style={{
          bottom: `calc(${bottomNavHeight}px + env(safe-area-inset-bottom, 0px) + ${ctaBottomMargin}px)`,
        }}
      >
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={(isReady && !log.isWorkoutReady) || (isInProgress && !(log.allSetsChecked && log.allCardioChecked))}
          className="w-full max-w-[calc(480px-2rem)] py-4 rounded-2xl font-bold text-base transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
          style={{
            backgroundColor: "var(--accent-main)",
            color: "white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          }}
        >
          {isReady ? (
            <>
              <span>✅</span>
              <span>운동 준비 완료</span>
            </>
          ) : (
            <>
              <span>🏁</span>
              <span>운동 종료</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {showOverlay && !overlayExiting && (
          <motion.div
            key="workout-complete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="text-center px-8"
              onAnimationComplete={handleOverlayEnterComplete}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="font-bebas text-5xl md:text-6xl tracking-wider"
                style={{ color: "var(--accent-main)" }}
              >
                오운완 ✨
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-3 text-lg"
                style={{ color: "var(--text-sub)" }}
              >
                오늘도 해냈다
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mt-2 text-sm font-mono"
                style={{ color: "var(--text-sub)" }}
              >
                ⏱ {log.formatElapsed(log.completedElapsedSec)}
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="mt-6 text-4xl"
              >
                💪
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
