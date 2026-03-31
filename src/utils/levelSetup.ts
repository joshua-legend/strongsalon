import type { CategorySettings } from "@/types/categorySettings";

export function isLevelSetupComplete(categorySettings: CategorySettings): boolean {
  const inbody = categorySettings.inbody.startValues ?? {};
  const strength = categorySettings.strength.startValues ?? {};
  const fitness = categorySettings.fitness.startValues ?? {};

  const hasInbody =
    categorySettings.inbody.isConfigured &&
    Number(inbody.weight ?? 0) > 0 &&
    Number(inbody.fatPercent ?? 0) > 0 &&
    Number(inbody.muscleMass ?? 0) > 0;

  const hasStrength =
    categorySettings.strength.isConfigured &&
    Number(strength.squat ?? 0) > 0 &&
    Number(strength.bench ?? 0) > 0 &&
    Number(strength.deadlift ?? 0) > 0;

  const hasFitness =
    categorySettings.fitness.isConfigured &&
    (Number(fitness.running ?? 0) > 0 ||
      Number(fitness.rowing ?? 0) > 0 ||
      Number(fitness.skierg ?? 0) > 0);

  return hasInbody && hasStrength && hasFitness;
}

