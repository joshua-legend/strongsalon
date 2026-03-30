export type MembershipTier = "standard" | "advanced" | "pro" | "elite" | "strong";

export interface TierTheme {
  id: MembershipTier;
  label: string;
  cardName: string;
  color: string;
  softBg: string;
  gradient: string;
  borderColor: string;
}

export const MEMBERSHIP_TIERS: TierTheme[] = [
  {
    id: "standard",
    label: "STANDARD",
    cardName: "Standard",
    color: "#94a3b8",
    softBg: "rgba(148, 163, 184, 0.18)",
    gradient: "linear-gradient(135deg, #151b24 0%, #0f1520 100%)",
    borderColor: "rgba(148, 163, 184, 0.32)",
  },
  {
    id: "advanced",
    label: "ADVANCED",
    cardName: "Advanced",
    color: "#9eafc7",
    softBg: "rgba(158, 175, 199, 0.18)",
    gradient: "linear-gradient(135deg, #151b25 0%, #1b2433 100%)",
    borderColor: "rgba(158, 175, 199, 0.34)",
  },
  {
    id: "pro",
    label: "PRO",
    cardName: "Pro",
    color: "#c48f79",
    softBg: "rgba(196, 143, 121, 0.2)",
    gradient: "linear-gradient(135deg, #1c1717 0%, #2a1f1d 100%)",
    borderColor: "rgba(196, 143, 121, 0.34)",
  },
  {
    id: "elite",
    label: "ELITE",
    cardName: "Elite",
    color: "#d2a158",
    softBg: "rgba(210, 161, 88, 0.22)",
    gradient: "linear-gradient(135deg, #1c1815 0%, #312518 100%)",
    borderColor: "rgba(210, 161, 88, 0.36)",
  },
  {
    id: "strong",
    label: "THE STRONG",
    cardName: "The Strong",
    color: "#d4af37",
    softBg: "rgba(212, 175, 55, 0.2)",
    gradient: "linear-gradient(135deg, #1a1917 0%, #2e2618 100%)",
    borderColor: "rgba(212, 175, 55, 0.36)",
  },
];

export const DEFAULT_MEMBERSHIP_TIER: MembershipTier = "strong";
export const MEMBERSHIP_TIER_STORAGE_KEY = "fitlog-membership-tier";

export function isMembershipTier(value: string): value is MembershipTier {
  return MEMBERSHIP_TIERS.some((tier) => tier.id === value);
}

export function getTierTheme(tier: MembershipTier): TierTheme {
  return (
    MEMBERSHIP_TIERS.find((item) => item.id === tier) ??
    MEMBERSHIP_TIERS[MEMBERSHIP_TIERS.length - 1]
  );
}
