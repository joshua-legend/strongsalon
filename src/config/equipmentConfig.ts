import type { TierRow } from "./abilityConfig";

export interface EquipmentItem {
  id: string;
  name: string;
  targetMuscle?: string;
  isAssist?: boolean;
}

// ── 하체 (Lower Body) ──
export const LOWER_EQUIPMENT: EquipmentItem[] = [
  { id: "legpress", name: "파워 레그프레스", targetMuscle: "대퇴사두, 둔근, 햄스트링" },
  { id: "squat", name: "퍼팩트 스쿼트", targetMuscle: "대퇴사두, 둔근, 코어" },
  { id: "legext", name: "레그 익스텐션", targetMuscle: "대퇴사두 (전면)" },
  { id: "lyingcurl", name: "라잉 레그컬", targetMuscle: "햄스트링 (후면)" },
  { id: "seatedcurl", name: "시티드 레그컬", targetMuscle: "햄스트링 (후면)" },
  { id: "innerthigh", name: "이너타이", targetMuscle: "내전근 (내측)" },
  { id: "outerthigh", name: "아웃타이", targetMuscle: "외전근 (외측)" },
];

// ── 상체 푸쉬 (Upper Push) ──
export const UPPER_PUSH_EQUIPMENT: EquipmentItem[] = [
  { id: "chestpress", name: "체스트프레스", targetMuscle: "대흉근, 삼두" },
  { id: "incline", name: "인클라인프레스", targetMuscle: "상부 대흉근, 전면 삼각근" },
  { id: "standchest", name: "스탠딩 체스트프레스", targetMuscle: "대흉근, 코어" },
  { id: "shoulderpress", name: "숄더프레스", targetMuscle: "삼각근, 삼두" },
  { id: "dipstand", name: "어시스트 딥스 (스탠딩)", isAssist: true },
  { id: "dipkneel", name: "어시스트 딥스 (닐링)", isAssist: true },
  { id: "pecfly", name: "팩덱 플라이", targetMuscle: "대흉근 내측" },
];

// ── 상체 풀 (Upper Pull) ──
export const UPPER_PULL_EQUIPMENT: EquipmentItem[] = [
  { id: "latpull", name: "랫풀다운", targetMuscle: "광배근, 이두" },
  { id: "seatedrow", name: "시티드로우", targetMuscle: "승모근, 능형근, 이두" },
  { id: "longpull", name: "롱풀", targetMuscle: "광배근, 후면 삼각근" },
  { id: "tbarrow", name: "티바로우", targetMuscle: "광배근, 승모근" },
  { id: "pullupstand", name: "어시스트 풀업 (스탠딩)", isAssist: true },
  { id: "pullupkneel", name: "어시스트 풀업 (닐링)", isAssist: true },
  { id: "reversefly", name: "리버스 플라이", targetMuscle: "후면 삼각근, 승모근" },
];

// ── 티어 테이블: 체중 대비 1RM 비율 → 점수 ──

/** 레그프레스 기준 (하체근력) */
export const LEGPRESS_TIERS: TierRow[] = [
  { min: 3.0, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 2.5, max: 2.99, scoreMin: 80, scoreMax: 99 },
  { min: 2.0, max: 2.49, scoreMin: 60, scoreMax: 79 },
  { min: 1.5, max: 1.99, scoreMin: 40, scoreMax: 59 },
  { min: 1.0, max: 1.49, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.99, scoreMin: 0, scoreMax: 19 },
];

/** 스쿼트 기준 (하체근력) */
export const SQUAT_TIERS: TierRow[] = [
  { min: 2.0, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 1.5, max: 1.99, scoreMin: 80, scoreMax: 99 },
  { min: 1.2, max: 1.49, scoreMin: 60, scoreMax: 79 },
  { min: 0.8, max: 1.19, scoreMin: 40, scoreMax: 59 },
  { min: 0.5, max: 0.79, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.49, scoreMin: 0, scoreMax: 19 },
];

/** 체스트프레스 기준 (상체푸쉬) */
export const CHESTPRESS_TIERS: TierRow[] = [
  { min: 1.5, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 1.2, max: 1.49, scoreMin: 80, scoreMax: 99 },
  { min: 1.0, max: 1.19, scoreMin: 60, scoreMax: 79 },
  { min: 0.7, max: 0.99, scoreMin: 40, scoreMax: 59 },
  { min: 0.4, max: 0.69, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.39, scoreMin: 0, scoreMax: 19 },
];

/** 숄더프레스 기준 (상체푸쉬) */
export const SHOULDERPRESS_TIERS: TierRow[] = [
  { min: 1.0, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 0.8, max: 0.99, scoreMin: 80, scoreMax: 99 },
  { min: 0.6, max: 0.79, scoreMin: 60, scoreMax: 79 },
  { min: 0.45, max: 0.59, scoreMin: 40, scoreMax: 59 },
  { min: 0.3, max: 0.44, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.29, scoreMin: 0, scoreMax: 19 },
];

/** 인클라인프레스 기준 (상체푸쉬) */
export const INCLINE_TIERS: TierRow[] = [
  { min: 1.3, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 1.0, max: 1.29, scoreMin: 80, scoreMax: 99 },
  { min: 0.8, max: 0.99, scoreMin: 60, scoreMax: 79 },
  { min: 0.6, max: 0.79, scoreMin: 40, scoreMax: 59 },
  { min: 0.35, max: 0.59, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.34, scoreMin: 0, scoreMax: 19 },
];

/** 랫풀다운 기준 (상체풀) */
export const LATPULL_TIERS: TierRow[] = [
  { min: 1.3, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 1.1, max: 1.29, scoreMin: 80, scoreMax: 99 },
  { min: 0.85, max: 1.09, scoreMin: 60, scoreMax: 79 },
  { min: 0.65, max: 0.84, scoreMin: 40, scoreMax: 59 },
  { min: 0.4, max: 0.64, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.39, scoreMin: 0, scoreMax: 19 },
];

/** 풀업(어시스트) 기준 (상체풀) */
export const PULLUP_TIERS: TierRow[] = [
  { min: 1.2, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 1.0, max: 1.19, scoreMin: 80, scoreMax: 99 },
  { min: 0.8, max: 0.99, scoreMin: 60, scoreMax: 79 },
  { min: 0.6, max: 0.79, scoreMin: 40, scoreMax: 59 },
  { min: 0.3, max: 0.59, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.29, scoreMin: 0, scoreMax: 19 },
];

/** 시티드로우 기준 (상체풀) */
export const SEATEDROW_TIERS: TierRow[] = [
  { min: 1.2, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 1.0, max: 1.19, scoreMin: 80, scoreMax: 99 },
  { min: 0.8, max: 0.99, scoreMin: 60, scoreMax: 79 },
  { min: 0.6, max: 0.79, scoreMin: 40, scoreMax: 59 },
  { min: 0.35, max: 0.59, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 0.34, scoreMin: 0, scoreMax: 19 },
];

// ── 근지구력: 기구별 체중 비율 & 횟수 티어 ──

/** 체스트프레스/랫풀다운 (체중 50%) 기준 */
export const ENDURANCE_CHEST_LAT_TIERS: TierRow[] = [
  { min: 30, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 22, max: 29, scoreMin: 80, scoreMax: 99 },
  { min: 15, max: 21, scoreMin: 60, scoreMax: 79 },
  { min: 10, max: 14, scoreMin: 40, scoreMax: 59 },
  { min: 5, max: 9, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 4, scoreMin: 0, scoreMax: 19 },
];

/** 레그프레스 (체중 100%) 기준 */
export const ENDURANCE_LEGPRESS_TIERS: TierRow[] = [
  { min: 35, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 25, max: 34, scoreMin: 80, scoreMax: 99 },
  { min: 18, max: 24, scoreMin: 60, scoreMax: 79 },
  { min: 12, max: 17, scoreMin: 40, scoreMax: 59 },
  { min: 6, max: 11, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 5, scoreMin: 0, scoreMax: 19 },
];

/** 숄더프레스 (체중 35%) 기준 */
export const ENDURANCE_SHOULDERPRESS_TIERS: TierRow[] = [
  { min: 25, max: 999, scoreMin: 100, scoreMax: 100 },
  { min: 18, max: 24, scoreMin: 80, scoreMax: 99 },
  { min: 12, max: 17, scoreMin: 60, scoreMax: 79 },
  { min: 8, max: 11, scoreMin: 40, scoreMax: 59 },
  { min: 4, max: 7, scoreMin: 20, scoreMax: 39 },
  { min: 0, max: 3, scoreMin: 0, scoreMax: 19 },
];

export const ENDURANCE_EQUIPMENT_CONFIG: Record<
  string,
  { weightRatio: number; tiers: TierRow[] }
> = {
  chestpress: { weightRatio: 0.5, tiers: ENDURANCE_CHEST_LAT_TIERS },
  latpull: { weightRatio: 0.5, tiers: ENDURANCE_CHEST_LAT_TIERS },
  legpress: { weightRatio: 1.0, tiers: ENDURANCE_LEGPRESS_TIERS },
  shoulderpress: { weightRatio: 0.35, tiers: ENDURANCE_SHOULDERPRESS_TIERS },
};

export const LOWER_STRENGTH_EQUIPMENT: EquipmentItem[] = [
  { id: "legpress", name: "파워레그프레스" },
  { id: "squat", name: "퍼팩트스쿼트" },
];

export const UPPER_PUSH_SELECT_EQUIPMENT: EquipmentItem[] = [
  { id: "chestpress", name: "체스트프레스" },
  { id: "shoulderpress", name: "숄더프레스" },
  { id: "incline", name: "인클라인프레스" },
];

export const UPPER_PULL_SELECT_EQUIPMENT: EquipmentItem[] = [
  { id: "latpull", name: "랫풀다운" },
  { id: "seatedrow", name: "시티드로우" },
  { id: "pullupstand", name: "어시스트 풀업 (스탠딩)", isAssist: true },
  { id: "pullupkneel", name: "어시스트 풀업 (닐링)", isAssist: true },
];

export const ENDURANCE_SELECT_EQUIPMENT: EquipmentItem[] = [
  { id: "chestpress", name: "체스트프레스" },
  { id: "latpull", name: "랫풀다운" },
  { id: "legpress", name: "레그프레스" },
  { id: "shoulderpress", name: "숄더프레스" },
];

export const UPPER_PULL_ASSIST_IDS = ["pullupstand", "pullupkneel"];
export const UPPER_PUSH_ASSIST_IDS = ["dipstand", "dipkneel"];

export function getTiersForEquipment(
  category: "lowerStrength" | "upperPush" | "upperPull",
  equipmentId: string
): TierRow[] {
  if (category === "lowerStrength") {
    return equipmentId === "squat" ? SQUAT_TIERS : LEGPRESS_TIERS;
  }
  if (category === "upperPush") {
    if (equipmentId === "shoulderpress") return SHOULDERPRESS_TIERS;
    if (equipmentId === "incline") return INCLINE_TIERS;
    return CHESTPRESS_TIERS;
  }
  if (category === "upperPull") {
    if (equipmentId === "seatedrow") return SEATEDROW_TIERS;
    if (equipmentId === "pullupstand" || equipmentId === "pullupkneel")
      return PULLUP_TIERS;
    return LATPULL_TIERS;
  }
  return LATPULL_TIERS;
}
