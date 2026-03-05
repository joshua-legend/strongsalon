import type { TierRow } from "@/config/abilityConfig";

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
