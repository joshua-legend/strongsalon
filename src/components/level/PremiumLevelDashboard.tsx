"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Activity,
  Dumbbell,
  Fingerprint,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import UnifiedGoalCard from "@/components/home/UnifiedGoalCard";
import {
  usePremiumLevelDashboardModel,
  usePremiumLevelDashboardTotals,
} from "@/hooks/usePremiumLevelDashboardModel";
import {
  MEMBERSHIP_TIERS,
  type MembershipTier,
} from "@/config/membershipTierTheme";
import { useLevelTheme } from "@/context/LevelThemeContext";

type StatTab = "strength" | "stamina" | "inbody";

interface PremiumLevelDashboardProps {
  onOpenFullSetup?: () => void;
  hasGoalSetting: boolean;
  hasActiveQuest: boolean;
  isGoalReached: boolean;
}

interface StatSummaryModel {
  id: StatTab;
  label: string;
  icon: LucideIcon;
  grade: string;
  points: number;
  metricReady: boolean;
}

interface TrackingNotice {
  tone: "success" | "warning" | "info";
  label: string;
  message: string;
  ctaLabel?: string;
}

const BRAND_NAME = "STRONG SALON";

const TIER_POINT_BONUS: Record<MembershipTier, number> = {
  standard: -850,
  advanced: -350,
  pro: 150,
  elite: 520,
  strong: 0,
};

const STAT_ICONS: Record<StatTab, LucideIcon> = {
  strength: Dumbbell,
  stamina: HeartPulse,
  inbody: Activity,
};

function getGrade(points: number) {
  if (points >= 9600) return "MASTER";
  if (points >= 9200) return "ELITE";
  if (points >= 8600) return "PRO";
  if (points >= 7900) return "ADVANCED";
  return "STANDARD";
}

function getTrackingNotice({
  hasGoalSetting,
  hasActiveQuest,
  isGoalReached,
}: Pick<PremiumLevelDashboardProps, "hasGoalSetting" | "hasActiveQuest" | "isGoalReached">): TrackingNotice {
  if (!hasGoalSetting) {
    return {
      tone: "warning",
      label: "SETUP",
      message:
        "\uBAA9\uD45C \uC124\uC815\uC774 \uC5C6\uC5B4\uC694. \uCD94\uCC9C \uC124\uC815\uC73C\uB85C \uC2DC\uC791\uD574\uBCF4\uC138\uC694.",
      ctaLabel: "\uCD94\uCC9C \uC124\uC815",
    };
  }
  if (isGoalReached) {
    return {
      tone: "success",
      label: "COMPLETE",
      message:
        "\uBAA9\uD45C \uC0AC\uC774\uD074\uC744 \uC644\uB8CC\uD588\uC5B4\uC694. \uB2E4\uC74C \uBAA9\uD45C \uC124\uC815\uC73C\uB85C \uC774\uC5B4\uAC00\uC138\uC694.",
      ctaLabel: "\uB2E4\uC74C \uBAA9\uD45C",
    };
  }
  if (!hasActiveQuest) {
    return {
      tone: "info",
      label: "READY",
      message:
        "\uBAA9\uD45C\uB294 \uC900\uBE44\uB410\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uD2B8\uB798\uCEE4\uC5D0\uC11C \uCCAB \uAE30\uB85D\uC744 \uC785\uB825\uD574\uBCF4\uC138\uC694.",
    };
  }
  return {
    tone: "info",
    label: "TRACKING",
    message:
      "\uC9C4\uD589 \uC911 \uBAA9\uD45C\uB97C \uC544\uB798 \uD2B8\uB798\uCEE4\uC5D0\uC11C \uACC4\uC18D \uCD94\uC801\uD558\uC138\uC694.",
  };
}

function noticeToneStyle(tone: TrackingNotice["tone"], tierColor: string) {
  if (tone === "success") {
    return {
      backgroundColor: "rgba(34, 197, 94, 0.12)",
      borderColor: "rgba(34, 197, 94, 0.35)",
      labelColor: "#22c55e",
    };
  }
  if (tone === "warning") {
    return {
      backgroundColor: "rgba(249, 115, 22, 0.12)",
      borderColor: "rgba(249, 115, 22, 0.34)",
      labelColor: "#f97316",
    };
  }
  return {
    backgroundColor: `${tierColor}1A`,
    borderColor: `${tierColor}59`,
    labelColor: tierColor,
  };
}

export default function PremiumLevelDashboard({
  onOpenFullSetup,
  hasGoalSetting,
  hasActiveQuest,
  isGoalReached,
}: PremiumLevelDashboardProps) {
  const { selectedTier, setSelectedTier, activeTier } = useLevelTheme();
  const [selectedStatTab, setSelectedStatTab] = useState<StatTab>("strength");
  const pillars = usePremiumLevelDashboardModel();
  const { rankLabel } = usePremiumLevelDashboardTotals(pillars);

  const pointBonus = TIER_POINT_BONUS[selectedTier];

  const statSummaries: StatSummaryModel[] = useMemo(
    () =>
      pillars.map((pillar) => {
        const points = pillar.pillarPoints + pointBonus;
        return {
          id: pillar.id,
          label: pillar.label,
          icon: STAT_ICONS[pillar.id],
          points,
          grade: pillar.metricReady ? getGrade(points) : "SETUP",
          metricReady: pillar.metricReady,
        };
      }),
    [pillars, pointBonus]
  );

  const membershipTotalScore = useMemo(
    () => statSummaries.reduce((sum, stat) => sum + stat.points, 0),
    [statSummaries]
  );

  const notice = getTrackingNotice({
    hasGoalSetting,
    hasActiveQuest,
    isGoalReached,
  });
  const noticeStyle = noticeToneStyle(notice.tone, activeTier.color);
  const trackerMainTab = selectedStatTab === "stamina" ? "cardio" : selectedStatTab;
  const trackerThemeVars = useMemo(
    () =>
      ({
        "--accent-main": activeTier.color,
        "--accent-bg": activeTier.softBg,
        "--border-focus": activeTier.color,
        "--chart-line-lime": "var(--dynamic-theme-color)",
        "--chart-line-orange":
          "color-mix(in srgb, var(--dynamic-theme-color) 78%, #ffffff 22%)",
        "--chart-line-sky":
          "color-mix(in srgb, var(--dynamic-theme-color) 62%, #ffffff 38%)",
        "--chart-tab-lime-bg":
          "color-mix(in srgb, var(--dynamic-theme-color) 14%, transparent)",
        "--chart-tab-orange-bg":
          "color-mix(in srgb, var(--dynamic-theme-color) 18%, transparent)",
        "--chart-tab-sky-bg":
          "color-mix(in srgb, var(--dynamic-theme-color) 22%, transparent)",
        "--chart-tab-lime-border":
          "color-mix(in srgb, var(--dynamic-theme-color) 42%, transparent)",
        "--chart-tab-orange-border":
          "color-mix(in srgb, var(--dynamic-theme-color) 50%, transparent)",
        "--chart-tab-sky-border":
          "color-mix(in srgb, var(--dynamic-theme-color) 58%, transparent)",
      }) as CSSProperties,
    [activeTier.color, activeTier.softBg]
  );

  const rootVars = {
    "--dynamic-theme-color": activeTier.color,
    "--dynamic-theme-bg": activeTier.softBg,
  } as CSSProperties;

  return (
    <div id="tab-level" className="block flex-1 space-y-6 px-5 py-6" style={rootVars}>
      <div id="view-card" className="block space-y-4">
        <div className="custom-scrollbar flex gap-1.5 overflow-x-auto pb-2">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isActive = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                id={`btn-tier-${tier.id}`}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-all ${
                  isActive ? "shadow-sm" : ""
                }`}
                style={{
                  backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                  color: isActive ? "var(--text-main)" : "var(--text-sub)",
                  borderColor: isActive ? "var(--border-light)" : "transparent",
                }}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        <div
          id="membership-card"
          className="card-shine relative overflow-hidden rounded-[1.25rem] border p-6 shadow-2xl transition-all duration-700"
          style={{
            background: activeTier.gradient,
            borderColor: activeTier.borderColor,
          }}
        >
          <div className="iron-texture pointer-events-none absolute inset-0 opacity-[0.05]" />

          <div className="relative z-10 flex items-start justify-between">
            <span
              id="card-brand"
              className="text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-sm transition-colors duration-700"
              style={{ color: activeTier.color }}
            >
              {BRAND_NAME}
            </span>
            <Fingerprint
              id="card-icon"
              className="h-5 w-5 transition-colors duration-700"
              style={{ color: activeTier.color }}
            />
          </div>

          <div className="relative z-10 mb-7 mt-8">
            <h3
              id="card-tier-name"
              className="font-serif text-[32px] italic font-bold tracking-wide transition-colors duration-700"
              style={{ color: activeTier.color }}
            >
              {activeTier.cardName}
            </h3>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div className="flex flex-col">
              <span
                id="card-score-label"
                className="mb-0.5 text-[8px] uppercase tracking-widest transition-colors duration-700"
                style={{ color: `${activeTier.color}B3` }}
              >
                Total Score
              </span>
              <span
                id="card-score"
                className="font-bebas text-[30px] leading-none tracking-[0.08em] transition-colors duration-700"
                style={{ color: "#fef08a" }}
              >
                {membershipTotalScore.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span
                id="card-rank-label"
                className="mb-0.5 text-[8px] uppercase tracking-widest transition-colors duration-700"
                style={{ color: `${activeTier.color}B3` }}
              >
                Overall Rank
              </span>
              <span
                id="card-rank"
                className="font-bebas text-[24px] leading-none tracking-[0.08em] transition-colors duration-700"
                style={{ color: activeTier.color }}
              >
                {rankLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 grid w-full grid-cols-3 gap-2">
          {statSummaries.map((stat) => {
            const Icon = stat.icon;
            const isSelected = selectedStatTab === stat.id;
            const accentColor = isSelected
              ? stat.metricReady
                ? activeTier.color
                : "var(--text-main)"
              : "var(--text-sub)";
            return (
              <button
                key={stat.id}
                id={`card-box-${stat.id}`}
                type="button"
                onClick={() => setSelectedStatTab(stat.id)}
                className="relative flex flex-col justify-between gap-3 overflow-hidden rounded-[1.25rem] border p-3.5 text-left transition-all duration-300"
                style={{
                  background: isSelected
                    ? "linear-gradient(145deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)"
                    : "linear-gradient(145deg, var(--bg-card) 0%, var(--bg-body) 100%)",
                  borderColor: isSelected ? `${activeTier.color}88` : "var(--border-light)",
                  transform: isSelected ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
                    <span className="font-bebas text-[11px] tracking-wider" style={{ color: accentColor }}>
                      {stat.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <span
                      className="font-bebas text-[24px] leading-none"
                      style={{
                        color: accentColor,
                        textShadow:
                          isSelected && stat.metricReady
                            ? `0 0 12px ${activeTier.color}55`
                            : "none",
                      }}
                    >
                      {stat.grade}
                    </span>
                  </div>
                </div>
                <div className="w-full border-t pt-2.5" style={{ borderColor: "var(--border-light)" }}>
                  <span className="font-mono text-[11px] font-bold" style={{ color: accentColor }}>
                    {stat.points.toLocaleString()}
                    <span className="ml-0.5 text-[9px] font-normal">pts</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <section id="tracking-section" className="space-y-3 pt-2">
        <div
          className="rounded-2xl border p-3 transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <div
            className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5"
            style={{
              backgroundColor: noticeStyle.backgroundColor,
              borderColor: noticeStyle.borderColor,
            }}
          >
            <div className="min-w-0">
              <p
                className="font-bebas text-[12px] tracking-[0.09em]"
                style={{ color: noticeStyle.labelColor }}
              >
                {notice.label}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-[var(--text-main)]">{notice.message}</p>
            </div>
            {onOpenFullSetup && notice.ctaLabel ? (
              <button
                type="button"
                onClick={onOpenFullSetup}
                className="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:text-[var(--text-main)]"
                style={{
                  color: "var(--text-sub)",
                  borderColor: "var(--border-light)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                {notice.ctaLabel}
              </button>
            ) : null}
          </div>
        </div>

        <div className="chart-animate" style={trackerThemeVars}>
          <UnifiedGoalCard
            key={trackerMainTab}
            onOpenFullSetup={onOpenFullSetup}
            hideMainTabs
            mainTabOverride={trackerMainTab}
          />
        </div>
      </section>
    </div>
  );
}
