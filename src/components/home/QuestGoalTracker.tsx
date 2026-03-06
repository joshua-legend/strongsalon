"use client";

import { useState } from "react";
import { useQuest } from "@/context/QuestContext";
import UnifiedGoalCard from "./UnifiedGoalCard";
import ResetGoalConfirmModal from "./ResetGoalConfirmModal";

export default function QuestGoalTracker() {
  const { activeQuest, resetQuest } = useQuest();
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="space-y-4">
      {activeQuest && <UnifiedGoalCard />}
      <button
        type="button"
        onClick={() => setShowResetModal(true)}
        className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-400 transition-colors"
      >
        목표 다시 설정하기
      </button>
      <ResetGoalConfirmModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetQuest}
      />
    </div>
  );
}
