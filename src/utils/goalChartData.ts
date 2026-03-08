import type { WeekRecord } from "@/types/quest";
import type { InbodyGoal, InbodyMetricKey, InbodyPace } from "@/types/quest";
import type { InbodyRecord } from "@/types/workout";
import type { UserProfile } from "@/types/quest";

export type InbodyChartOption = "total" | "weight" | "muscleMass" | "fatPercent";

export const INBODY_SUB_TABS: { id: InbodyChartOption; label: string }[] = [
  { id: "total", label: "토탈" },
  { id: "weight", label: "체중" },
  { id: "muscleMass", label: "골격근량" },
  { id: "fatPercent", label: "체지방률" },
];

export interface InbodySession {
  index: number;
  date: string;
}

export interface InbodySeriesData {
  metricKey: InbodyMetricKey;
  values: number[];
  unit: string;
  color: string;
  pace?: InbodyPace;
}

export interface InbodyMultiLineChartData {
  sessions: InbodySession[];
  series: InbodySeriesData[];
}

/** 인바디 더미 데이터: 백엔드 연동 전 임시 사용 (6개월 체중 추이) */
const INBODY_DUMMY_WEIGHTS = [75, 74.2, 73.5, 72.8, 72.2, 71.5];

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

function inbodyHistoryToSessions(inbodyHistory: InbodyRecord[]): InbodySession[] {
  const sorted = [...inbodyHistory].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((r, i) => ({ index: i + 1, date: r.date }));
}

/** 인바디 차트 데이터: option에 따라 토탈(3선) 또는 개별 지표 */
export function getInbodyChartData(
  inbodyHistory: InbodyRecord[],
  userProfile?: UserProfile | null,
  activeQuestHistory?: WeekRecord[],
  inbodyGoal?: InbodyGoal | null,
  option: InbodyChartOption = "total"
): GoalChartData | InbodyMultiLineChartData | null {
  const sorted = [...inbodyHistory].sort((a, b) => a.date.localeCompare(b.date));

  if (option === "total") {
    if (sorted.length < 2) return null;
    const sessions = inbodyHistoryToSessions(inbodyHistory);
    const series: InbodySeriesData[] = [
      {
        metricKey: "weight",
        values: sorted.map((r) => r.weight),
        unit: "kg",
        color: "#ffffff",
        pace: inbodyGoal?.paces.weight,
      },
      {
        metricKey: "muscleMass",
        values: sorted.map((r) => r.muscleMass),
        unit: "kg",
        color: "#a3e635",
        pace: inbodyGoal?.paces.muscleMass,
      },
      {
        metricKey: "fatPercent",
        values: sorted.map((r) => r.fatPercent),
        unit: "%",
        color: "#fb923c",
        pace: inbodyGoal?.paces.fatPercent,
      },
    ];
    return { sessions, series };
  }

  const metricKey = option as InbodyMetricKey;
  const pace = inbodyGoal?.paces[metricKey];
  const unit = metricKey === "fatPercent" ? "%" : "kg";
  const getValue = (r: InbodyRecord) =>
    metricKey === "weight" ? r.weight : metricKey === "muscleMass" ? r.muscleMass : r.fatPercent;

  if (
    userProfile?.purpose?.id === "cut" &&
    metricKey === "weight" &&
    activeQuestHistory &&
    activeQuestHistory.length > 0
  ) {
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

  if (sorted.length < 2) return null;

  const values = sorted.map(getValue);
  const startValue = values[0];
  const targetValue = pace?.target ?? values[values.length - 1];
  const weeklyDelta = pace?.weeklyDelta ?? (targetValue - startValue) / Math.max(1, values.length - 1);

  const history: WeekRecord[] = values.slice(1).map((val, i) => ({
    week: i + 1,
    recorded: val,
    target: startValue + weeklyDelta * (i + 1),
    passed: true,
  }));

  return {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek: values.length,
    latestMetric: values[values.length - 1],
    unit,
  };
}

export type StrengthChartOption = "total" | "squat" | "bench" | "deadlift";

/** 스트렝스 차트 데이터: option에 따라 토탈 또는 개별 종목 */
export function getStrengthChartData(
  option: StrengthChartOption = "total"
): GoalChartData {
  const values =
    option === "total"
      ? STRENGTH_TREND_DATA.map((d) => d.squat + d.bench + d.deadlift)
      : STRENGTH_TREND_DATA.map((d) => d[option]);

  const startValue = values[0];
  const targetValue = values[values.length - 1];
  const totalDelta = targetValue - startValue;
  const weeklyDelta =
    values.length > 1 ? totalDelta / (values.length - 1) : 0;

  const history: WeekRecord[] = values.slice(1, -1).map((val, i) => {
    const week = i + 1;
    const target = startValue + weeklyDelta * week;
    return {
      week,
      recorded: val,
      target,
      passed: val >= target,
    };
  });

  return {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek: values.length,
    latestMetric: values[values.length - 1],
    unit: "kg",
  };
}

export type CardioChartOption = "total" | "run5k" | "row2k" | "skierg";

/** 체력 차트 데이터: option에 따라 토탈 또는 개별 유산소 종목 (분 단위) */
export function getCardioChartData(
  option: CardioChartOption = "total"
): GoalChartData {
  const valuesSec =
    option === "total"
      ? CARDIO_TREND_DATA.run5k.map((_, i) => {
          const r5 = CARDIO_TREND_DATA.run5k[i].time;
          const r2 = CARDIO_TREND_DATA.row2k[i].time;
          const sk = CARDIO_TREND_DATA.skierg[i].time;
          return r5 + r2 + sk;
        })
      : CARDIO_TREND_DATA[option].map((d) => d.time);

  const values = valuesSec.map((s) => Math.round((s / 60) * 10) / 10);

  const startValue = values[0];
  const targetValue = values[values.length - 1];
  const totalDelta = targetValue - startValue;
  const weeklyDelta =
    values.length > 1 ? totalDelta / (values.length - 1) : 0;

  const history: WeekRecord[] = values.slice(1, -1).map((val, i) => {
    const week = i + 1;
    const target = startValue + weeklyDelta * week;
    return {
      week,
      recorded: val,
      target,
      passed: val <= target,
    };
  });

  return {
    startValue,
    targetValue,
    weeklyDelta,
    history,
    currentWeek: values.length,
    latestMetric: values[values.length - 1],
    unit: "분",
  };
}
