/** 5대 능력치 (레이더 차트) */
export interface AbilityStats {
  strength: number;      // 근력
  endurance: number;    // 근지구력
  explosiveness: number; // 순발력
  cardio: number;       // 심폐지구력
  stability: number;   // 안정성
}

export type Grade = "S" | "A" | "B" | "C" | "D" | "F";

/** 1RM 기반 측정 결과 (하체근력, 상체푸쉬, 상체풀) */
export interface StrengthAbilityResult {
  score: number;
  grade: Grade;
  equipment: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  bodyweightRatio: number;
  isAssist?: boolean;
  date: string;
}

/** 하체 밸런스 측정 결과 */
export interface BalanceAbilityResult {
  score: number;
  grade: Grade;
  frontBackRatio: number;
  innerOuterRatio: number;
  frontBackScore: number;
  innerOuterScore: number;
  quad: { equipment: string; weight: number; reps: number; est1RM: number };
  ham: { equipment: string; weight: number; reps: number; est1RM: number };
  inner: { equipment: string; weight: number; reps: number; est1RM: number };
  outer: { equipment: string; weight: number; reps: number; est1RM: number };
  date: string;
}

/** 근지구력 측정 결과 */
export interface EnduranceAbilityResult {
  score: number;
  grade: Grade;
  equipment: string;
  testWeight: number;
  reps: number;
  date: string;
}

export type AbilityResult =
  | StrengthAbilityResult
  | BalanceAbilityResult
  | EnduranceAbilityResult;

export type AbilityResults = {
  lowerStrength: StrengthAbilityResult | null;
  upperPush: StrengthAbilityResult | null;
  upperPull: StrengthAbilityResult | null;
  lowerBalance: BalanceAbilityResult | null;
  endurance: EnduranceAbilityResult | null;
};
