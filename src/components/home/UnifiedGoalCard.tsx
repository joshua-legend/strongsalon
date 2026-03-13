"use client";

import { useState, useEffect } from "react";
import { useGoal } from "@/context/GoalContext";
import { useInbody } from "@/context/InbodyContext";
import type { CategoryId } from "@/types/categorySettings";
import PaceChart from "./PaceChart";
import InbodyPaceChart from "./InbodyPaceChart";
import CategoryNotConfigured from "./CategoryNotConfigured";
import CategorySetupSheet from "./CategorySetupSheet";
import CycleCompleteCard from "./CycleCompleteCard";
import CategoryResetConfirmModal from "./CategoryResetConfirmModal";
import InbodyRecordInputPopover from "./InbodyRecordInputPopover";
import { useChartData } from "@/context/ChartDataContext";
import {
  getInbodyChartData,
  goalSettingToInbodyGoal,
  categorySettingToInbodyGoal,
  getStrengthChartData,
  getCardioChartData,
  INBODY_SUB_TABS,
  type StrengthChartOption,
  type CardioChartOption,
  type InbodyChartOption,
  type GoalChartData,
  type InbodyMultiLineChartData,
} from "@/utils/goalChartData";

type MainTabId = "inbody" | "strength" | "cardio";

const MAIN_TABS: { id: MainTabId; label: string }[] = [
  { id: "inbody", label: "인바디" },
  { id: "strength", label: "스트렝스" },
  { id: "cardio", label: "체력" },
];

function mainTabToCategoryId(tab: MainTabId): CategoryId {
  if (tab === "inbody") return "inbody";
  if (tab === "strength") return "strength";
  return "fitness";
}

/** 통일 색상: 1번=초록, 2번=주황, 3번=파랑 */
const UNIFIED_COLORS = { lime: "#a3e635", orange: "#f97316", sky: "#38bdf8" } as const;

const STRENGTH_SUB_TABS: { id: StrengthChartOption; label: string; color: "lime" | "orange" | "sky" }[] = [
  { id: "squat", label: "스쿼트", color: "lime" },
  { id: "bench", label: "벤치프레스", color: "orange" },
  { id: "deadlift", label: "데드리프트", color: "sky" },
];

const CARDIO_SUB_TABS: { id: CardioChartOption; label: string; color: "lime" | "orange" | "sky" }[] = [
  { id: "run5k", label: "런닝", color: "lime" },
  { id: "row2k", label: "로잉", color: "orange" },
  { id: "skierg", label: "스키에르그", color: "sky" },
];

const STRENGTH_LINE_COLORS: Record<StrengthChartOption, string> = {
  squat: UNIFIED_COLORS.lime,
  bench: UNIFIED_COLORS.orange,
  deadlift: UNIFIED_COLORS.sky,
};

const CARDIO_LINE_COLORS: Record<CardioChartOption, string> = {
  run5k: UNIFIED_COLORS.lime,
  row2k: UNIFIED_COLORS.orange,
  skierg: UNIFIED_COLORS.sky,
};

const INBODY_SUB_TABS_WITH_COLOR = INBODY_SUB_TABS.map((t) => ({
  ...t,
  color: (t.id === "fatPercent" ? "lime" : t.id === "muscleMass" ? "orange" : "sky") as "lime" | "orange" | "sky",
}));

const INBODY_LINE_COLORS: Record<InbodyChartOption, string> = {
  fatPercent: UNIFIED_COLORS.lime,
  muscleMass: UNIFIED_COLORS.orange,
  weight: UNIFIED_COLORS.sky,
};

function getMainTabFromGoalId(goalId: string): MainTabId {
  if (goalId === "diet") return "inbody";
  if (goalId === "strength") return "strength";
  if (goalId === "fitness") return "cardio";
  return "inbody";
}

export default function UnifiedGoalCard() {
  const {
    goalSetting,
    activeQuest,
    categorySettings,
    primaryGoal,
    extendCategory,
    resetCategory,
  } = useGoal();
  const { inbodyHistory } = useInbody();
  const { getChartPoints } = useChartData();
  const [showSetupSheet, setShowSetupSheet] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [chartDataVersion, setChartDataVersion] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handler = () => setChartDataVersion((v) => v + 1);
    window.addEventListener("chartRefresh", handler);
    return () => window.removeEventListener("chartRefresh", handler);
  }, []);

  const defaultMainTab: MainTabId = goalSetting
    ? getMainTabFromGoalId(goalSetting.goalId)
    : "inbody";

  const [mainTab, setMainTab] = useState<MainTabId>(defaultMainTab);
  const [subTab, setSubTab] = useState<
    StrengthChartOption | CardioChartOption | InbodyChartOption
  >(defaultMainTab === "inbody" ? "fatPercent" : defaultMainTab === "strength" ? "squat" : "run5k");

  const categoryId = mainTabToCategoryId(mainTab);
  const catSetting = categorySettings[categoryId];
  const isConfigured =
    mainTab === "inbody"
      ? !!(catSetting?.startValues && Object.keys(catSetting.startValues).some((k) => (catSetting.startValues![k] ?? 0) > 0)) ||
        !!(catSetting?.autoPaces && Object.keys(catSetting.autoPaces).length > 0)
      : (catSetting?.isConfigured ?? false);

  const isMetricConfigured = (() => {
    if (mainTab === "inbody") {
      const m = subTab as InbodyChartOption;
      return !!(catSetting?.autoPaces?.[m] ?? (catSetting?.startValues?.[m] != null && (catSetting.startValues[m] ?? 0) > 0));
    }
    if (mainTab === "strength") {
      const m = subTab as StrengthChartOption;
      return !!(catSetting?.autoPaces?.[m] ?? (catSetting?.startValues?.[m] != null && catSetting.startValues[m] > 0));
    }
    if (mainTab === "cardio") {
      const m = subTab as CardioChartOption;
      const key = m === "run5k" ? "running" : m === "row2k" ? "rowing" : "skierg";
      return !!(catSetting?.autoPaces?.[key] ?? (catSetting?.startValues?.[key] != null && (catSetting.startValues[key] ?? 0) > 0));
    }
    return false;
  })();

  const today = new Date().toISOString().slice(0, 10);
  const isCycleComplete =
    isConfigured &&
    catSetting?.cycleEndDate != null &&
    catSetting.cycleEndDate <= today;

  const target = goalSetting?.target;
  const latestMetric = activeQuest?.latestMetric;
  const streak = activeQuest?.streak ?? 0;
  const history = activeQuest?.history ?? [];
  const currentWeek = activeQuest?.currentWeek ?? 1;
  const prevFailed = history[history.length - 2]?.passed === false;
  const lastRecord = history[history.length - 1];
  const comeback = prevFailed && lastRecord?.passed;

  const strengthMetricKey =
    mainTab === "strength"
      ? (`strength.${subTab}` as "strength.squat" | "strength.bench" | "strength.deadlift")
      : null;
  const inbodyMetricKey =
    mainTab === "inbody"
      ? (`inbody.${subTab}` as "inbody.fatPercent" | "inbody.muscleMass" | "inbody.weight")
      : null;
  const cardioMetricKey =
    mainTab === "cardio"
      ? (subTab === "run5k"
          ? "fitness.running"
          : subTab === "row2k"
            ? "fitness.rowing"
            : "fitness.skierg")
      : null;

  const chartData = (() => {
    if (mainTab === "inbody") {
      const configuredAt = catSetting?.configuredAt ?? null;
      const dataPoints =
        inbodyMetricKey && configuredAt
          ? getChartPoints(inbodyMetricKey, configuredAt)
          : undefined;
      return getInbodyChartData(
        inbodyHistory,
        goalSetting?.category === "inbody" ? goalSetting : null,
        goalSetting?.goalId === "diet" ? history : undefined,
        subTab as InbodyChartOption,
        catSetting,
        dataPoints && dataPoints.length > 0 ? dataPoints : undefined
      );
    }
    if (mainTab === "strength") {
      const configuredAt = catSetting?.configuredAt ?? null;
      const dataPoints = strengthMetricKey ? getChartPoints(strengthMetricKey, configuredAt) : undefined;
      return getStrengthChartData(subTab as StrengthChartOption, {
        categorySetting: isMetricConfigured ? catSetting : undefined,
        dataPoints: dataPoints && dataPoints.length > 0 ? dataPoints : undefined,
      });
    }
    if (mainTab === "cardio") {
      const configuredAt = catSetting?.configuredAt ?? null;
      const dataPoints = cardioMetricKey ? getChartPoints(cardioMetricKey, configuredAt) : undefined;
      return getCardioChartData(subTab as CardioChartOption, {
        categorySetting: isMetricConfigured ? catSetting : undefined,
        dataPoints: dataPoints && dataPoints.length > 0 ? dataPoints : undefined,
      });
    }
    return null;
  })();

  const unit = goalSetting?.mainMetric === "fatPercent" ? "%" : "kg";

  const isInbodyMultiLine = false;

  const progressPct = target
    ? (target.weeklyDelta < 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((target.startValue - (latestMetric ?? target.startValue)) /
              (target.startValue - target.targetValue)) *
              100
          )
        )
      : Math.max(
          0,
          Math.min(
            100,
            (((latestMetric ?? target.startValue) - target.startValue) /
              (target.targetValue - target.startValue)) *
              100
          )
        ))
    : 0;
  const remaining = target
    ? (target.weeklyDelta < 0
      ? (latestMetric ?? 0) - target.targetValue
      : target.targetValue - (latestMetric ?? 0))
    : 0;

  const successCount = history.filter((r) => r.passed).length;
  const successRate =
    history.length > 0 ? Math.round((successCount / history.length) * 100) : 0;

  const statsSource = (chartData as { startValue?: number; targetValue?: number; latestMetric?: number; weeklyDelta?: number; unit?: string; history?: { passed: boolean }[] } | null);
  const displayStats = statsSource &&
    statsSource.startValue != null &&
    statsSource.targetValue != null &&
    statsSource.latestMetric != null &&
    statsSource.weeklyDelta != null
    ? {
        progressPct:
          statsSource.weeklyDelta < 0
            ? Math.max(
                0,
                Math.min(
                  100,
                  ((statsSource.startValue - statsSource.latestMetric) /
                    (statsSource.startValue - statsSource.targetValue)) *
                    100
                )
              )
            : Math.max(
                0,
                Math.min(
                  100,
                  ((statsSource.latestMetric - statsSource.startValue) /
                    (statsSource.targetValue - statsSource.startValue)) *
                    100
                )
              ),
        remaining:
          statsSource.weeklyDelta < 0
            ? statsSource.latestMetric - statsSource.targetValue
            : statsSource.targetValue - statsSource.latestMetric,
        successRate:
          statsSource.history && statsSource.history.length > 0
            ? Math.round(
                (statsSource.history.filter((r) => r.passed).length /
                  statsSource.history.length) *
                  100
              )
            : 0,
      }
    : null;

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border-light)] relative"
          style={{ backgroundColor: "var(--bg-card)" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[var(--accent-main)] opacity-5 blur-3xl rounded-full" />
      <div className="relative z-10 p-5 space-y-4">
        {/* 1. 메인 탭: 인바디 | 스트렝스 | 체력 */}
        <div className="rounded-full p-1 bg-[var(--bg-body)] border border-[var(--border-light)] flex">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMainTab(tab.id);
                setSubTab(tab.id === "inbody" ? "fatPercent" : tab.id === "strength" ? "squat" : "run5k");
              }}
              className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                mainTab === tab.id
                  ? "bg-[var(--accent-bg)] text-[var(--accent-main)] border border-[var(--accent-main)]/40 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  : "text-[var(--text-sub)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-1. 인바디/스트렝스/체력 하위 버튼 */}
        {mainTab === "inbody" && (
          <div className="rounded-full p-1 bg-[var(--bg-body)] border border-[var(--border-light)] flex flex-wrap gap-1">
            {INBODY_SUB_TABS_WITH_COLOR.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`flex-1 min-w-0 py-1.5 px-2 rounded-full text-[10px] font-bold transition-all ${
                  subTab === tab.id
                    ? "bg-[var(--accent-bg)] text-[var(--accent-main)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-[var(--text-sub)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {mainTab === "strength" && (
          <div className="rounded-full p-1 bg-[var(--bg-body)] border border-[var(--border-light)] flex flex-wrap gap-1">
            {STRENGTH_SUB_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`flex-1 min-w-0 py-1.5 px-2 rounded-full text-[10px] font-bold transition-all ${
                  subTab === tab.id
                    ? "bg-[var(--accent-bg)] text-[var(--accent-main)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-[var(--text-sub)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {mainTab === "cardio" && (
          <div className="rounded-full p-1 bg-[var(--bg-body)] border border-[var(--border-light)] flex flex-wrap gap-1">
            {CARDIO_SUB_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`flex-1 min-w-0 py-1.5 px-2 rounded-full text-[10px] font-bold transition-all ${
                  subTab === tab.id
                    ? "bg-[var(--accent-bg)] text-[var(--accent-main)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-[var(--text-sub)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* 3. 탭별 PaceChart, CycleCompleteCard 또는 CategoryNotConfigured */}
        <div className="pt-2">
          {!mounted ? (
            <div className="py-12 px-4 text-center">
              <p className="text-sm text-[var(--text-sub)] mb-4">로딩 중...</p>
            </div>
          ) : isCycleComplete && catSetting?.goal ? (
            <CycleCompleteCard
              categoryId={categoryId}
              startValue={
                mainTab !== "inbody" && chartData && "startValue" in chartData
                  ? (chartData as GoalChartData).startValue
                  : catSetting.goal.startValue
              }
              targetValue={
                mainTab !== "inbody" && chartData && "targetValue" in chartData
                  ? (chartData as GoalChartData).targetValue
                  : catSetting.goal.targetValue
              }
              finalValue={
                (chartData && "latestMetric" in chartData
                  ? chartData.latestMetric
                  : catSetting.goal.targetValue) ?? catSetting.goal.targetValue
              }
              achieved={
                (() => {
                  const final =
                    chartData && "latestMetric" in chartData
                      ? chartData.latestMetric
                      : catSetting.goal.targetValue;
                  const targetValue =
                    mainTab !== "inbody" && chartData && "targetValue" in chartData
                      ? (chartData as GoalChartData).targetValue
                      : catSetting.goal.targetValue;
                  const weeklyDelta =
                    mainTab !== "inbody" && chartData && "weeklyDelta" in chartData
                      ? (chartData as GoalChartData).weeklyDelta
                      : catSetting.goal.weeklyDelta;
                  return weeklyDelta < 0 ? final <= targetValue : final >= targetValue;
                })()
              }
              unit={
                mainTab === "inbody"
                  ? "%"
                  : mainTab === "strength"
                    ? "kg"
                    : "분/km"
              }
              onExtend={() => {
                const final =
                  chartData && "latestMetric" in chartData
                    ? chartData.latestMetric
                    : catSetting.goal!.targetValue;
                extendCategory(categoryId, final);
              }}
              onReset={() => {
                const final =
                  chartData && "latestMetric" in chartData
                    ? chartData.latestMetric
                    : catSetting.goal!.targetValue;
                const achieved =
                  (catSetting.goal!.weeklyDelta < 0 ? final <= catSetting.goal!.targetValue : final >= catSetting.goal!.targetValue);
                resetCategory(categoryId, { finalValue: final, achieved });
                setShowSetupSheet(true);
              }}
            />
          ) : !isMetricConfigured ? (
            <CategoryNotConfigured
              categoryLabel={
                mainTab === "inbody"
                  ? (INBODY_SUB_TABS_WITH_COLOR.find((t) => t.id === subTab)?.label ?? "인바디")
                  : mainTab === "strength"
                    ? STRENGTH_SUB_TABS.find((t) => t.id === subTab)?.label ?? "스트렝스"
                    : CARDIO_SUB_TABS.find((t) => t.id === subTab)?.label ?? "체력"
              }
              onSetupClick={() => setShowSetupSheet(true)}
            />
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between gap-3">
                {(() => {
                  const activeColor =
                    mainTab === "inbody"
                      ? INBODY_LINE_COLORS[subTab as InbodyChartOption]
                      : mainTab === "strength"
                        ? STRENGTH_LINE_COLORS[subTab as StrengthChartOption]
                        : CARDIO_LINE_COLORS[subTab as CardioChartOption];
                  return (
                    <div className="flex items-center gap-4 text-[10px] text-[var(--text-sub)]">
                      <span className="flex items-center gap-1">
                        <span className="w-5 h-0.5 rounded" style={{ backgroundColor: activeColor }} />
                        실제기록
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-5 h-0.5 rounded"
                          style={{ borderTop: `1.5px dashed ${activeColor}80` }}
                        />
                        이상페이스
                      </span>
                    </div>
                  );
                })()}
                {mainTab === "inbody" &&
                  catSetting?.configuredAt &&
                  (() => {
                    const metricKey =
                      subTab === "fatPercent"
                        ? "inbody.fatPercent"
                        : subTab === "muscleMass"
                          ? "inbody.muscleMass"
                          : "inbody.weight";
                    const dataPoints =
                      chartData &&
                      "dataPoints" in chartData &&
                      (chartData as GoalChartData).dataPoints;
                    const existingValues: Record<number, number> = {};
                    if (dataPoints) {
                      for (const p of dataPoints) {
                        existingValues[Math.round(p.day / 7)] = p.value;
                      }
                    }
                    return (
                      <InbodyRecordInputPopover
                        metric={subTab as InbodyChartOption}
                        configuredAt={catSetting.configuredAt}
                        metricKey={metricKey}
                        existingValues={existingValues}
                        onRecorded={() => setChartDataVersion((v) => v + 1)}
                      />
                    );
                  })()}
              </div>

              {mainTab === "inbody" ? (
                <InbodyPaceChart
                  data={chartData as GoalChartData | InbodyMultiLineChartData | null}
                  subTab={subTab as InbodyChartOption}
                  lineColor={INBODY_LINE_COLORS[subTab as InbodyChartOption]}
                  inbodyGoal={
                    goalSetting?.category === "inbody"
                      ? goalSettingToInbodyGoal(goalSetting)
                      : isConfigured && catSetting
                        ? categorySettingToInbodyGoal(catSetting)
                        : null
                  }
                  onSelectMetric={(metric) => setSubTab(metric as InbodyChartOption)}
                  configuredAt={catSetting?.configuredAt ?? null}
                />
              ) : chartData && !isInbodyMultiLine ? (
                <PaceChart
                  startValue={(chartData as GoalChartData).startValue}
                  targetValue={(chartData as GoalChartData).targetValue}
                  weeklyDelta={(chartData as GoalChartData).weeklyDelta}
                  history={(chartData as GoalChartData).history}
                  currentWeek={(chartData as GoalChartData).currentWeek}
                  latestMetric={(chartData as GoalChartData).latestMetric}
                  unit={(chartData as GoalChartData).unit}
                  dataPoints={(chartData as GoalChartData).dataPoints}
                  lineColor={
                    mainTab === "cardio"
                      ? CARDIO_LINE_COLORS[subTab as CardioChartOption]
                      : mainTab === "strength"
                        ? STRENGTH_LINE_COLORS[subTab as StrengthChartOption]
                        : undefined
                  }
                  formatValue={mainTab === "cardio" ? (v) => v.toFixed(1) : undefined}
                  configuredAt={catSetting?.configuredAt ?? null}
                />
              ) : (
                <div className="py-12 text-center text-xs text-[var(--text-sub)]">
                  데이터가 필요합니다
                </div>
              )}

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-[var(--text-sub)] underline hover:text-[var(--text-main)] transition-colors"
                >
                  목표 다시 설정하기
                </button>
              </div>
            </>
          )}
        </div>

        <CategoryResetConfirmModal
          open={showResetModal}
          onClose={() => setShowResetModal(false)}
          categoryLabel={MAIN_TABS.find((t) => t.id === mainTab)?.label ?? mainTab}
          onConfirm={() => {
            const record =
              chartData && "latestMetric" in chartData && catSetting?.goal
                ? {
                    finalValue: chartData.latestMetric,
                    achieved:
                      catSetting.goal.weeklyDelta < 0
                        ? chartData.latestMetric <= catSetting.goal.targetValue
                        : chartData.latestMetric >= catSetting.goal.targetValue,
                  }
                : undefined;
            resetCategory(categoryId, record);
            setShowResetModal(false);
            setShowSetupSheet(true);
          }}
        />

        <CategorySetupSheet
          open={showSetupSheet}
          onClose={() => setShowSetupSheet(false)}
          categoryId={categoryId}
          primaryGoal={primaryGoal}
          metric={
            mainTab === "inbody"
              ? (subTab as InbodyChartOption)
              : mainTab === "strength"
                ? (subTab as StrengthChartOption)
                : mainTab === "cardio"
                  ? (subTab as CardioChartOption)
                  : undefined
          }
          onComplete={() => setShowSetupSheet(false)}
        />
      </div>
    </div>
  );
}
