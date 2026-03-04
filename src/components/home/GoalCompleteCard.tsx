"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { useQuest } from "@/context/QuestContext";
import ResetGoalConfirmModal from "./ResetGoalConfirmModal";

export default function GoalCompleteCard() {
  const { userProfile, activeQuest, extendGoal, resetQuest } = useQuest();
  const [showResetModal, setShowResetModal] = useState(false);
  if (!userProfile || !activeQuest) return null;

  const { purpose } = userProfile;
  const totalWeeks = activeQuest.history.length;
  const successCount = activeQuest.history.filter((r) => r.passed).length;
  const successRate =
    totalWeeks > 0 ? Math.round((successCount / totalWeeks) * 100) : 0;

  return (
    <div className="rounded-2xl p-8 bg-neutral-900 border border-neutral-800 text-center">
      <Trophy
        className="w-20 h-20 mx-auto mb-4 text-lime-400"
        style={{ filter: "drop-shadow(0 0 12px rgba(163,230,53,0.5))" }}
      />
      <h2 className="font-bebas text-3xl text-white tracking-wider mb-2">
        목표 달성을 축하합니다!
      </h2>
      <div className="space-y-1 text-sm text-neutral-400 mb-6">
        <div>소요 주수: {totalWeeks}주</div>
        <div>최장 연속 달성: {activeQuest.bestStreak}주</div>
        <div>성공률: {successRate}%</div>
      </div>
      <div className="space-y-3">
        <button
          onClick={extendGoal}
          className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black hover:brightness-110 transition-all"
        >
          같은 목표 계속 연장하기
        </button>
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full py-4 rounded-xl font-bold text-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-all border border-neutral-700"
        >
          새로운 목표 설정하기
        </button>
      </div>
      <ResetGoalConfirmModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetQuest}
      />
    </div>
  );
}
