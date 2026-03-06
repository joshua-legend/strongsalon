"use client";

import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useWorkout } from "@/context/WorkoutContext";
import { useToast } from "@/components/ui/Toast";
import type { DayPlan, ExerciseLog } from "@/types";
import PrescribedExerciseCard from "./PrescribedExerciseCard";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_TYPE_LABELS: Record<string, string> = {
  upperPush: "상체 푸쉬",
  upperPull: "상체 풀",
  upperFull: "상체 전체",
  lowerCompound: "하체",
  lowerIsolation: "하체 (단일)",
  fullBody: "전신",
};

interface TodayWorkoutProps {
  plan: DayPlan;
}

export default function TodayWorkout({ plan }: TodayWorkoutProps) {
  const { exitWorkout } = useApp();
  const { recordWorkoutComplete } = useWorkout();
  const { showToast } = useToast();
  const [completedSetsMap, setCompletedSetsMap] = useState<Record<string, number>>({});
  const [actualWeightMap, setActualWeightMap] = useState<Record<string, number>>({});

  const today = new Date();
  const dayName = DAY_NAMES[today.getDay()];
  const dayTypeLabel = DAY_TYPE_LABELS[plan.dayType] ?? plan.dayType;

  const totalTargetSets = plan.exercises.reduce((s, e) => s + e.targetSets, 0);
  const totalCompletedSets = plan.exercises.reduce(
    (s, e) => s + (completedSetsMap[e.equipmentId] ?? 0),
    0
  );
  const allComplete = totalCompletedSets >= totalTargetSets;

  const handleCompletedSetsChange = useCallback((equipmentId: string, completedSets: number) => {
    setCompletedSetsMap((prev) => ({ ...prev, [equipmentId]: completedSets }));
  }, []);

  const handleActualWeightChange = useCallback((equipmentId: string, weight: number) => {
    setActualWeightMap((prev) => ({ ...prev, [equipmentId]: weight }));
  }, []);

  const handleComplete = () => {
    if (totalCompletedSets === 0) {
      if (!confirm("아직 운동 기록이 없습니다. 그래도 완료하시겠어요?")) return;
    }
    const dateStr = today.toISOString().split("T")[0];
    const exercises: ExerciseLog[] = plan.exercises.map((e) => ({
      equipmentId: e.equipmentId,
      targetWeight: e.targetWeight,
      actualWeight: actualWeightMap[e.equipmentId] ?? e.targetWeight,
      targetReps: e.targetReps,
      targetSets: e.targetSets,
      completedSets: completedSetsMap[e.equipmentId] ?? 0,
    }));
    recordWorkoutComplete(dateStr, exercises, plan.dayType, plan.dayLabel);
    showToast("✓ 오늘 운동이 반영되었습니다");
    exitWorkout();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h1 className="font-bebas text-2xl text-white">오늘의 운동</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {plan.dayLabel} — {dayTypeLabel} · {dayName}요일
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {plan.exercises.map((ex) => (
          <PrescribedExerciseCard
            key={ex.equipmentId}
            exercise={ex}
            completedSets={completedSetsMap[ex.equipmentId] ?? 0}
            actualWeight={actualWeightMap[ex.equipmentId]}
            onCompletedSetsChange={(n) => handleCompletedSetsChange(ex.equipmentId, n)}
            onActualWeightChange={(w) => handleActualWeightChange(ex.equipmentId, w)}
          />
        ))}
      </div>

      <p className="font-mono text-sm text-neutral-500 text-center">
        전체 진행: {totalCompletedSets} / {totalTargetSets} 세트
      </p>

      <button
        type="button"
        onClick={handleComplete}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
          allComplete
            ? "bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,.5)]"
            : totalCompletedSets > 0
              ? "bg-neutral-100 text-neutral-900"
              : "bg-neutral-800 text-neutral-600"
        }`}
      >
        {allComplete ? "오늘 운동 완료 ✓" : totalCompletedSets > 0 ? `오늘 운동 완료 (${totalCompletedSets}/${totalTargetSets} 세트)` : "오늘 운동 완료"}
      </button>
    </div>
  );
}
