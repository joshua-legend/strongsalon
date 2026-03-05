'use client';

import { useMemo } from "react";
import { estimate1RM } from "@/utils/scoring";

interface UseMaxWeightCalcParams {
  weightNum: number;
  repsNum: number;
  bodyweight: number;
  isAssist: boolean;
}

export function useMaxWeightCalc({ weightNum, repsNum, bodyweight, isAssist }: UseMaxWeightCalcParams) {
  const actualLoad = useMemo(() => {
    if (!isAssist) return weightNum;
    return Math.max(0, bodyweight - weightNum);
  }, [isAssist, bodyweight, weightNum]);

  const estimated1RM = useMemo(() => {
    if (repsNum === 0) return 0;
    return estimate1RM(actualLoad, repsNum);
  }, [actualLoad, repsNum]);

  const bodyweightRatio = useMemo(() => {
    if (bodyweight <= 0) return 0;
    return Math.round((estimated1RM / bodyweight) * 100) / 100;
  }, [estimated1RM, bodyweight]);

  const assistError =
    isAssist && weightNum >= bodyweight ? "보조 중량이 체중보다 큽니다" : null;

  return { actualLoad, estimated1RM, bodyweightRatio, assistError };
}
