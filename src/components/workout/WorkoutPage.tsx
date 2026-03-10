"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useWorkoutLog } from "./useWorkoutLog";
import WorkoutTopbar from "./WorkoutTopbar";
import DateBox from "./DateBox";
import CondBox from "./CondBox";
import FreeArea from "./FreeArea";
import CardioArea from "./CardioArea";

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const { exitWorkout } = useApp();
  const [showComplete, setShowComplete] = useState(false);

  const handleComplete = () => {
    log.completeWorkout();
    setShowComplete(true);
  };

  const handleOverlayEnterComplete = () => {
    setTimeout(() => setShowComplete(false), 1800);
  };

  const handleExitComplete = () => {
    exitWorkout();
  };

  return (
    <div
      className="min-h-full flex flex-col"
      style={{
        background: '#000',
      }}
    >
      <WorkoutTopbar elapsedSec={log.elapsedSec} />

      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col gap-3.5">
            <DateBox value={log.workoutDate} onChange={log.setWorkoutDate} />
            <CondBox value={log.condition} onChange={log.setCondition} />

            <FreeArea
              freeExercises={log.freeExercises}
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
            <CardioArea
              entries={log.cardioEntries}
              onUpdate={log.updateCardio}
              onRemove={log.removeCardio}
            />

            <button
              type="button"
              onClick={handleComplete}
              className="group relative w-full px-6 py-4 rounded-2xl font-black text-base uppercase italic -skew-x-12 text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_28px_rgba(163,230,53,.6)] active:scale-[0.97] mt-2 flex items-center justify-center"
              style={{
                background: '#a3e635',
                boxShadow: '0 0 20px rgba(163,230,53,.55), 0 0 40px rgba(163,230,53,.2)',
                textShadow: '0 1px 2px rgba(0,0,0,.2)',
              }}
            >
              <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-30" />
              <span className="skew-x-12 flex items-center gap-2">
                <span>🔥</span>
                <span>오늘도 끝냈다</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onAnimationComplete={handleOverlayEnterComplete}
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
