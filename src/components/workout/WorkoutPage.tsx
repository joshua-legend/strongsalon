"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useWorkoutLog } from "./useWorkoutLog";
import DateBox from "./DateBox";
import CondBox from "./CondBox";
import FreeArea from "./FreeArea";

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const { exitWorkout } = useApp();
  const [overlayExiting, setOverlayExiting] = useState(false);

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

  return (
    <div
      className="min-h-full flex flex-col"
      style={{
        background: "#000",
      }}
    >
      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col gap-3.5">
            <DateBox value={log.workoutDate} onChange={log.setWorkoutDate} />
            <CondBox value={log.condition} onChange={log.setCondition} />
            <FreeArea
              freeExercises={log.freeExercises}
              orderedIds={log.orderedIds}
              cardioEntries={log.cardioEntries}
              onUpdateCardio={log.updateCardio}
              onRemoveCardio={log.removeCardio}
              prData={log.prData}
              selectedFavNames={log.selectedFavNames}
              onToggleFav={log.toggleFav}
              onAddCardio={log.addCardio}
              onAddSet={(id) => log.addFreeSet(id)}
              onCopyLastSet={log.copyLastFreeSet}
              onDeleteSet={log.delFreeSet}
              onSetChange={log.onFSetChange}
              onRemove={log.removeFreeEx}
              onCheckPR={log.showPR}
            />
            <div className="mt-2 flex items-stretch gap-3">
              {isInProgress && (
                <div
                  className="flex shrink-0 items-center justify-center gap-2 rounded-2xl px-5 border"
                  style={{
                    background: "rgba(0,0,0,.8)",
                    borderColor: "rgba(163,230,53,.5)",
                    boxShadow: "0 0 12px rgba(163,230,53,.25)",
                    minWidth: 100,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                    style={{
                      background: "rgb(163, 230, 53)",
                      boxShadow: "0 0 6px rgba(163,230,53,.5)",
                    }}
                  />
                  <span
                    className="font-bebas text-xl tracking-wider"
                    style={{
                      color: "rgb(163, 230, 53)",
                      textShadow: "0 0 8px rgba(163,230,53,.5)",
                    }}
                  >
                    {String(Math.floor(log.elapsedSec / 60)).padStart(2, "0")}:
                    {String(log.elapsedSec % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={handleButtonClick}
                disabled={isReady && !log.isWorkoutReady}
                className="group relative flex-1 px-6 py-4 rounded-2xl font-black text-base uppercase italic -skew-x-12 text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_28px_rgba(163,230,53,.6)] active:scale-[0.97] flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
                style={{
                  background: isInProgress ? "#f97316" : "#a3e635",
                  boxShadow: isInProgress
                    ? "0 0 20px rgba(249,115,22,.55), 0 0 40px rgba(249,115,22,.2)"
                    : "0 0 20px rgba(163,230,53,.55), 0 0 40px rgba(163,230,53,.2)",
                  textShadow: "0 1px 2px rgba(0,0,0,.2)",
                }}
              >
                <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-30" />
                <span className="skew-x-12 flex items-center gap-2">
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
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {showOverlay && !overlayExiting && (
          <motion.div
            key="workout-complete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
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
                className="font-bebas text-5xl md:text-6xl text-lime-400 tracking-wider"
                style={{ textShadow: "0 0 30px rgba(163,230,53,.6)" }}
              >
                오운완 ✨
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-3 text-lg text-neutral-400"
              >
                오늘도 해냈다
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mt-2 text-sm text-neutral-500 font-mono"
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
