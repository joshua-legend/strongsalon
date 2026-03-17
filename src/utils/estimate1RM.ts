/**
 * 1RM 추정: weight * (1 + reps/30)
 * reps=0 또는 weight=0 → 0, reps=1 → weight 그대로
 */
export function estimate1RM(weight: number, reps: number): number {
  if (reps === 0 || weight === 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/** 목표 1RM에 맞는 무게 계산 (2.5kg 단위 내림, 목표 초과 방지) */
export function weightForTarget1RM(target1RM: number, reps: number): number {
  if (reps === 0 || target1RM <= 0) return 0;
  if (reps === 1) return target1RM;
  const raw = target1RM / (1 + reps / 30);
  const step = 2.5;
  return Math.floor(raw / step) * step;
}
