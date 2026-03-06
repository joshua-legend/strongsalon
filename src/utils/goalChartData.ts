import type { WeekRecord } from "@/types/quest";
import type { InbodyRecord } from "@/types/workout";
import type { UserProfile } from "@/types/quest";

const STRENGTH_TREND_DATA = [
  { month: "9월", bench: 85, squat: 100, deadlift: 120 },
  { month: "10월", bench: 87.5, squat: 105, deadlift: 125 },
  { month: "11월", bench: 90, squat: 110, deadlift: 130 },
  { month: "12월", bench: 92.5, squat: 112.5, deadlift: 132.5 },
  { month: "1월", bench: 97.5, squat: 117.5, deadlift: 137.5 },
  { month: "2월", bench: 100, squat: 120, deadlift: 140 },
];

const CARDIO_TREND_DATA = {
  run5k: [
    { month: "9월", time: 1800 },
    { month: "10월", time: 1750 },
    { month: "11월", time: 1720 },
    { month: "12월", time: 1680 },
    { month: "1월", time: 1650 },
    { month: "2월", time: 1600 },
  ],
  row2k: [
    { month: "9월", time: 520 },
    { month: "10월", time: 505 },
    { month: "11월", time: 495 },
    { month: "12월", time: 485 },
    { month: "1월", time: 472 },
    { month: "2월", time: 462 },
  ],
  skierg: [
    { month: "9월", time: 580 },
    { month: "10월", time: 560 },
    { month: "11월", time: 545 },
    { month: "12월", time: 535 },
    { month: "1월", time: 525 },
    { month: "2월", time: 520 },
  ],
};

export interface GoalChartData {
  startValue: number;
  targetValue: number;
  weeklyDelta: number;
  history: WeekRecord[];
  currentWeek: number;
  latestMetric: number;
  unit: string;
}

/** 인바디(체중) 차트 데이터: inbodyHistory 또는 activeQuest(purpose=cut) 기반 */
export function getInbodyChartData(
  inbodyHistory: InbodyRecord[],
  userProfile?: UserProfile | null,
  activeQuestHistory?: WeekRecord[]
): GoalChartData | null {
  if (userProfile?.purpose?.id === "cut" && activeQuestHistory && activeQuestHistory.length > 0) {
    const startValue = userProfile.startValue;
    const targetValue = userProfile.targetValue;
    const weeklyDelta = userProfile.purpose.weeklyDelta;
    const latest = activeQuestHistory[activeQuestHistory.length - 1];
    return {
      startValue,
      targetValue,
      weeklyDelta,
      history: activeQuestHistory,
      currentWeek: activeQuestHistory.length,
      latestMetric: latest.recorded,
      unit: "kg",
    };
  }

  if (inbodyHistory.length < 2) return null;

  const sorted = [...inbodyHistory].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sorted.map((r) => r.weight);
  const startValue = weights[0];
  const targetValue = weights[weights.length - 1];
  const diff = targetValue - startValue;
  const weeklyDelta = diff / Math.max(1, weights.length - 1);

  const history: WeekRecord[] = weights.slice(1, -1).map((w, i) => ({
    week: i + 1,
    recorded: w,
    target: startValue + weeklyDelta * (i + 1),
    passed: true,
  }));

  return {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek: weights.length,
    latestMetric: weights[weights.length - 1],
    unit: "kg",
  };
}

/** 스트렝스 3대 토탈 차트 데이터: squat + bench + deadlift 합산 */
export function getStrengthChartData(): GoalChartData {
  const totals = STRENGTH_TREND_DATA.map((d) => d.squat + d.bench + d.deadlift);
  const startValue = totals[0];
  const targetValue = totals[totals.length - 1];
  const weeklyDelta = 7.5;

  const history: WeekRecord[] = totals.slice(1, -1).map((total, i) => {
    const week = i + 1;
    const target = startValue + weeklyDelta * week;
    return {
      week,
      recorded: total,
      target,
      passed: total >= target,
    };
  });

  return {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek: totals.length,
    latestMetric: totals[totals.length - 1],
    unit: "kg",
  };
}

/** 체력 3대 유산소 토탈 차트 데이터: run5k + row2k + skierg 합산 (분 단위) */
export function getCardioChartData(): GoalChartData {
  const totalsSec = CARDIO_TREND_DATA.run5k.map((_, i) => {
    const r5 = CARDIO_TREND_DATA.run5k[i].time;
    const r2 = CARDIO_TREND_DATA.row2k[i].time;
    const sk = CARDIO_TREND_DATA.skierg[i].time;
    return r5 + r2 + sk;
  });
  const totals = totalsSec.map((s) => Math.round((s / 60) * 10) / 10);

  const startValue = totals[0];
  const targetValue = totals[totals.length - 1];
  const weeklyDelta = -0.5;

  const history: WeekRecord[] = totals.slice(1, -1).map((total, i) => {
    const week = i + 1;
    const target = startValue + weeklyDelta * week;
    return {
      week,
      recorded: total,
      target,
      passed: total <= target,
    };
  });

  return {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek: totals.length,
    latestMetric: totals[totals.length - 1],
    unit: "분",
  };
}
