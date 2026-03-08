"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
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
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-neutral-600 text-neutral-400 hover:border-lime-400/50 hover:text-lime-400 hover:bg-lime-400/5 transition-all"
      >
        <RotateCcw className="w-4 h-4" />
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
