/**
 * 1RM 추정: weight * (1 + reps/30)
 * reps=0 또는 weight=0 → 0, reps=1 → weight 그대로
 */
export function estimate1RM(weight: number, reps: number): number {
  if (reps === 0 || weight === 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
