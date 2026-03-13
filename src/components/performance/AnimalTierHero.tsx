"use client";

import { ChevronRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { calcTotalScore } from "@/utils/scoring";
import {
  getAnimalTierFromPercentile,
  ANIMAL_TIER_CONFIG,
  getNextTierInfo,
} from "@/utils/animalTier";

interface AnimalTierHeroProps {
  onOpenTierDistribution?: () => void;
}

export default function AnimalTierHero({
  onOpenTierDistribution,
}: AnimalTierHeroProps) {
  const { user } = useUser();
  const total = user ? calcTotalScore(user) : 0;
  const percentile = Math.min(100, Math.max(0, total));
  const tier = getAnimalTierFromPercentile(percentile);
  const cfg = ANIMAL_TIER_CONFIG[tier];
  const topPercent = Math.round(100 - percentile);
  const nextInfo = getNextTierInfo(tier);
  const bodyWeight = user?.bodyWeight ?? user?.weight ?? 0;
  const segment = user?.ageSegment
    ? `${user.ageSegment} / ${Math.round(bodyWeight)}kg 체급`
    : `${Math.round(bodyWeight)}kg 체급`;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-colors duration-300"
      style={{
        border: "1px solid var(--challenge-hero-border)",
        background: "var(--challenge-hero-bg)",
      }}
    >
      <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase mb-4 transition-colors duration-300" style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}>
        Tier {cfg.tierNum} CLASS
      </span>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-bebas text-2xl font-bold tracking-wider mb-1 transition-colors duration-300" style={{ color: "var(--accent-main)" }}>
            {cfg.label}
          </h2>
          <p className="text-[12px] font-medium leading-relaxed transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            {cfg.mascotDesc}
          </p>
        </div>

        <div className="relative shrink-0">
          <div
            className="w-16 h-16 rounded-xl overflow-hidden border flex items-center justify-center transform rotate-3 transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--accent-main)",
              boxShadow: "0 0 15px var(--accent-bg)",
            }}
          >
            {tier === "tiger" ? (
              <video
                src="/tiger.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">{cfg.emoji}</span>
            )}
          </div>
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md text-[9px] font-bold border transition-colors duration-300" style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent-main)", borderColor: "var(--accent-main)" }}>
            Top {topPercent}%
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t transition-colors duration-300" style={{ borderColor: "var(--border-light)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            {segment} 보정 적용
          </span>
          {onOpenTierDistribution && (
            <button
              onClick={onOpenTierDistribution}
              className="text-[11px] font-bold flex items-center gap-0.5 transition-colors duration-300"
              style={{ color: "var(--accent-main)" }}
            >
              생태계 분포
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="h-2.5 rounded-full overflow-hidden transition-colors duration-300 shadow-inner" style={{ backgroundColor: "var(--bg-body)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${100 - topPercent}%`, backgroundColor: "var(--accent-main)" }}
          />
        </div>
        {nextInfo && (
          <p className="text-[11px] font-medium mt-2 transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            다음 진화: {nextInfo.label} (상위 {nextInfo.percent}%)
          </p>
        )}
      </div>
    </div>
  );
}
