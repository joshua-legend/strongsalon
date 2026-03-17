"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, Dumbbell } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useGoal } from "@/context/GoalContext";
import { useWorkoutLog } from "./useWorkoutLog";
import NeedStrengthModal from "./NeedStrengthModal";
import FreeArea from "./FreeArea";
import TimeSelectCard from "./TimeSelectCard";
import ConditionSelectCard from "./ConditionSelectCard";
import { getMockRecommendation } from "@/data/workoutRecommendation";

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const {
    exitWorkout,
    setSelectedSplit,
    setTab,
    setOpenRecommendationSetup,
    setOpenStrengthSetup,
  } = useApp();
  const { categorySettings } = useGoal();
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [mode, setMode] = useState<"recommended" | "free">("free");
  const [showNeedStrengthModal, setShowNeedStrengthModal] = useState(false);

  const [recommendationReason, setRecommendationReason] = useState<
    string | null
  >(null);

  const strength = categorySettings?.strength;
  const inbody = categorySettings?.inbody;
  const fitness = categorySettings?.fitness;
  const hasStrength =
    strength?.isConfigured &&
    strength?.startValues &&
    (strength.startValues.squat ?? 0) > 0 &&
    (strength.startValues.bench ?? 0) > 0 &&
    (strength.startValues.deadlift ?? 0) > 0;
  const hasInbody =
    inbody?.isConfigured &&
    inbody?.startValues &&
    (inbody.startValues.weight ?? 0) > 0 &&
    (inbody.startValues.fatPercent ?? 0) >= 5 &&
    (inbody.startValues.muscleMass ?? 0) >= 10;
  const hasFitness =
    fitness?.isConfigured &&
    fitness?.startValues &&
    ((fitness.startValues.running ?? 0) > 0 ||
      (fitness.startValues.rowing ?? 0) > 0 ||
      (fitness.startValues.skierg ?? 0) > 0);
  const hasAllRecommendationData = hasStrength && hasInbody && hasFitness;
  const has1RM =
    strength?.startValues &&
    (strength.startValues.squat ?? 0) +
      (strength.startValues.bench ?? 0) +
      (strength.startValues.deadlift ?? 0) >
      0;

  const handleModeSelect = (m: "recommended" | "free") => {
    if (m === mode) return;
    if (m === "recommended" && !hasAllRecommendationData) {
      setShowNeedStrengthModal(true);
      return;
    }
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

  const handleGoToStrengthSetup = () => {
    setShowNeedStrengthModal(false);
    setTab("home");
    setOpenRecommendationSetup(true);
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
            {/* 모드 선택: 추천 / 자유 (Segmented Control) */}
            <div
              className="relative flex gap-2 rounded-2xl p-1 border shadow-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-light)",
              }}
            >
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
                <Hand
                  className="w-4 h-4 shrink-0"
                  strokeWidth={2}
                  style={{ color: "inherit" }}
                />
                <span>자유</span>
              </button>
            </div>

            {/* 자유 모드 시: 운동 시간 / 컨디션 선택 카드 */}
            <AnimatePresence mode="wait">
              {mode === "free" && (
                <motion.section
                  key="time-condition"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-3 relative z-20 items-stretch"
                  style={{ overflow: "visible" }}
                >
                  <TimeSelectCard
                    value={log.estMinutes}
                    onChange={log.setEstMinutes}
                  />
                  <ConditionSelectCard
                    value={log.condition}
                    onChange={log.setCondition}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            {/* 자유 모드 시: 1RM 미설정 시에만 안내 표시 */}
            {mode === "free" && !has1RM && (
              <div
                className="rounded-xl px-4 py-3 border flex items-start gap-3"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-light)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--bg-body)",
                    color: "var(--accent-main)",
                  }}
                >
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-main)" }}>
                    홈에서 3대 운동(스쿼트·벤치·데드) 1RM을 설정하면
                    <br />
                    운동 시 권장 무게가 자동으로 채워져요
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("home");
                      setOpenStrengthSetup(true);
                    }}
                    className="mt-2 text-[11px] font-semibold transition-opacity hover:opacity-80"
                    style={{ color: "var(--accent-main)" }}
                  >
                    1RM 설정하러 가기 →
                  </button>
                </div>
              </div>
            )}

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
                    style={{
                      backgroundColor: "var(--accent-bg)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <p
                      className="text-[12px] transition-colors duration-300"
                      style={{ color: "var(--accent-main)" }}
                    >
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
        className="fixed left-0 right-0 w-full max-w-[480px] mx-auto z-30 px-4 flex items-center justify-center gap-3"
        style={{
          bottom: `calc(${bottomNavHeight}px + env(safe-area-inset-bottom, 0px) + ${ctaBottomMargin}px)`,
        }}
      >
        {isInProgress && (
          <div
            className="flex items-center gap-3 shrink-0 rounded-xl border px-4 py-2.5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-bebas text-xl tracking-wider" style={{ color: "var(--accent-main)" }}>
                {String(Math.floor(log.elapsedSec / 60)).padStart(2, "0")}:
                {String(log.elapsedSec % 60).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bebas tracking-wider" style={{ color: "var(--text-sub)" }}>
                경과
              </span>
            </div>
            <span className="text-neutral-500">|</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bebas text-lg tracking-wider" style={{ color: "var(--text-main)" }}>
                목표 {log.estMinutes}분
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={
            (isReady && !log.isWorkoutReady) ||
            (isInProgress && !(log.allSetsChecked && log.allCardioChecked))
          }
          className={`py-4 rounded-2xl font-bold text-base transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100 ${
            isInProgress ? "flex-1 min-w-0" : "w-full max-w-[calc(480px-2rem)]"
          }`}
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

      <NeedStrengthModal
        open={showNeedStrengthModal}
        onClose={() => setShowNeedStrengthModal(false)}
        onGoToHome={handleGoToStrengthSetup}
      />

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
