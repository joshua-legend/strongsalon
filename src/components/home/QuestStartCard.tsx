"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useGoal } from "@/context/GoalContext";
import { goalOptions } from "@/config/goalOptions";
import ResetGoalConfirmModal from "./ResetGoalConfirmModal";

export default function QuestStartCard() {
  const { goalSetting, setActiveQuest, resetGoal } = useGoal();
  const [showResetModal, setShowResetModal] = useState(false);
  if (!goalSetting) return null;

  const opt = goalOptions.find((o) => o.id === goalSetting.goalId);
  const Icon = opt?.icon ?? (() => null);
  const { target } = goalSetting;
  const unit = goalSetting.mainMetric === "fatPercent" ? "%" : "kg";
  const weeklyLabel =
    target.weeklyDelta < 0
      ? `매주 ${Math.abs(target.weeklyDelta)}${unit} 감소`
      : `매주 ${target.weeklyDelta}${unit} 증가`;

  const handleStart = () => {
    setActiveQuest({
      currentWeek: 1,
      latestMetric: target.startValue,
      history: [],
      streak: 0,
      bestStreak: 0,
    });
  };

  return (
    <div className="rounded-2xl p-5 bg-neutral-900 border border-neutral-800 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-500 opacity-10 blur-3xl rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-lime-400" />
          <span className="font-bebas text-lg text-white tracking-wider">
            {opt?.label ?? "목표"}
          </span>
        </div>
        <div className="space-y-1 text-sm text-neutral-400 mb-4">
          <div>
            시작: <span className="font-mono text-lime-400">{target.startValue}{unit}</span>
          </div>
          <div>
            목표: <span className="font-mono text-lime-400">{target.targetValue}{unit}</span>
          </div>
          <div className="text-xs">{weeklyLabel}</div>
        </div>
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black hover:brightness-110 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
        >
          첫 주차 미션 시작
        </button>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-neutral-600 text-neutral-400 hover:border-lime-400/50 hover:text-lime-400 hover:bg-lime-400/5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          목표 다시 설정하기
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
