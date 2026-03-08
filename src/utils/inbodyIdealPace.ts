import type { InbodyGoal, InbodyMetricKey } from "@/types/quest";

export interface InbodyCurrentValues {
  weight: number;
  muscleMass: number;
  fatPercent: number;
}

const AUTO_PACE_RATIOS = {
  weight: {
    fatPercent: {
      calc: (
        weeklyDelta: number,
        currentWeight: number,
        currentFatPct: number
      ): number => {
        const fatLossKg = weeklyDelta * 0.8;
        const currentFatKg = currentWeight * (currentFatPct / 100);
        const newFatKg = currentFatKg + fatLossKg;
        const newWeight = currentWeight + weeklyDelta;
        const newFatPct = newWeight > 0 ? (newFatKg / newWeight) * 100 : currentFatPct;
        return newFatPct - currentFatPct;
      },
    },
    muscleMass: {
      calc: (weeklyDelta: number): number => {
        if (weeklyDelta < 0) return 0.05;
        return weeklyDelta * 0.3;
      },
    },
  },
  muscleMass: {
    weight: {
      calc: (weeklyDelta: number): number => weeklyDelta * 1.3,
    },
    fatPercent: {
      calc: (weeklyDelta: number): number => {
        if (weeklyDelta > 0) return 0.1;
        return -0.3;
      },
    },
  },
  fatPercent: {
    weight: {
      calc: (weeklyDelta: number, currentWeight: number): number =>
        weeklyDelta * currentWeight * 0.01 * 0.8,
    },
    muscleMass: {
      calc: (): number => 0.05,
    },
  },
} as const;

export function generateIdealPaces(
  mainMetric: InbodyMetricKey,
  currentValues: InbodyCurrentValues,
  targetValue: number,
  weeklyDelta: number
): InbodyGoal {
  const totalWeeks = Math.ceil(
    Math.abs(targetValue - currentValues[mainMetric]) / Math.abs(weeklyDelta)
  ) || 1;

  const paces: Record<InbodyMetricKey, { start: number; target: number; weeklyDelta: number; isMain: boolean }> = {
    [mainMetric]: {
      start: currentValues[mainMetric],
      target: targetValue,
      weeklyDelta,
      isMain: true,
    },
  };

  const otherMetrics: InbodyMetricKey[] = ["weight", "muscleMass", "fatPercent"].filter(
    (m): m is InbodyMetricKey => m !== mainMetric
  );

  otherMetrics.forEach((metric) => {
    let autoWeeklyDelta: number;
    if (mainMetric === "weight") {
      if (metric === "fatPercent") {
        autoWeeklyDelta = AUTO_PACE_RATIOS.weight.fatPercent.calc(
          weeklyDelta,
          currentValues.weight,
          currentValues.fatPercent
        );
      } else {
        autoWeeklyDelta = AUTO_PACE_RATIOS.weight.muscleMass.calc(weeklyDelta);
      }
    } else if (mainMetric === "muscleMass") {
      if (metric === "weight") {
        autoWeeklyDelta = AUTO_PACE_RATIOS.muscleMass.weight.calc(weeklyDelta);
      } else {
        autoWeeklyDelta = AUTO_PACE_RATIOS.muscleMass.fatPercent.calc(weeklyDelta);
      }
    } else {
      if (metric === "weight") {
        autoWeeklyDelta = AUTO_PACE_RATIOS.fatPercent.weight.calc(
          weeklyDelta,
          currentValues.weight
        );
      } else {
        autoWeeklyDelta = AUTO_PACE_RATIOS.fatPercent.muscleMass.calc();
      }
    }
    const target =
      Math.round((currentValues[metric] + autoWeeklyDelta * totalWeeks) * 10) / 10;
    paces[metric] = {
      start: currentValues[metric],
      target,
      weeklyDelta: Math.round(autoWeeklyDelta * 100) / 100,
      isMain: false,
    };
  });

  return { mainMetric, paces };
}
