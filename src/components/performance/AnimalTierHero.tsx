"use client";

import { member } from "@/data/member";
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
  const total = calcTotalScore(member);
  const percentile = Math.min(100, Math.max(0, total));
  const tier = getAnimalTierFromPercentile(percentile);
  const cfg = ANIMAL_TIER_CONFIG[tier];
  const topPercent = Math.round(100 - percentile);
  const nextInfo = getNextTierInfo(tier);
  const segment = member.ageSegment
    ? `${member.ageSegment} / ${Math.round(member.bodyWeight)}kg 체급`
    : `${Math.round(member.bodyWeight)}kg 체급`;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden bg-neutral-950"
      style={{
        border: "1px solid rgba(163, 230, 53, 0.2)",
        background:
          "linear-gradient(135deg, rgba(163,230,53,.06), rgba(163,230,53,.02))",
      }}
    >
      <span className="inline-block px-3 py-1 rounded-lg bg-lime-400 text-neutral-950 text-[10px] font-bold tracking-widest uppercase mb-4">
        Tier {cfg.tierNum} CLASS
      </span>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-bebas text-xl text-lime-400 tracking-wider mb-1">
            {cfg.label}
          </h2>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {cfg.mascotDesc}
          </p>
        </div>

        <div className="relative shrink-0">
          <div
            className="w-16 h-16 rounded-xl overflow-hidden border border-lime-500/30 flex items-center justify-center transform rotate-3"
            style={{
              boxShadow: "0 0 20px rgba(163,230,53,0.5)",
              filter: "drop-shadow(0 0 12px rgba(163,230,53,0.5))",
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
          <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-md bg-lime-500/30 text-lime-400 text-[9px] font-bold border border-lime-500/50">
            Top {topPercent}%
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-neutral-500">
            {segment} 보정 적용
          </span>
          {onOpenTierDistribution && (
            <button
              onClick={onOpenTierDistribution}
              className="text-[10px] font-bold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-0.5"
            >
              생태계 분포
              <span className="text-neutral-500">&gt;</span>
            </button>
          )}
        </div>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-lime-500 transition-all duration-700"
            style={{ width: `${100 - topPercent}%` }}
          />
        </div>
        {nextInfo && (
          <p className="text-[9px] text-neutral-500 mt-2">
            다음 진화: {nextInfo.label} (상위 {nextInfo.percent}%)
          </p>
        )}
      </div>
    </div>
  );
}
