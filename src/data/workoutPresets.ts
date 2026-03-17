/**
 * 추천 모드용 분할 프리셋 및 종목별 3대 비율표
 * 친구네 헬스장 기구 기준
 */

import type { WorkoutCondition } from "@/types";

/** 컨디션별 1RM 대비 무게 비율 (목표 미설정 시 폴백용) */
export const CONDITION_WEIGHT_RATIO: Record<WorkoutCondition, number> = {
  최악: 0.52,
  나쁨: 0.58,
  좋음: 0.68,
  최고: 0.78,
  불타: 0.85,
};

/** 컨디션별 목표 1RM 상향 비율: 보통=100%, 좋음=+2.5%, 최상=+5% */
export const CONDITION_TARGET_MODIFIER: Record<WorkoutCondition, number> = {
  최악: 0.9,
  나쁨: 0.95,
  좋음: 1.0, // 보통: 이상페이스 그대로
  최고: 1.025, // 좋음: +2.5%
  불타: 1.05, // 최상: +5%
};

/** 컨디션별 권장 횟수 (Epley 역산 보정: 비율×(1+횟수/30)=1.0 → 1RM 유지) */
export const CONDITION_REPS: Record<WorkoutCondition, number> = {
  최악: 20,
  나쁨: 16,
  좋음: 10,
  최고: 5,
  불타: 3,
};

/** 유산소 종목별 기본 거리(km) · 시간(분) - 컨디션·운동시간 반영 */
export const CARDIO_BASE: Record<string, { distanceKm: number; timeMin: number; paceMinPerKm: number }> = {
  run: { distanceKm: 2, timeMin: 12, paceMinPerKm: 6 },
  row: { distanceKm: 2, timeMin: 9, paceMinPerKm: 4.5 },
  skierg: { distanceKm: 2, timeMin: 10, paceMinPerKm: 5 },
  cycle: { distanceKm: 5, timeMin: 15, paceMinPerKm: 3 },
};

/** 컨디션별 유산소 비율 (0.5~1.0) */
export const CONDITION_CARDIO_RATIO: Record<WorkoutCondition, number> = {
  최악: 0.5,
  나쁨: 0.65,
  좋음: 0.85,
  최고: 0.95,
  불타: 1,
};

export function getCardioAutoFill(
  type: string,
  condition: WorkoutCondition,
  estMinutes: number
): { distanceKm: number; timeMinutes: number } {
  const base = CARDIO_BASE[type] ?? CARDIO_BASE.run;
  const ratio = CONDITION_CARDIO_RATIO[condition] ?? 0.85;
  const cardioShare = Math.min(0.35, estMinutes / 180);
  const targetTime = Math.round(
    Math.max(8, Math.min(25, base.timeMin * ratio * (1 + cardioShare)))
  );
  const targetDistance = Math.round((targetTime / base.paceMinPerKm) * 10) / 10;
  return {
    distanceKm: Math.max(0.5, Math.min(10, targetDistance)),
    timeMinutes: targetTime,
  };
}

/** 운동 시간별 종목당 세트 수 */
export function getSetCountFromTime(estMinutes: number): number {
  if (estMinutes <= 30) return 2;
  if (estMinutes <= 45) return 3;
  if (estMinutes <= 60) return 3;
  if (estMinutes <= 75) return 4;
  if (estMinutes <= 90) return 4;
  return 5;
}

export type SplitId =
  | "lowerA"
  | "lowerB"
  | "upperPush"
  | "upperPull"
  | "fullBody";

export interface PresetExercise {
  icon: string;
  name: string;
}

export interface SplitPreset {
  id: SplitId;
  label: string;
  shortLabel: string;
  exercises: PresetExercise[];
  /** 예상 운동 시간 (분) */
  estMinutes: number;
}

/** 분할별 종목 프리셋 */
export const SPLIT_PRESETS: SplitPreset[] = [
  {
    id: "lowerA",
    label: "하체 A",
    shortLabel: "하체A",
    estMinutes: 50,
    exercises: [
      { icon: "🔥", name: "퍼팩트스쿼트" },
      { icon: "🦵", name: "레그익스텐션" },
      { icon: "🦵", name: "라잉레그컬" },
      { icon: "🦿", name: "이너타이" },
      { icon: "🦿", name: "아웃타이" },
    ],
  },
  {
    id: "lowerB",
    label: "하체 B",
    shortLabel: "하체B",
    estMinutes: 45,
    exercises: [
      { icon: "🏋️", name: "파워레그프레스" },
      { icon: "🦵", name: "시티드레그컬" },
      { icon: "🦵", name: "레그익스텐션" },
      { icon: "🦿", name: "이너타이" },
    ],
  },
  {
    id: "upperPush",
    label: "상체 푸쉬",
    shortLabel: "푸쉬",
    estMinutes: 50,
    exercises: [
      { icon: "🏋️", name: "체스트프레스" },
      { icon: "🏋️", name: "숄더프레스" },
      { icon: "⬇️", name: "어시스트딥스(스탠딩)" },
      { icon: "🦋", name: "팩덱플라이" },
    ],
  },
  {
    id: "upperPull",
    label: "상체 풀",
    shortLabel: "풀",
    estMinutes: 50,
    exercises: [
      { icon: "⬇️", name: "랫풀다운" },
      { icon: "🚣", name: "시티드로우" },
      { icon: "🆙", name: "어시스트풀업(스탠딩)" },
      { icon: "🔄", name: "리버스플라이" },
    ],
  },
  {
    id: "fullBody",
    label: "전신",
    shortLabel: "전신",
    estMinutes: 60,
    exercises: [
      { icon: "🔥", name: "퍼팩트스쿼트" },
      { icon: "🏋️", name: "체스트프레스" },
      { icon: "⬇️", name: "랫풀다운" },
      { icon: "🏋️", name: "숄더프레스" },
    ],
  },
];

/** 종목명 → 3대 1RM 대비 비율 (0~1). 해당 3대가 없으면 다른 것 사용 */
export type StrengthLift = "squat" | "bench" | "deadlift";

export const EXERCISE_RATIO_MAP: Record<
  string,
  { lift: StrengthLift; ratio: number }
> = {
  // 스쿼트 계열
  스쿼트: { lift: "squat", ratio: 1 },
  퍼팩트스쿼트: { lift: "squat", ratio: 1 },
  "일반 스쿼트": { lift: "squat", ratio: 1 },
  파워레그프레스: { lift: "squat", ratio: 0.85 },
  레그프레스: { lift: "squat", ratio: 0.85 },
  레그익스텐션: { lift: "squat", ratio: 0.35 },
  라잉레그컬: { lift: "squat", ratio: 0.25 },
  시티드레그컬: { lift: "squat", ratio: 0.25 },
  레그컬: { lift: "squat", ratio: 0.25 },
  이너타이: { lift: "squat", ratio: 0.15 },
  아웃타이: { lift: "squat", ratio: 0.15 },

  // 벤치/가슴 계열
  벤치프레스: { lift: "bench", ratio: 1 },
  체스트프레스: { lift: "bench", ratio: 0.85 },
  인클라인프레스: { lift: "bench", ratio: 0.7 },
  스탠딩체스트프레스: { lift: "bench", ratio: 0.75 },
  숄더프레스: { lift: "bench", ratio: 0.5 },
  어시스트딥스스탠딩: { lift: "bench", ratio: 0.45 },
  "어시스트딥스(스탠딩)": { lift: "bench", ratio: 0.45 },
  어시스트딥스닐링: { lift: "bench", ratio: 0.4 },
  "어시스트딥스(닐링)": { lift: "bench", ratio: 0.4 },
  팩덱플라이: { lift: "bench", ratio: 0.2 },

  // 데드/등 계열
  데드리프트: { lift: "deadlift", ratio: 1 },
  랫풀다운: { lift: "deadlift", ratio: 0.55 },
  시티드로우: { lift: "deadlift", ratio: 0.5 },
  롱풀: { lift: "deadlift", ratio: 0.5 },
  티바로우: { lift: "deadlift", ratio: 0.55 },
  어시스트풀업스탠딩: { lift: "deadlift", ratio: 0.5 },
  "어시스트풀업(스탠딩)": { lift: "deadlift", ratio: 0.5 },
  어시스트풀업닐링: { lift: "deadlift", ratio: 0.45 },
  "어시스트풀업(닐링)": { lift: "deadlift", ratio: 0.45 },
  리버스플라이: { lift: "deadlift", ratio: 0.12 },
};

/** 목적별 세트×횟수 (근력/근비대/다이어트) - 기본: 근비대 */
export type PurposeId = "strength" | "hypertrophy" | "diet";

export const PURPOSE_SET_REPS: Record<
  PurposeId,
  { sets: number; reps: number }[]
> = {
  strength: [
    { sets: 1, reps: 5 },
    { sets: 1, reps: 5 },
    { sets: 1, reps: 5 },
    { sets: 1, reps: 3 },
  ],
  hypertrophy: [
    { sets: 1, reps: 12 },
    { sets: 1, reps: 10 },
    { sets: 1, reps: 8 },
    { sets: 1, reps: 8 },
  ],
  diet: [
    { sets: 1, reps: 15 },
    { sets: 1, reps: 12 },
    { sets: 1, reps: 12 },
  ],
};

/** 비율로 무게 계산 (2.5kg 단위 반올림) */
export function calcWeightFrom1RM(oneRM: number, ratio: number): number {
  if (oneRM <= 0) return 0;
  const raw = oneRM * ratio;
  const step = 2.5;
  return Math.round(raw / step) * step;
}

/** 종목명으로 비율 찾기 (정규화) */
export function getRatioForExercise(name: string): {
  lift: StrengthLift;
  ratio: number;
} | null {
  const normalized = name.replace(/\s/g, "").replace(/[()]/g, "");
  const entries = Object.entries(EXERCISE_RATIO_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [key, val] of entries) {
    const keyNorm = key.replace(/\s/g, "").replace(/[()]/g, "");
    if (normalized.includes(keyNorm) || keyNorm.includes(normalized))
      return val;
  }
  return null;
}
