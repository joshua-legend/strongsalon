"use client";

import { member } from "@/data/member";
import { calcTotalScore } from "@/utils/scoring";
import {
  getAnimalTierFromPercentile,
  ANIMAL_TIER_CONFIG,
} from "@/utils/animalTier";

interface AnimalTierHeroProps {
  onOpenTierDistribution?: () => void;
}

export default function AnimalTierHero({ onOpenTierDistribution }: AnimalTierHeroProps) {
  const total = calcTotalScore(member);
  const percentile = Math.min(100, Math.max(0, total));
  const tier = getAnimalTierFromPercentile(percentile);
  const cfg = ANIMAL_TIER_CONFIG[tier];
  const displayPct = Math.round(100 - percentile);

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(249,115,22,.12), rgba(239,68,68,.08))",
        border: "1px solid rgba(249,115,22,.2)",
      }}
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{cfg.emoji}</span>
          <span className="font-bebas text-lg text-orange-500 tracking-wider">
            {cfg.label}
          </span>
        </div>
        <p className="font-bebas text-[11px] text-neutral-400">
          Tier {cfg.tierNum} · 상위 {displayPct}%
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5">
          {member.bodyWeight}kg 체급 보정
        </p>

        {onOpenTierDistribution && (
          <button
            onClick={onOpenTierDistribution}
            className="mt-3 px-4 py-2 rounded-lg text-[11px] font-bold bg-orange-500/20 text-orange-500 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
          >
            티어 분포 보기
          </button>
        )}
      </div>
    </div>
  );
}
