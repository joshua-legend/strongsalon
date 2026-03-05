"use client";

import type { AbilityResult, StrengthAbilityResult, BalanceAbilityResult, EnduranceAbilityResult } from "@/types";
import type { AbilityCategory } from "@/config/abilityConfig";
import StrengthResultView from "./StrengthResultView";
import BalanceResultView from "./BalanceResultView";
import EnduranceResultView from "./EnduranceResultView";

interface TestResultProps {
  category: AbilityCategory;
  result: AbilityResult;
  prevResult: AbilityResult | null;
  onConfirm: () => void;
  onRetry: () => void;
}

export default function TestResult({ category, result, prevResult, onConfirm, onRetry }: TestResultProps) {
  if ("estimated1RM" in result && "bodyweightRatio" in result) {
    return (
      <StrengthResultView
        category={category}
        result={result as StrengthAbilityResult}
        prevResult={prevResult as StrengthAbilityResult | null}
        onConfirm={onConfirm}
        onRetry={onRetry}
      />
    );
  }
  if ("frontBackRatio" in result && "innerOuterRatio" in result) {
    return (
      <BalanceResultView
        category={category}
        result={result as BalanceAbilityResult}
        onConfirm={onConfirm}
        onRetry={onRetry}
      />
    );
  }
  if ("testWeight" in result && "reps" in result) {
    return (
      <EnduranceResultView
        category={category}
        result={result as EnduranceAbilityResult}
        prevResult={prevResult as EnduranceAbilityResult | null}
        onConfirm={onConfirm}
        onRetry={onRetry}
      />
    );
  }
  return null;
}
