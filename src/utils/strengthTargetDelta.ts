import type { Experience } from "@/types/profile";

/** 훈련 수준별 4주 목표 증가량 (스트렝스 골트래커) */
export function get4WeekTargetDelta(
  experience: Experience,
  isTotal: boolean
): number {
  if (experience === "untrained") return isTotal ? 56 : 20;
  if (experience === "novice") return isTotal ? 44 : 16;
  if (experience === "intermediate") return isTotal ? 28 : 10;
  if (experience === "advanced") return isTotal ? 20 : 7;
  return isTotal ? 14 : 5; // elite
}

/** 훈련 수준별 주간 증가량 (온보딩 StrengthGoalInput 등) */
export function getWeeklyDelta(experience: Experience, isTotal: boolean): number {
  if (experience === "untrained") return isTotal ? 14 : 5;
  if (experience === "novice") return isTotal ? 11 : 4;
  if (experience === "intermediate") return isTotal ? 7 : 2.5;
  if (experience === "advanced") return isTotal ? 5 : 1.75;
  return isTotal ? 3.5 : 1.25; // elite
}
