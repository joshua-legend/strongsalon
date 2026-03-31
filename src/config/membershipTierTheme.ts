export type MembershipTier =
  | "rookie"
  | "amateur"
  | "semiPro"
  | "pro"
  | "national"
  | "worldClass"
  | "goat";

export interface TierTheme {
  id: MembershipTier;
  label: string;
  cardName: string;
  emoji: string;
  koreanName: string;
  displayLabel: string;
  color: string;
  softBg: string;
  gradient: string;
  borderColor: string;
  scoreMin: number;
  scoreMax: number;
  topPercent: number;
  comment: string;
}

export const MEMBERSHIP_TIERS: TierTheme[] = [
  {
    id: "rookie",
    label: "ROOKIE",
    cardName: "ROOKIE",
    emoji: "🤸",
    koreanName: "루키",
    displayLabel: "🤸 ROOKIE (루키)",
    color: "#7b808c",
    softBg: "rgba(123, 128, 140, 0.16)",
    gradient: "linear-gradient(135deg, #1b1f25 0%, #12151a 100%)",
    borderColor: "rgba(123, 128, 140, 0.3)",
    scoreMin: 0,
    scoreMax: 19,
    topPercent: 100,
    comment: "운동을 시작했다는 것 자체가 이미 대단합니다.",
  },
  {
    id: "amateur",
    label: "AMATEUR",
    cardName: "AMATEUR",
    emoji: "🏃",
    koreanName: "아마추어",
    displayLabel: "🏃 AMATEUR (아마추어)",
    color: "#a88566",
    softBg: "rgba(168, 133, 102, 0.18)",
    gradient: "linear-gradient(135deg, #291f19 0%, #1a1410 100%)",
    borderColor: "rgba(168, 133, 102, 0.32)",
    scoreMin: 20,
    scoreMax: 34,
    topPercent: 90,
    comment: "꾸준히 하면 반드시 올라갑니다. 루틴이 답입니다.",
  },
  {
    id: "semiPro",
    label: "SEMI-PRO",
    cardName: "SEMI-PRO",
    emoji: "🥈",
    koreanName: "세미프로",
    displayLabel: "🥈 SEMI-PRO (세미프로)",
    color: "#b9c0ca",
    softBg: "rgba(185, 192, 202, 0.18)",
    gradient: "linear-gradient(135deg, #232830 0%, #171b21 100%)",
    borderColor: "rgba(185, 192, 202, 0.32)",
    scoreMin: 35,
    scoreMax: 49,
    topPercent: 75,
    comment: "일반인 상위 25%. 지역 대회에 나가도 부끄럽지 않은 몸입니다.",
  },
  {
    id: "pro",
    label: "PRO",
    cardName: "PRO",
    emoji: "🏅",
    koreanName: "프로",
    displayLabel: "🏅 PRO (프로)",
    color: "#d2b06b",
    softBg: "rgba(210, 176, 107, 0.2)",
    gradient: "linear-gradient(135deg, #2c2415 0%, #1d170d 100%)",
    borderColor: "rgba(210, 176, 107, 0.34)",
    scoreMin: 50,
    scoreMax: 64,
    topPercent: 50,
    comment: "평균을 크게 웃돕니다. 이 수준의 사람은 주변에 많지 않습니다.",
  },
  {
    id: "national",
    label: "NATIONAL",
    cardName: "NATIONAL",
    emoji: "🇰🇷",
    koreanName: "국가대표",
    displayLabel: "🇰🇷 NATIONAL (국가대표)",
    color: "#9fb8d9",
    softBg: "rgba(159, 184, 217, 0.2)",
    gradient: "linear-gradient(135deg, #1a2431 0%, #111821 100%)",
    borderColor: "rgba(159, 184, 217, 0.34)",
    scoreMin: 65,
    scoreMax: 79,
    topPercent: 25,
    comment: "국내 최상위권. 운동을 진지하게 해온 사람만 도달할 수 있습니다.",
  },
  {
    id: "worldClass",
    label: "WORLD CLASS",
    cardName: "WORLD CLASS",
    emoji: "🌍",
    koreanName: "세계급",
    displayLabel: "🌍 WORLD CLASS (세계급)",
    color: "#66b6a4",
    softBg: "rgba(102, 182, 164, 0.2)",
    gradient: "linear-gradient(135deg, #142621 0%, #0d1a16 100%)",
    borderColor: "rgba(102, 182, 164, 0.34)",
    scoreMin: 80,
    scoreMax: 89,
    topPercent: 10,
    comment: "세계 무대를 논할 수 있는 수준. 극소수만 존재합니다.",
  },
  {
    id: "goat",
    label: "GOAT",
    cardName: "GOAT",
    emoji: "🏆",
    koreanName: "고트",
    displayLabel: "🏆 GOAT (고트)",
    color: "#f0cf7a",
    softBg: "rgba(240, 207, 122, 0.24)",
    gradient: "linear-gradient(135deg, #382b14 0%, #261d0d 100%)",
    borderColor: "rgba(240, 207, 122, 0.38)",
    scoreMin: 90,
    scoreMax: 100,
    topPercent: 3,
    comment: "기록에 남을 몸입니다. 당신은 전설입니다.",
  },
];

export const DEFAULT_MEMBERSHIP_TIER: MembershipTier = "rookie";
export const MEMBERSHIP_TIER_STORAGE_KEY = "fitlog-membership-tier";

export function isMembershipTier(value: string): value is MembershipTier {
  return MEMBERSHIP_TIERS.some((tier) => tier.id === value);
}

export function getTierTheme(tier: MembershipTier): TierTheme {
  return (
    MEMBERSHIP_TIERS.find((item) => item.id === tier) ??
    MEMBERSHIP_TIERS[0]
  );
}

export function getTierFromScore(score: number): TierTheme {
  const rounded = Math.max(0, Math.min(100, Math.round(score)));
  for (let index = MEMBERSHIP_TIERS.length - 1; index >= 0; index -= 1) {
    const tier = MEMBERSHIP_TIERS[index];
    if (rounded >= tier.scoreMin) {
      return tier;
    }
  }
  return MEMBERSHIP_TIERS[0];
}
