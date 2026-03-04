"use client";

import { useState } from "react";
import { useQuest } from "@/context/QuestContext";
import HeroPaceChartCard from "./HeroPaceChartCard";
import CheckInCard from "./CheckInCard";
import WeeklyLog from "./WeeklyLog";
import ResetGoalConfirmModal from "./ResetGoalConfirmModal";

export default function QuestGoalTracker() {
  const { resetQuest } = useQuest();
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="space-y-4">
      <HeroPaceChartCard />
      <CheckInCard />
      <div>
        <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
          주간 기록
        </div>
        <WeeklyLog />
      </div>
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
