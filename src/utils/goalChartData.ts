import type { WeekRecord } from "@/types/quest";
import type { InbodyGoal, InbodyMetricKey, InbodyPace } from "@/types/quest";
import type { InbodyRecord } from "@/types/workout";
import type { GoalSetting } from "@/types/goalSetting";
import type { ChartDataPoint } from "@/types/chartData";
import type { CategorySetting } from "@/types/categorySettings";

export type InbodyChartOption = "fatPercent" | "muscleMass" | "weight";

export const INBODY_SUB_TABS: { id: InbodyChartOption; label: string }[] = [
  { id: "fatPercent", label: "체지방률" },
  { id: "muscleMass", label: "골격근" },
  { id: "weight", label: "체중" },
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

/** 체력 time(초) → 페이스(분/km) 변환. run5k=5km, row2k=2km, skierg=2km */
const CARDIO_DISTANCE_KM: Record<string, number> = {
  run5k: 5,
  row2k: 2,
  skierg: 2,
};

function cardioTimeToPace(option: string, timeSec: number): number {
  const dist = CARDIO_DISTANCE_KM[option] ?? 5;
  return timeSec / 60 / dist;
}

export interface GoalChartData {
  startValue: number;
  targetValue: number;
  weeklyDelta: number;
  history: WeekRecord[];
  currentWeek: number;
  latestMetric: number;
  unit: string;
  /** Day-based 차트용 (configuredAt 기준 경과 일수). 우선 사용 */
  dataPoints?: ChartDataPoint[];
}

function inbodyHistoryToSessions(inbodyHistory: InbodyRecord[]): InbodySession[] {
  const sorted = [...inbodyHistory].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((r, i) => ({ index: i + 1, date: r.date }));
}

/** CategorySetting (inbody) → InbodyGoal 변환 (goalSetting 없을 때 사용) */
export function categorySettingToInbodyGoal(cat: CategorySetting): InbodyGoal | null {
  const g = cat?.goal;
  if (!g) return null;
  const mainMetric = (g.metric === "fatPercent" || g.metric === "muscleMass" || g.metric === "weight"
    ? g.metric
    : "fatPercent") as InbodyMetricKey;
  const paces: Record<InbodyMetricKey, InbodyPace> = {
    weight: { start: 0, target: 0, weeklyDelta: 0, isMain: false },
    muscleMass: { start: 0, target: 0, weeklyDelta: 0, isMain: false },
    fatPercent: { start: 0, target: 0, weeklyDelta: 0, isMain: false },
  };
  paces[mainMetric] = {
    start: g.startValue,
    target: g.targetValue,
    weeklyDelta: g.weeklyDelta,
    isMain: true,
  };
  if (cat.autoPaces) {
    if (cat.autoPaces.weight) paces.weight = { ...cat.autoPaces.weight, isMain: mainMetric === "weight" };
    if (cat.autoPaces.muscleMass) paces.muscleMass = { ...cat.autoPaces.muscleMass, isMain: mainMetric === "muscleMass" };
    if (cat.autoPaces.fatPercent) paces.fatPercent = { ...cat.autoPaces.fatPercent, isMain: mainMetric === "fatPercent" };
  }
  return { mainMetric, paces };
}

/** GoalSetting (inbody) → InbodyGoal 변환 */
export function goalSettingToInbodyGoal(gs: GoalSetting): InbodyGoal {
  const main = gs.mainMetric as InbodyMetricKey;
  const paces: Record<InbodyMetricKey, InbodyPace> = {
    weight: { start: 0, target: 0, weeklyDelta: 0, isMain: false },
    muscleMass: { start: 0, target: 0, weeklyDelta: 0, isMain: false },
    fatPercent: { start: 0, target: 0, weeklyDelta: 0, isMain: false },
  };
  paces[main] = {
    start: gs.target.startValue,
    target: gs.target.targetValue,
    weeklyDelta: gs.target.weeklyDelta,
    isMain: true,
  };
  if (gs.autoPaces) {
    for (const [k, v] of Object.entries(gs.autoPaces)) {
      if (k !== main && (k === "weight" || k === "muscleMass" || k === "fatPercent")) {
        paces[k as InbodyMetricKey] = { ...v, isMain: false };
      }
    }
  }
  return { mainMetric: main, paces };
}

const CYCLE_WEEKS = 4;
const INBODY_SERIES_COLORS: Record<InbodyMetricKey, string> = {
  fatPercent: "#fb923c",
  muscleMass: "#a3e635",
  weight: "#ffffff",
};

/** 주차별 목표 추이 값 생성 (start → target, 4주) */
function buildWeeklyValues(
  start: number,
  target: number,
  weeks: number = CYCLE_WEEKS
): number[] {
  const values: number[] = [start];
  for (let w = 1; w <= weeks; w++) {
    const v = start + (target - start) * (w / weeks);
    values.push(Math.round(v * 100) / 100);
  }
  return values;
}

/** 인바디 차트 데이터: 목표 설정 시 3선(체지방률/골격근/체중) 그래프, 미설정 시 단일 또는 null */
export function getInbodyChartData(
  inbodyHistory: InbodyRecord[],
  goalSetting?: GoalSetting | null,
  activeQuestHistory?: WeekRecord[],
  option: InbodyChartOption = "fatPercent",
  categorySetting?: CategorySetting | null,
  dataPoints?: ChartDataPoint[]
): GoalChartData | InbodyMultiLineChartData | null {
  const sorted = [...inbodyHistory].sort((a, b) => a.date.localeCompare(b.date));

  const inbodyGoal =
    goalSetting?.category === "inbody"
      ? goalSettingToInbodyGoal(goalSetting)
      : categorySetting?.isConfigured && categorySetting?.goal
        ? categorySettingToInbodyGoal(categorySetting)
        : null;

  const hasAnyInbodyConfig =
    categorySetting?.startValues && Object.keys(categorySetting.startValues).some((k) => (categorySetting.startValues![k] ?? 0) > 0);
  const hasAnyAutoPace = categorySetting?.autoPaces && Object.keys(categorySetting.autoPaces).length > 0;
  const cat = (categorySetting?.isConfigured || hasAnyInbodyConfig || hasAnyAutoPace) && categorySetting?.goal
    ? categorySetting
    : null;

  // 목표 설정 + autoPaces 있으면 그래프 데이터 (단일 메트릭 설정 지원)
  if (cat?.goal) {
    const configuredAt = cat.configuredAt ?? new Date().toISOString().slice(0, 10);
    const sessions: InbodySession[] = [];
    for (let w = 0; w <= CYCLE_WEEKS; w++) {
      const d = new Date(configuredAt);
      d.setDate(d.getDate() + w * 7);
      sessions.push({ index: w, date: d.toISOString().slice(0, 10) });
    }

    const series: InbodySeriesData[] = [];
    const goal = cat.goal!;
    const autoPaces = cat.autoPaces ?? {};

    const metrics: InbodyMetricKey[] = ["fatPercent", "muscleMass", "weight"];
    for (const m of metrics) {
      const pace = autoPaces[m] ?? (goal.metric === m ? { start: goal.startValue, target: goal.targetValue, weeklyDelta: goal.weeklyDelta } : null);
      if (pace) {
        const startVal = pace.start;
        const targetVal = pace.target;
        const unit = m === "fatPercent" ? "%" : "kg";
        series.push({
          metricKey: m,
          values: buildWeeklyValues(startVal, targetVal),
          unit,
          color: INBODY_SERIES_COLORS[m],
          pace: { ...pace, isMain: goal.metric === m },
        });
      }
    }

    if (series.length > 0) {
      const metricMap: Record<InbodyChartOption, InbodyMetricKey> = {
        fatPercent: "fatPercent",
        muscleMass: "muscleMass",
        weight: "weight",
      };
      const metricKey = metricMap[option];
      const s = series.find((x) => x.metricKey === metricKey);
      if (s) {
        const latestMetric =
          dataPoints && dataPoints.length > 0
            ? dataPoints[dataPoints.length - 1].value
            : s.values[s.values.length - 1];
        return {
          startValue: s.values[0],
          targetValue: s.values[s.values.length - 1],
          weeklyDelta: s.pace?.weeklyDelta ?? (s.values[s.values.length - 1] - s.values[0]) / CYCLE_WEEKS,
          history: [],
          currentWeek: 1,
          latestMetric,
          unit: s.unit,
          dataPoints,
        };
      }
    }
  }

  const metricKey: InbodyMetricKey = "fatPercent";
  const pace = inbodyGoal?.paces[metricKey];
  const unit = "%";
  const getValue = (r: InbodyRecord) => r.fatPercent;

  const gs = goalSetting?.category === "inbody" ? goalSetting : null;
  const catSingle = categorySetting?.isConfigured && categorySetting?.goal ? categorySetting : null;

  if (hasAnyInbodyConfig && !categorySetting?.goal && (dataPoints?.length ?? 0) > 0) {
    const metricMap: Record<InbodyChartOption, InbodyMetricKey> = {
      fatPercent: "fatPercent",
      muscleMass: "muscleMass",
      weight: "weight",
    };
    const metricKey = metricMap[option];
    const startVal = (categorySetting!.startValues![metricKey] ?? 0) || (dataPoints![0]?.value ?? 0);
    const unit = metricKey === "fatPercent" ? "%" : "kg";
    const latestMetric = dataPoints![dataPoints!.length - 1].value;
    if (startVal > 0 || (metricKey === "fatPercent" && startVal >= 5)) {
      let targetVal: number;
      let weeklyDeltaVal: number;
      if (metricKey === "fatPercent") {
        targetVal = Math.max(10, startVal - 4);
        weeklyDeltaVal = (targetVal - startVal) / CYCLE_WEEKS;
      } else if (metricKey === "muscleMass") {
        targetVal = startVal + 1;
        weeklyDeltaVal = (targetVal - startVal) / CYCLE_WEEKS;
      } else {
        targetVal = Math.max(40, startVal - 2);
        weeklyDeltaVal = (targetVal - startVal) / CYCLE_WEEKS;
      }
      return {
        startValue: startVal,
        targetValue: targetVal,
        weeklyDelta: weeklyDeltaVal,
        history: [],
        currentWeek: 1,
        latestMetric,
        unit,
        dataPoints,
      };
    }
  }

  if (gs || catSingle) {
    const startVal =
      gs?.target?.startValue ??
      (catSingle?.startValues?.fatPercent ?? catSingle?.goal?.startValue ?? 0);
    const targetVal = (gs?.target ?? catSingle?.goal)?.targetValue ?? 0;
    const weeklyDeltaVal = (gs?.target ?? catSingle?.goal)?.weeklyDelta ?? 0;
    if (targetVal > 0 || weeklyDeltaVal !== 0) {
      const useMain = gs ? gs.mainMetric === metricKey : true;
      if (useMain && activeQuestHistory && activeQuestHistory.length > 0) {
        const latest = activeQuestHistory[activeQuestHistory.length - 1];
        return {
          startValue: startVal,
          targetValue: targetVal,
          weeklyDelta: weeklyDeltaVal,
          history: activeQuestHistory,
          currentWeek: activeQuestHistory.length,
          latestMetric: latest.recorded,
          unit: "%",
        };
      }
      const latestFromHistory =
        sorted.length > 0 ? getValue(sorted[sorted.length - 1]) : startVal;
      return {
        startValue: startVal,
        targetValue: targetVal,
        weeklyDelta: weeklyDeltaVal,
        history: [],
        currentWeek: 1,
        latestMetric: latestFromHistory,
        unit: "%",
      };
    }
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

export type StrengthChartOption = "squat" | "bench" | "deadlift";

const STRENGTH_OPTION_TO_METRIC: Record<StrengthChartOption, string> = {
  squat: "squat",
  bench: "bench",
  deadlift: "deadlift",
};

export interface MultiLineSeriesData {
  key: string;
  label: string;
  values: number[];
  color: string;
  unit: string;
}

export interface MultiLineChartData {
  type: "multiLine";
  sessions: { index: number; label: string }[];
  series: MultiLineSeriesData[];
  unit: string;
}

export function isMultiLineChart(
  data: GoalChartData | InbodyMultiLineChartData | MultiLineChartData | null
): data is MultiLineChartData {
  return data !== null && "type" in data && (data as MultiLineChartData).type === "multiLine";
}

const STRENGTH_KEYS = ["squat", "bench", "deadlift"] as const;
const STRENGTH_LABELS: Record<string, string> = { squat: "스쿼트", bench: "벤치프레스", deadlift: "데드리프트" };
const STRENGTH_COLORS: Record<string, string> = { squat: "#a3e635", bench: "#38bdf8", deadlift: "#fb923c" };

/** 스트렝스 차트 데이터: 개별 종목별 목표 적용 */
export function getStrengthChartData(
  option: StrengthChartOption = "squat",
  opts?: {
    categorySetting?: {
      startValues: Record<string, number> | null;
      goal: { targetValue: number; weeklyDelta: number } | null;
      autoPaces: Record<string, { start: number; target: number; weeklyDelta: number }> | null;
    };
    dataPoints?: ChartDataPoint[];
  }
): GoalChartData {
  const cat = opts?.categorySetting;
  const useReal = cat?.startValues;
  const autoPace = cat?.autoPaces?.[option];

  const startVal = autoPace
    ? autoPace.start
    : useReal
      ? (useReal[STRENGTH_OPTION_TO_METRIC[option]] ?? 0)
      : STRENGTH_TREND_DATA[0][option];
  const targetVal = autoPace
    ? autoPace.target
    : cat?.goal
      ? cat.goal.targetValue
      : Math.max(STRENGTH_TREND_DATA.slice(-1)[0][option], startVal + 15);
  const weeklyDelta = autoPace
    ? autoPace.weeklyDelta
    : cat?.goal
      ? cat.goal.weeklyDelta
      : (targetVal - startVal) / 12;
  const latestMetric = opts?.dataPoints && opts.dataPoints.length > 0
    ? opts.dataPoints[opts.dataPoints.length - 1].value
    : startVal;

  return {
    startValue: startVal,
    targetValue: targetVal,
    weeklyDelta,
    history: [],
    currentWeek: 1,
    latestMetric,
    unit: "kg",
    dataPoints: opts?.dataPoints,
  };
}

export type CardioChartOption = "run5k" | "row2k" | "skierg";

const CARDIO_OPTION_TO_METRIC: Record<CardioChartOption, string> = {
  run5k: "running",
  row2k: "rowing",
  skierg: "skierg",
};

const CARDIO_KEYS = ["running", "rowing", "skierg"] as const;
const CARDIO_LABELS: Record<string, string> = { running: "런닝", rowing: "로잉", skierg: "스키에르그" };
const CARDIO_COLORS: Record<string, string> = { running: "#a3e635", rowing: "#38bdf8", skierg: "#fb923c" };

/** 체력 차트 데이터: 개별 유산소 종목 (페이스 분/km), 종목별 autoPaces 지원 */
export function getCardioChartData(
  option: CardioChartOption = "run5k",
  opts?: {
    categorySetting?: {
      startValues: Record<string, number> | null;
      goal: { targetValue: number; weeklyDelta: number } | null;
      autoPaces: Record<string, { start: number; target: number; weeklyDelta: number }> | null;
    };
    dataPoints?: ChartDataPoint[];
  }
): GoalChartData {
  const cat = opts?.categorySetting;
  const useReal = cat?.startValues;
  const metricKey = CARDIO_OPTION_TO_METRIC[option];
  const autoPace = cat?.autoPaces?.[metricKey];

  const startVal = autoPace
    ? autoPace.start
    : useReal
      ? (useReal[metricKey] ?? 0)
      : cardioTimeToPace(option, CARDIO_TREND_DATA[option][0].time);
  const targetVal = autoPace
    ? autoPace.target
    : cat?.goal
      ? cat.goal.targetValue
      : useReal && (useReal[metricKey] ?? 0) > 0
        ? Math.round(Math.max(3, (useReal[metricKey] ?? 0) * 0.98) * 100) / 100
        : cardioTimeToPace(option, CARDIO_TREND_DATA[option].slice(-1)[0].time);
  const weeklyDelta = autoPace
    ? autoPace.weeklyDelta
    : cat?.goal
      ? cat.goal.weeklyDelta
      : (targetVal - startVal) / CYCLE_WEEKS;
  const latestMetric = opts?.dataPoints && opts.dataPoints.length > 0
    ? opts.dataPoints[opts.dataPoints.length - 1].value
    : startVal;

  return {
    startValue: startVal,
    targetValue: targetVal,
    weeklyDelta,
    history: [],
    currentWeek: 1,
    latestMetric,
    unit: "분/km",
    dataPoints: opts?.dataPoints,
  };
}
