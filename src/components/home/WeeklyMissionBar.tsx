"use client";

import { useWorkout } from "@/context/WorkoutContext";
import { useQuest } from "@/context/QuestContext";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeeklyMissionBar() {
  const { weeklyProgress } = useWorkout();
  const { userProfile } = useQuest();

  if (!userProfile || !weeklyProgress) return null;

  const trainingDays = userProfile.trainingDays ?? [1, 3, 5];
  const today = new Date();
  const currentDow = today.getDay();
  const completedDays = weeklyProgress.completedDays;
  const totalTargetSets = weeklyProgress.totalTargetSets;
  const totalCompletedSets = weeklyProgress.totalCompletedSets;
  const setRate =
    totalTargetSets > 0 ? totalCompletedSets / totalTargetSets : 0;
  const dayCount = completedDays.length;
  const totalDays = trainingDays.length;

  return (
    <div className="mb-4">
      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
        —— 이번 주 운동 ——
      </div>
      <div className="flex items-center gap-2 mb-2">
        {trainingDays.map((dow) => {
          const completed = completedDays.includes(dow);
          const isToday = dow === currentDow;
          const isFuture =
            dow > currentDow ||
            (dow < currentDow && !completed && !isToday);
          return (
            <div
              key={dow}
              className={`flex flex-col items-center gap-0.5 ${
                completed
                  ? "text-lime-400"
                  : isToday
                    ? "text-lime-400"
                    : "text-neutral-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                  completed
                    ? "bg-lime-400 text-black"
                    : isToday
                      ? "border-2 border-lime-400 bg-transparent animate-pulse"
                      : "bg-neutral-700 text-neutral-500"
                }`}
              >
                {completed ? "●" : "○"}
              </div>
              <span className="text-[9px] font-mono">{DAY_NAMES[dow]}</span>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-[10px] text-neutral-500 mb-1.5">
        {dayCount}/{totalDays}일 완료
      </p>
      <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-lime-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, setRate * 100)}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-neutral-500 mt-1">
        {Math.round(setRate * 100)}%
      </p>
    </div>
  );
}
