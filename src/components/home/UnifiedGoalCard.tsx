"use client";

import { useState } from "react";
import { useQuest } from "@/context/QuestContext";
import { useInbody } from "@/context/InbodyContext";
import PaceChart from "./PaceChart";
import {
  getInbodyChartData,
  getStrengthChartData,
  getCardioChartData,
} from "@/utils/goalChartData";

type MainTabId = "inbody" | "strength" | "cardio";

const MAIN_TABS: { id: MainTabId; label: string }[] = [
  { id: "inbody", label: "인바디" },
  { id: "strength", label: "스트렝스" },
  { id: "cardio", label: "체력" },
];

function getMainTabFromPurpose(purposeId: string): MainTabId {
  if (purposeId === "cut" || purposeId === "bulk") return "inbody";
  if (purposeId === "strength") return "strength";
  if (purposeId === "endure") return "cardio";
  return "inbody";
}

export default function UnifiedGoalCard() {
  const { userProfile, activeQuest } = useQuest();
  const { inbodyHistory } = useInbody();

  const defaultMainTab = userProfile?.purpose
    ? getMainTabFromPurpose(userProfile.purpose.id)
    : "inbody";

  const [mainTab, setMainTab] = useState<MainTabId>(defaultMainTab);

  if (!userProfile || !activeQuest) return null;

  const { purpose } = userProfile;
  const { latestMetric, streak, history, currentWeek } = activeQuest;
  const prevFailed = history[history.length - 2]?.passed === false;
  const lastRecord = history[history.length - 1];
  const comeback = prevFailed && lastRecord?.passed;

  const chartData = (() => {
    if (mainTab === "inbody") {
      return getInbodyChartData(
        inbodyHistory,
        userProfile,
        purpose.id === "cut" ? history : undefined
      );
    }
    if (mainTab === "strength") return getStrengthChartData();
    return getCardioChartData();
  })();

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

  const displayStats = chartData
    ? {
        progressPct:
          chartData.weeklyDelta < 0
            ? Math.max(
                0,
                Math.min(
                  100,
                  ((chartData.startValue - chartData.latestMetric) /
                    (chartData.startValue - chartData.targetValue)) *
                    100
                )
              )
            : Math.max(
                0,
                Math.min(
                  100,
                  ((chartData.latestMetric - chartData.startValue) /
                    (chartData.targetValue - chartData.startValue)) *
                    100
                )
              ),
        remaining:
          chartData.weeklyDelta < 0
            ? chartData.latestMetric - chartData.targetValue
            : chartData.targetValue - chartData.latestMetric,
        successRate:
          chartData.history.length > 0
            ? Math.round(
                (chartData.history.filter((r) => r.passed).length /
                  chartData.history.length) *
                  100
              )
            : 0,
      }
    : null;

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-lime-500 opacity-5 blur-3xl rounded-full" />
      <div className="relative z-10 p-5 space-y-4">
        {/* 1. 상단: 골 트래커 요약 */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bebas text-lg text-lime-400">
              {Math.round(displayStats?.progressPct ?? progressPct)}%
            </span>
            <span className="text-[10px] text-neutral-500">진행</span>
          </div>
          <div className="flex items-center gap-1.5">
            {comeback && (
              <span className="px-2 py-0.5 rounded-lg bg-sky-400/20 text-sky-400 text-[10px] font-bold">
                복귀!
              </span>
            )}
            {streak >= 2 && (
              <span className="px-2 py-0.5 rounded-lg bg-lime-400/20 text-lime-400 text-[10px] font-bold">
                {streak}주 연속
              </span>
            )}
            <span className="px-2 py-0.5 rounded-lg bg-neutral-800 text-neutral-400 text-[10px] font-bold">
              W{currentWeek}
            </span>
          </div>
        </div>

        {/* 2. 메인 탭: 인바디 | 스트렝스 | 체력 */}
        <div className="rounded-full p-1 bg-neutral-900/80 border border-neutral-800 flex">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMainTab(tab.id)}
              className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                mainTab === tab.id ? "bg-neutral-800 text-white" : "text-neutral-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. 탭별 단일 PaceChart */}
        <div className="pt-2">
          <div className="mb-2">
            <div className="flex items-center gap-4 text-[10px] text-neutral-400">
              <span className="flex items-center gap-1">
                <span className="w-5 h-0.5 bg-lime-400 rounded" />
                실제기록
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-5 h-0.5 border-t border-dashed border-lime-400/50"
                  style={{ borderTopWidth: 1.5 }}
                />
                이상페이스
              </span>
            </div>
          </div>

          {chartData ? (
            <PaceChart
              startValue={chartData.startValue}
              targetValue={chartData.targetValue}
              weeklyDelta={chartData.weeklyDelta}
              history={chartData.history}
              currentWeek={chartData.currentWeek}
              latestMetric={chartData.latestMetric}
              unit={chartData.unit}
            />
          ) : (
            <div className="py-12 text-center text-xs text-neutral-600">
              인바디 기록이 2개 이상 필요합니다
            </div>
          )}
        </div>

        {/* 4. 3칸 스탯 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-950/80 rounded-2xl p-3 text-center">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">
              진행률
            </div>
            <div className="font-bebas text-lg text-lime-400">
              {Math.round(displayStats?.progressPct ?? progressPct)}%
            </div>
          </div>
          <div className="bg-neutral-950/80 rounded-2xl p-3 text-center">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">
              {mainTab === "inbody"
                ? "남은 체중"
                : mainTab === "strength"
                  ? "남은 중량"
                  : "남은 시간"}
            </div>
            <div className="font-bebas text-lg text-white">
              {chartData
                ? Math.abs(displayStats?.remaining ?? 0).toFixed(1) + chartData.unit
                : Math.abs(remaining).toFixed(1) + purpose.unit}
            </div>
          </div>
          <div className="bg-neutral-950/80 rounded-2xl p-3 text-center">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">
              성공률
            </div>
            <div className="font-bebas text-lg text-white">
              {(displayStats?.successRate ?? successRate)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
