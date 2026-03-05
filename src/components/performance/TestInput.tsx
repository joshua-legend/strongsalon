"use client";

import type { AbilityCategory } from "@/config/abilityConfig";
import type {
  StrengthAbilityResult,
  BalanceAbilityResult,
  EnduranceAbilityResult,
} from "@/types";
import {
  LOWER_STRENGTH_EQUIPMENT,
  UPPER_PUSH_SELECT_EQUIPMENT,
  UPPER_PULL_SELECT_EQUIPMENT,
  ENDURANCE_SELECT_EQUIPMENT,
} from "@/config/equipmentConfig";
import MaxWeightInput from "./MaxWeightInput";
import BalanceInput from "./BalanceInput";
import RepOutInput from "./RepOutInput";

type AbilityResult =
  | StrengthAbilityResult
  | BalanceAbilityResult
  | EnduranceAbilityResult;

interface TestInputProps {
  category: AbilityCategory;
  bodyweight: number;
  onComplete: (result: AbilityResult) => void;
  onBack: () => void;
}

export default function TestInput({
  category,
  bodyweight,
  onComplete,
  onBack,
}: TestInputProps) {
  if (category.testType === "maxWeight") {
    const equipment =
      category.id === "lowerStrength"
        ? LOWER_STRENGTH_EQUIPMENT
        : category.id === "upperPush"
        ? UPPER_PUSH_SELECT_EQUIPMENT
        : UPPER_PULL_SELECT_EQUIPMENT;
    return (
      <MaxWeightInput
        category={category}
        equipmentOptions={equipment}
        bodyweight={bodyweight}
        onComplete={(r) => onComplete(r)}
        onBack={onBack}
      />
    );
  }

  if (category.testType === "balance") {
    return (
      <BalanceInput
        category={category}
        bodyweight={bodyweight}
        onComplete={(r) => onComplete(r)}
        onBack={onBack}
      />
    );
  }

  if (category.testType === "repOut") {
    return (
      <RepOutInput
        category={category}
        equipmentOptions={ENDURANCE_SELECT_EQUIPMENT}
        bodyweight={bodyweight}
        onComplete={(r) => onComplete(r)}
        onBack={onBack}
      />
    );
  }

  return null;
}
