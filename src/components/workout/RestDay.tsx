"use client";

import { useWorkout } from "@/context/WorkoutContext";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_TYPE_LABELS: Record<string, string> = {
  upperPush: "상체 푸쉬",
  upperPull: "상체 풀",
  upperFull: "상체 전체",
  lowerCompound: "하체",
  lowerIsolation: "하체 (단일)",
  fullBody: "전신",
};

export default function RestDay() {
  const { weeklyPlan, weeklyProgress } = useWorkout();
  const today = new Date();
  const currentDow = today.getDay();
  const trainingDays = [1, 3, 5];

  const nextDay = trainingDays
    .sort((a, b) => a - b)
    .find((d) => d > currentDow) ?? trainingDays[0];
  const nextPlan = weeklyPlan?.days.find((d) => d.dayOfWeek === nextDay);
  const nextDayName = DAY_NAMES[nextDay];

  const completedCount = weeklyProgress?.completedDays.length ?? 0;
  const totalCount = trainingDays.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <p className="font-bebas text-3xl text-white text-center">
        오늘은 쉬는 날
      </p>
      <span className="text-4xl">🌙</span>
      {nextPlan && (
        <p className="text-sm text-neutral-400 text-center">
          다음 운동: {nextDayName}요일 — {nextPlan.dayLabel} {DAY_TYPE_LABELS[nextPlan.dayType] ?? nextPlan.dayType}
        </p>
      )}
      {weeklyProgress && totalCount > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {trainingDays.map((dow) => {
              const completed = weeklyProgress.completedDays.includes(dow);
              const isToday = dow === currentDow;
              return (
                <div
                  key={dow}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    completed
                      ? "bg-lime-400 text-black"
                      : isToday
                        ? "border-2 border-lime-400 text-lime-400"
                        : "bg-neutral-700 text-neutral-500"
                  }`}
                >
                  {completed ? "●" : "○"}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-neutral-500 font-mono">
            {completedCount}/{totalCount}일 완료
          </p>
        </div>
      )}
    </div>
  );
}
