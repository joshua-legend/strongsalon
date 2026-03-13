"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { useGoal } from "@/context/GoalContext";
import ResetGoalConfirmModal from "./ResetGoalConfirmModal";

export default function GoalCompleteCard() {
  const { goalSetting, activeQuest, extendGoal, resetGoal } = useGoal();
  const [showResetModal, setShowResetModal] = useState(false);
  if (!goalSetting || !activeQuest) return null;
  const totalWeeks = activeQuest.history.length;
  const successCount = activeQuest.history.filter((r) => r.passed).length;
  const successRate =
    totalWeeks > 0 ? Math.round((successCount / totalWeeks) * 100) : 0;

  return (
    <div className="rounded-2xl p-8 bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
      <Trophy
        className="w-20 h-20 mx-auto mb-4 text-[var(--accent-main)]"
        style={{ filter: "drop-shadow(0 0 12px rgba(163,230,53,0.5))" }}
      />
      <h2 className="font-bebas text-3xl text-[var(--text-main)] tracking-wider mb-2">
        목표 달성을 축하합니다!
      </h2>
      <div className="space-y-1 text-sm text-[var(--text-sub)] mb-6">
        <div>소요 주수: {totalWeeks}주</div>
        <div>최장 연속 달성: {activeQuest.bestStreak}주</div>
        <div>성공률: {successRate}%</div>
      </div>
      <div className="space-y-3">
        <button
          onClick={extendGoal}
          className="w-full py-4 rounded-xl font-bold text-lg bg-[var(--accent-main)] text-[var(--accent-text)] hover:brightness-110 transition-all"
        >
          같은 목표 계속 연장하기
        </button>
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full py-4 rounded-xl font-bold text-lg bg-[var(--bg-card-hover)] text-[var(--text-main)] hover:bg-[var(--border-light)] transition-all border border-[var(--border-light)]"
        >
          새로운 목표 설정하기
        </button>
      </div>
      <ResetGoalConfirmModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetGoal}
      />
    </div>
  );
}
