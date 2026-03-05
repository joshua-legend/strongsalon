import { useMemo } from "react";
import { estimate1RM } from "@/utils/scoring";
import { calcBalanceScore, getGrade } from "@/config/abilityConfig";

interface BalanceInputs {
  qw: number; qr: number;
  hw: number; hr: number;
  iw: number; ir: number;
  ow: number; or: number;
}

export function useBalanceCalc({ qw, qr, hw, hr, iw, ir, ow, or: _or }: BalanceInputs) {
  const quad1RM = useMemo(() => (qr > 0 ? estimate1RM(qw, qr) : 0), [qw, qr]);
  const ham1RM = useMemo(() => (hr > 0 ? estimate1RM(hw, hr) : 0), [hw, hr]);
  const inner1RM = useMemo(() => (ir > 0 ? estimate1RM(iw, ir) : 0), [iw, ir]);
  const outer1RM = useMemo(() => (_or > 0 ? estimate1RM(ow, _or) : 0), [ow, _or]);

  const frontBackRatio = useMemo(() => {
    if (quad1RM <= 0) return 0;
    return Math.round((ham1RM / quad1RM) * 100);
  }, [quad1RM, ham1RM]);

  const innerOuterRatio = useMemo(() => {
    if (outer1RM <= 0) return 0;
    return Math.round((inner1RM / outer1RM) * 100);
  }, [inner1RM, outer1RM]);

  const frontBackScore = useMemo(() => calcBalanceScore(frontBackRatio, 60, 80), [frontBackRatio]);
  const innerOuterScore = useMemo(() => calcBalanceScore(innerOuterRatio, 80, 100), [innerOuterRatio]);

  const totalScore = frontBackScore + innerOuterScore;
  const grade = getGrade(totalScore);

  const frontBackDiagnosis =
    frontBackRatio >= 60 && frontBackRatio <= 80
      ? "✓ 균형"
      : frontBackRatio < 60
      ? "⚠ 후면(햄스트링) 약화 — 레그컬 보강 추천"
      : "⚠ 전면(대퇴사두) 약화";

  const innerOuterDiagnosis =
    innerOuterRatio >= 80 && innerOuterRatio <= 100
      ? "✓ 균형"
      : innerOuterRatio < 80
      ? "⚠ 내전근 약화 — 이너타이 보강 추천"
      : "⚠ 외전근 약화";

  return {
    quad1RM, ham1RM, inner1RM, outer1RM,
    frontBackRatio, innerOuterRatio,
    frontBackScore, innerOuterScore,
    totalScore, grade,
    frontBackDiagnosis, innerOuterDiagnosis,
  };
}
