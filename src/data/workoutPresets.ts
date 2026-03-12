/**
 * 추천 모드용 분할 프리셋 및 종목별 3대 비율표
 * 친구네 헬스장 기구 기준
 */

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
