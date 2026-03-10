/**
 * 살 빼기: 체지방률 메인 → 체중, 골격근량 산출
 * targetMuscleMassKg: 목표 골격근량 (미입력 시 주당 +0.05kg 유지)
 */
export interface DietAutoPaceResult {
  main: {
    metric: "fatPercent";
    start: number;
    target: number;
    weeklyDelta: number;
    estimatedWeeks: number;
  };
  auto: {
    weight: { start: number; target: number; weeklyDelta: number };
    muscleMass: { start: number; target: number; weeklyDelta: number };
  };
}

const TOTAL_WEEKS = 4;

export function generateDietAutoPaces(
  profileWeight: number,
  currentFatPct: number,
  currentMuscleMass: number,
  targetFatPct: number,
  targetMuscleMassKg?: number
): DietAutoPaceResult {
  const totalWeeks = TOTAL_WEEKS;
  const weeklyFatPctDelta = (targetFatPct - currentFatPct) / totalWeeks;

  const currentFatKg = profileWeight * (currentFatPct / 100);
  const targetFatKg = profileWeight * (targetFatPct / 100);
  const weeklyWeightDelta =
    (targetFatKg - currentFatKg) / totalWeeks;

  const muscleDelta = targetMuscleMassKg != null
    ? targetMuscleMassKg - currentMuscleMass
    : 0.05 * totalWeeks;
  const weeklyMuscleDelta = muscleDelta / totalWeeks;
  const targetWeight = Math.round(
    (profileWeight + weeklyWeightDelta * totalWeeks) * 10
  ) / 10;
  const targetMuscleMass = targetMuscleMassKg != null
    ? Math.round(targetMuscleMassKg * 10) / 10
    : Math.round(
        (currentMuscleMass + weeklyMuscleDelta * totalWeeks) * 10
      ) / 10;

  return {
    main: {
      metric: "fatPercent",
      start: currentFatPct,
      target: targetFatPct,
      weeklyDelta: Math.round(weeklyFatPctDelta * 100) / 100,
      estimatedWeeks: TOTAL_WEEKS,
    },
    auto: {
      weight: {
        start: profileWeight,
        target: targetWeight,
        weeklyDelta: Math.round(weeklyWeightDelta * 100) / 100,
      },
      muscleMass: {
        start: currentMuscleMass,
        target: targetMuscleMass,
        weeklyDelta: Math.round(weeklyMuscleDelta * 100) / 100,
      },
    },
  };
}
