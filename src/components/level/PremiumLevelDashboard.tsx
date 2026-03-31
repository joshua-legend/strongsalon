"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Dumbbell,
  Fingerprint,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import UnifiedGoalCard from "@/components/home/UnifiedGoalCard";
import { usePremiumLevelDashboardModel } from "@/hooks/usePremiumLevelDashboardModel";
import {
  MEMBERSHIP_TIERS,
  getTierFromScore,
  getTierTheme,
} from "@/config/membershipTierTheme";
import { useLevelTheme } from "@/context/LevelThemeContext";
import { useGoal } from "@/context/GoalContext";
import { useProfile } from "@/context/ProfileContext";
import LevelNonagonCard from "./LevelNonagonCard";

type StatTab = "strength" | "stamina" | "inbody";

interface PremiumLevelDashboardProps {
  onOpenFullSetup?: () => void;
}

interface StatSummaryModel {
  id: StatTab;
  label: string;
  icon: LucideIcon;
  rank: string;
  percentile: number;
  points: number;
  metricReady: boolean;
}

const BRAND_NAME = "STRONG SALON";

const STAT_ICONS: Record<StatTab, LucideIcon> = {
  strength: Dumbbell,
  stamina: HeartPulse,
  inbody: Activity,
};

const STAT_LABELS: Record<StatTab, string> = {
  strength: "Strength",
  stamina: "Cardio",
  inbody: "Inbody",
};

const STAT_NOTE_LABELS: Record<StatTab, string> = {
  strength: "스트렝스",
  stamina: "카디오",
  inbody: "인바디",
};

const STAT_DISPLAY_ORDER: StatTab[] = ["inbody", "stamina", "strength"];

const CAREER_PERCENTILE_ANCHORS = [
  { score: 0, percentile: 100 },
  { score: 20, percentile: 90 },
  { score: 35, percentile: 75 },
  { score: 50, percentile: 50 },
  { score: 65, percentile: 25 },
  { score: 80, percentile: 10 },
  { score: 90, percentile: 3 },
  { score: 100, percentile: 1 },
] as const;

function getStatGrade(points: number) {
  if (points >= 9700) return "S";
  if (points >= 9300) return "A";
  if (points >= 8900) return "B";
  if (points >= 8400) return "C";
  if (points >= 7900) return "D";
  return "F";
}

function getTopPercent(points: number) {
  if (points >= 9700) return 1;
  if (points >= 9500) return 2;
  if (points >= 9300) return 4;
  if (points >= 9100) return 7;
  if (points >= 8900) return 10;
  if (points >= 8700) return 14;
  if (points >= 8500) return 18;
  if (points >= 8300) return 24;
  if (points >= 8100) return 30;
  if (points >= 7900) return 38;
  return 52;
}

function getCareerScore(points: number) {
  return Math.max(0, Math.min(100, Math.round((points - 7000) / 30)));
}

function getCareerPercentile(score: number) {
  const rounded = Math.max(0, Math.min(100, Math.round(score)));

  for (let index = 0; index < CAREER_PERCENTILE_ANCHORS.length - 1; index += 1) {
    const current = CAREER_PERCENTILE_ANCHORS[index];
    const next = CAREER_PERCENTILE_ANCHORS[index + 1];

    if (rounded <= next.score) {
      const ratio =
        next.score === current.score
          ? 0
          : (rounded - current.score) / (next.score - current.score);
      const interpolated =
        current.percentile + (next.percentile - current.percentile) * ratio;
      return Math.max(1, Math.min(100, Math.round(interpolated)));
    }
  }

  return 1;
}

function getGenderPercentileLabel(gender?: string | null) {
  if (gender === "male") return "동연령 남성";
  if (gender === "female") return "동연령 여성";
  return "동연령 기준";
}

export default function PremiumLevelDashboard({
  onOpenFullSetup,
}: PremiumLevelDashboardProps) {
  const { setSelectedTier } = useLevelTheme();
  const { categorySettings } = useGoal();
  const { profile } = useProfile();
  const [selectedStatTab, setSelectedStatTab] = useState<StatTab>("inbody");
  const [cardSlideIndex, setCardSlideIndex] = useState(0);
  const [cardTouchStartX, setCardTouchStartX] = useState<number | null>(null);
  const pillars = usePremiumLevelDashboardModel();

  const statSummaries: StatSummaryModel[] = useMemo(
    () =>
      pillars.map((pillar) => {
        const points = Math.max(7000, Math.min(9999, pillar.pillarPoints));
        return {
          id: pillar.id,
          label: STAT_LABELS[pillar.id],
          icon: STAT_ICONS[pillar.id],
          points,
          rank: pillar.metricReady ? getStatGrade(points) : "F",
          percentile: pillar.metricReady ? getTopPercent(points) : 99,
          metricReady: pillar.metricReady,
        };
      }),
    [pillars]
  );

  const orderedStatSummaries = useMemo(
    () =>
      STAT_DISPLAY_ORDER.map((id) => statSummaries.find((stat) => stat.id === id)).filter(
        (stat): stat is StatSummaryModel => Boolean(stat)
      ),
    [statSummaries]
  );

  const measuredStatSummaries = useMemo(
    () => orderedStatSummaries.filter((stat) => stat.metricReady),
    [orderedStatSummaries]
  );

  const measuredAveragePoints = useMemo(
    () =>
      measuredStatSummaries.length > 0
        ? measuredStatSummaries.reduce((sum, stat) => sum + stat.points, 0) /
          measuredStatSummaries.length
        : 7000,
    [measuredStatSummaries]
  );

  const overallCareerScore = useMemo(
    () => getCareerScore(measuredAveragePoints),
    [measuredAveragePoints]
  );

  const careerTier = useMemo(
    () => getTierFromScore(overallCareerScore),
    [overallCareerScore]
  );

  const activeTier = useMemo(
    () => getTierTheme(careerTier.id),
    [careerTier.id]
  );

  const membershipTopPercent = useMemo(
    () => getCareerPercentile(overallCareerScore),
    [overallCareerScore]
  );

  const nextCareerTier = useMemo(() => {
    const currentIndex = MEMBERSHIP_TIERS.findIndex((tier) => tier.id === careerTier.id);
    return currentIndex >= 0 ? MEMBERSHIP_TIERS[currentIndex + 1] ?? null : null;
  }, [careerTier.id]);

  const pointsToNextTier = nextCareerTier
    ? Math.max(0, nextCareerTier.scoreMin - overallCareerScore)
    : 0;

  const percentileLabel = `${getGenderPercentileLabel(profile?.gender ?? null)} 상위 ${membershipTopPercent}%`;

  const missingDomains = useMemo(
    () =>
      orderedStatSummaries
        .filter((stat) => !stat.metricReady)
        .map((stat) => STAT_NOTE_LABELS[stat.id]),
    [orderedStatSummaries]
  );

  const missingDomainNote =
    missingDomains.length > 0
      ? `※ ${missingDomains.join(", ")} 미측정으로 측정된 도메인만으로 산출되었습니다. 전 항목 측정 시 점수가 달라질 수 있습니다.`
      : null;

  useEffect(() => {
    setSelectedTier(careerTier.id);
  }, [careerTier.id, setSelectedTier]);

  const balanceMapData = useMemo(() => {
    const inbody = categorySettings?.inbody?.startValues ?? {};
    const cardio = categorySettings?.fitness?.startValues ?? {};
    const strength = categorySettings?.strength?.startValues ?? {};
    if (selectedStatTab === "inbody") {
      const fatPercent = Number(inbody.fatPercent ?? 0);
      return {
        label: "Body Fat",
        value: fatPercent > 0 ? `${fatPercent.toFixed(1)}%` : "-",
      };
    }
    if (selectedStatTab === "stamina") {
      const running = Number(cardio.running ?? 0);
      return {
        label: "Run Pace",
        value: running > 0 ? `${running.toFixed(2)} min/km` : "-",
      };
    }
    const squat = Number(strength.squat ?? 0);
    return {
      label: "Squat 1RM",
      value: squat > 0 ? `${Math.round(squat)} kg` : "-",
    };
  }, [categorySettings, selectedStatTab]);

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

  const handleCardTouchStart = (clientX: number) => {
    setCardTouchStartX(clientX);
  };

  const handleCardTouchEnd = (clientX: number) => {
    if (cardTouchStartX === null) return;
    const delta = clientX - cardTouchStartX;
    if (delta <= -40) {
      setCardSlideIndex(1);
    } else if (delta >= 40) {
      setCardSlideIndex(0);
    }
    setCardTouchStartX(null);
  };

  return (
    <div id="tab-level" className="block flex-1 space-y-6 px-5 py-6" style={rootVars}>
      <div id="view-card" className="block space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-end gap-1">
            {(["레벨", "밸런스 맵"] as const).map((label, idx) => (
              <button
                key={`card-slide-${label}`}
                type="button"
                onClick={() => setCardSlideIndex(idx)}
                className="px-2.5 py-1 rounded-md border text-[10px] font-semibold transition-colors"
                style={{
                  borderColor:
                    cardSlideIndex === idx ? `${activeTier.color}66` : "var(--border-light)",
                  color: cardSlideIndex === idx ? activeTier.color : "var(--text-sub)",
                  backgroundColor:
                    cardSlideIndex === idx ? `${activeTier.softBg}` : "var(--bg-card)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="overflow-hidden rounded-[1.25rem]"
            onTouchStart={(e) => handleCardTouchStart(e.changedTouches[0].clientX)}
            onTouchEnd={(e) => handleCardTouchEnd(e.changedTouches[0].clientX)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {cardSlideIndex === 0 ? (
                <motion.div
                  key="membership-slide"
                  initial={{ x: -28, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 28, opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                >
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
                      <p
                        className="mb-2 text-[11px] font-semibold tracking-[0.08em]"
                        style={{ color: `${activeTier.color}D9` }}
                      >
                        {careerTier.displayLabel}
                      </p>
                      <h3
                        id="card-tier-name"
                        className="font-serif text-[32px] italic font-bold tracking-wide transition-colors duration-700"
                        style={{ color: activeTier.color }}
                      >
                        {careerTier.cardName}
                      </h3>
                    </div>

                    <div className="relative z-10 flex items-end justify-between gap-4">
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
                          className="text-[22px] font-black leading-none transition-colors duration-700"
                          style={{ color: "#ffffff" }}
                        >
                          종합 {overallCareerScore}점
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span
                          id="card-rank-label"
                          className="mb-0.5 text-[8px] uppercase tracking-widest transition-colors duration-700"
                          style={{ color: `${activeTier.color}B3` }}
                        >
                          Percentile
                        </span>
                        <span
                          id="card-rank"
                          className="text-[15px] font-bold leading-tight transition-colors duration-700"
                          style={{ color: activeTier.color }}
                        >
                          {percentileLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-3 space-y-2 rounded-[1.1rem] border px-4 py-3"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: `${activeTier.color}2E`,
                    }}
                  >
                    {nextCareerTier ? (
                      <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                        다음 등급 {nextCareerTier.displayLabel}까지 +{pointsToNextTier}점 필요
                      </p>
                    ) : (
                      <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                        최고 등급에 도달했습니다.
                      </p>
                    )}
                    <p className="text-[11px] leading-5" style={{ color: "var(--text-sub)" }}>
                      {careerTier.comment}
                    </p>
                    {missingDomainNote ? (
                      <p className="text-[10px] leading-5" style={{ color: activeTier.color }}>
                        {missingDomainNote}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="balance-slide"
                  initial={{ x: 28, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -28, opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                >
                  <LevelNonagonCard
                    categorySettings={categorySettings}
                    accentColor={activeTier.color}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative z-10 mt-4 grid w-full grid-cols-3 gap-2">
          {orderedStatSummaries.map((stat) => {
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
                      {stat.rank}
                    </span>
                  </div>
                </div>
                <div className="w-full border-t pt-2.5" style={{ borderColor: "var(--border-light)" }}>
                  <p className="font-mono text-[11px] font-bold" style={{ color: accentColor }}>
                    Top {stat.percentile}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <section id="tracking-section" className="space-y-3 pt-2">
        <div
          className="rounded-2xl border px-4 py-3 transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p
            className="text-[10px] font-bold tracking-[0.12em]"
            style={{ color: activeTier.color }}
          >
            BALANCE MAP DATA
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                {balanceMapData.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-sub)" }}>
                from {STAT_LABELS[selectedStatTab]}
              </p>
            </div>
            <p className="font-bebas text-[24px] leading-none" style={{ color: activeTier.color }}>
              {balanceMapData.value}
            </p>
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
