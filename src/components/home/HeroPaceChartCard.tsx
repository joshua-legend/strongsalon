"use client";

import { useQuest } from "@/context/QuestContext";
import PaceChart from "./PaceChart";

export default function HeroPaceChartCard() {
  const { userProfile, activeQuest } = useQuest();
  if (!userProfile || !activeQuest) return null;

  const { purpose } = userProfile;
  const { latestMetric, streak, history, currentWeek } = activeQuest;
  const prevFailed = history[history.length - 2]?.passed === false;
  const lastRecord = history[history.length - 1];
  const comeback = prevFailed && lastRecord?.passed;

  const progressPct =
    purpose.weeklyDelta < 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((userProfile.startValue - latestMetric) /
              (userProfile.startValue - userProfile.targetValue)) *
              100
          )
        )
      : Math.max(
          0,
          Math.min(
            100,
            ((latestMetric - userProfile.startValue) /
              (userProfile.targetValue - userProfile.startValue)) *
              100
          )
        );
  const remaining =
    purpose.weeklyDelta < 0
      ? latestMetric - userProfile.targetValue
      : userProfile.targetValue - latestMetric;

  const successCount = history.filter((r) => r.passed).length;
  const successRate =
    history.length > 0 ? Math.round((successCount / history.length) * 100) : 0;

  const remainingLabel: Record<string, string> = {
    cut: "남은 체중",
    bulk: "남은 근육량",
    strength: "남은 중량",
    endure: "남은 시간",
  };
  const remainingLabelText = remainingLabel[purpose.id] ?? "남은 거리";

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-lime-500 opacity-5 blur-3xl rounded-full" />
      <div className="relative z-10 p-5">
        {/* 상단: 배지만 */}
        <div className="flex justify-end gap-2 flex-wrap mb-3">
          {comeback && (
            <span className="px-2 py-1 rounded-lg bg-sky-400/20 text-sky-400 text-[10px] font-bold">
              복귀 성공!
            </span>
          )}
          {streak >= 2 && (
            <span className="px-2 py-1 rounded-lg bg-lime-400/20 text-lime-400 text-[10px] font-bold pulse-glow">
              {streak}주 연속!
            </span>
          )}
          <span className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-[10px] font-bold">
            W{currentWeek}
          </span>
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-4 mb-2 text-[9px] text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-lime-400 rounded" />
            실제기록
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-4 h-0.5 border-t border-dashed border-neutral-600"
              style={{ borderTopWidth: 1 }}
            />
            이상페이스
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-lime-400/70 rounded" />
            목표선
          </span>
        </div>

        {/* PaceChart */}
        <PaceChart
          startValue={userProfile.startValue}
          targetValue={userProfile.targetValue}
          weeklyDelta={purpose.weeklyDelta}
          history={history}
          currentWeek={currentWeek}
          latestMetric={latestMetric}
          unit={purpose.unit}
        />

        {/* 하단 스탯 바: 진행률 / 남은 거리 / 성공률 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-neutral-950/80 rounded-2xl p-3 text-center">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">
              진행률
            </div>
            <div className="font-bebas text-lg text-lime-400">
              {Math.round(progressPct)}%
            </div>
          </div>
          <div className="bg-neutral-950/80 rounded-2xl p-3 text-center">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">
              {remainingLabelText}
            </div>
            <div className="font-bebas text-lg text-white">
              {Math.abs(remaining).toFixed(1)}
              {purpose.unit}
            </div>
          </div>
          <div className="bg-neutral-950/80 rounded-2xl p-3 text-center">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">
              성공률
            </div>
            <div className="font-bebas text-lg text-white">
              {successRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
