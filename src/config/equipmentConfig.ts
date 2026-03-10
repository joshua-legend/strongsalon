import type { TierRow } from "./abilityConfig";
import {
  LEGPRESS_TIERS,
  SQUAT_TIERS,
  CHESTPRESS_TIERS,
  SHOULDERPRESS_TIERS,
  INCLINE_TIERS,
  LATPULL_TIERS,
  PULLUP_TIERS,
  SEATEDROW_TIERS,
  ENDURANCE_CHEST_LAT_TIERS,
  ENDURANCE_LEGPRESS_TIERS,
  ENDURANCE_SHOULDERPRESS_TIERS,
} from "@/data/tierTables";

export interface EquipmentItem {
  id: string;
  name: string;
  targetMuscle?: string;
  isAssist?: boolean;
  complexityLabel?: "복합" | "단일";
}

// ── 하체 (Lower Body) ──
export const LOWER_EQUIPMENT: EquipmentItem[] = [
  { id: "legpress", name: "파워 레그프레스", targetMuscle: "대퇴사두, 둔근, 햄스트링", complexityLabel: "복합" },
  { id: "squat", name: "퍼팩트 스쿼트", targetMuscle: "대퇴사두, 둔근, 코어", complexityLabel: "복합" },
  { id: "legext", name: "레그 익스텐션", targetMuscle: "대퇴사두 (전면)", complexityLabel: "단일" },
  { id: "lyingcurl", name: "라잉 레그컬", targetMuscle: "햄스트링 (후면)", complexityLabel: "단일" },
  { id: "seatedcurl", name: "시티드 레그컬", targetMuscle: "햄스트링 (후면)", complexityLabel: "단일" },
  { id: "innerthigh", name: "이너타이", targetMuscle: "내전근 (내측)", complexityLabel: "단일" },
  { id: "outerthigh", name: "아웃타이", targetMuscle: "외전근 (외측)", complexityLabel: "단일" },
];

// ── 상체 푸쉬 (Upper Push) ──
export const UPPER_PUSH_EQUIPMENT: EquipmentItem[] = [
  { id: "chestpress", name: "체스트프레스", targetMuscle: "대흉근, 삼두", complexityLabel: "복합" },
  { id: "incline", name: "인클라인프레스", targetMuscle: "상부 대흉근, 전면 삼각근", complexityLabel: "복합" },
  { id: "standchest", name: "스탠딩 체스트프레스", targetMuscle: "대흉근, 코어", complexityLabel: "복합" },
  { id: "shoulderpress", name: "숄더프레스", targetMuscle: "삼각근, 삼두", complexityLabel: "복합" },
  { id: "dipstand", name: "어시스트 딥스 (스탠딩)", isAssist: true, complexityLabel: "복합" },
  { id: "dipkneel", name: "어시스트 딥스 (닐링)", isAssist: true, complexityLabel: "복합" },
  { id: "pecfly", name: "팩덱 플라이", targetMuscle: "대흉근 내측", complexityLabel: "단일" },
];

// ── 상체 풀 (Upper Pull) ──
export const UPPER_PULL_EQUIPMENT: EquipmentItem[] = [
  { id: "latpull", name: "랫풀다운", targetMuscle: "광배근, 이두", complexityLabel: "복합" },
  { id: "seatedrow", name: "시티드로우", targetMuscle: "승모근, 능형근, 이두", complexityLabel: "복합" },
  { id: "longpull", name: "롱풀", targetMuscle: "광배근, 후면 삼각근", complexityLabel: "복합" },
  { id: "tbarrow", name: "티바로우", targetMuscle: "광배근, 승모근", complexityLabel: "복합" },
  { id: "pullupstand", name: "어시스트 풀업 (스탠딩)", isAssist: true, complexityLabel: "복합" },
  { id: "pullupkneel", name: "어시스트 풀업 (닐링)", isAssist: true, complexityLabel: "복합" },
  { id: "reversefly", name: "리버스 플라이", targetMuscle: "후면 삼각근, 승모근", complexityLabel: "단일" },
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
