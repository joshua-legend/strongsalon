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
  {
    label: string;
    emoji: string;
    tierNum: number;
    range: string;
    mascotDesc: string;
    nextLabel: string | null;
    nextPercent: number | null;
  }
> = {
  sloth: {
    label: "나무늘보",
    emoji: "🦥",
    tierNum: 1,
    range: "하위 20%",
    mascotDesc: "천천히, 꾸준히. 자신만의 페이스로 생태계를 탐험하는 여유로운 포식자.",
    nextLabel: "미어캣",
    nextPercent: 40,
  },
  meerkat: {
    label: "미어캣",
    emoji: "🐿️",
    tierNum: 2,
    range: "20~40%",
    mascotDesc: "경계하고 관찰하는. 팀워크와 꾸준한 노력으로 생존력을 높이는 전략가.",
    nextLabel: "가젤",
    nextPercent: 60,
  },
  gazelle: {
    label: "가젤",
    emoji: "🦌",
    tierNum: 3,
    range: "40~60%",
    mascotDesc: "민첩하고 유연한. 스피드와 지구력의 균형을 갖춘 중급 포식자.",
    nextLabel: "맹렬한 호랑이",
    nextPercent: 40,
  },
  tiger: {
    label: "맹렬한 호랑이",
    emoji: "🐯",
    tierNum: 4,
    range: "60~80%",
    mascotDesc:
      "헬스장의 짐승. 중량과 타협하지 않으며 실패 지점까지 자신을 몰아붙이는 전투광.",
    nextLabel: "압도적인 그리즐리",
    nextPercent: 5,
  },
  grizzly: {
    label: "압도적인 그리즐리",
    emoji: "🐻",
    tierNum: 5,
    range: "상위 20%",
    mascotDesc: "생태계의 정점. 압도적인 힘과 지구력으로 정상을 지키는 최강 포식자.",
    nextLabel: null,
    nextPercent: null,
  },
};

export function getNextTierInfo(
  tier: AnimalTier
): { label: string; percent: number } | null {
  const cfg = ANIMAL_TIER_CONFIG[tier];
  if (!cfg.nextLabel || cfg.nextPercent == null) return null;
  return { label: cfg.nextLabel, percent: cfg.nextPercent };
}
