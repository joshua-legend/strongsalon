import type { AnimalTier } from "@/types";

/** 상위 N% (0~100) → 동물 티어 매핑
 * 나무늘보(하위 20%), 미어캣(20~40%), 가젤(40~60%), 호랑이(60~80%), 그리즐리(상위 20%)
 */
export function getAnimalTierFromPercentile(percentile: number): AnimalTier {
  if (percentile >= 80) return "grizzly";
  if (percentile >= 60) return "tiger";
  if (percentile >= 40) return "gazelle";
  if (percentile >= 20) return "meerkat";
  return "sloth";
}

export const ANIMAL_TIER_CONFIG: Record<
  AnimalTier,
  { label: string; emoji: string; tierNum: number; range: string }
> = {
  sloth: {
    label: "나무늘보",
    emoji: "🦥",
    tierNum: 1,
    range: "하위 20%",
  },
  meerkat: {
    label: "미어캣",
    emoji: "🐿️",
    tierNum: 2,
    range: "20~40%",
  },
  gazelle: {
    label: "가젤",
    emoji: "🦌",
    tierNum: 3,
    range: "40~60%",
  },
  tiger: {
    label: "맹렬한 호랑이",
    emoji: "🐯",
    tierNum: 4,
    range: "60~80%",
  },
  grizzly: {
    label: "그리즐리",
    emoji: "🐻",
    tierNum: 5,
    range: "상위 20%",
  },
};
