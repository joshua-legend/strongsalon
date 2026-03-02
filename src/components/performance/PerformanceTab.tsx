"use client";

import { useState } from "react";
import AnimalTierHero from "./AnimalTierHero";
import TierDistributionModal from "./TierDistributionModal";
import AbilityRadarChart from "./AbilityRadarChart";
import AbilityMeasureModal, { loadFromStorage } from "./AbilityMeasureModal";
import WildChallengeCards from "./WildChallengeCards";
import type { AbilityStats } from "@/types";

export default function PerformanceTab() {
  const [showTierModal, setShowTierModal] = useState(false);
  const [showAbilityModal, setShowAbilityModal] = useState(false);
  const [abilityStats, setAbilityStats] = useState<AbilityStats>(loadFromStorage);

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up">
        <AnimalTierHero onOpenTierDistribution={() => setShowTierModal(true)} />
      </div>

      <TierDistributionModal
        open={showTierModal}
        onClose={() => setShowTierModal(false)}
      />

      <div className="fade-up fade-in-1">
        <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
          5대 능력치 밸런스
        </div>
        <AbilityRadarChart stats={abilityStats} />
        <button
          onClick={() => setShowAbilityModal(true)}
          className="w-full mt-3 py-3 rounded-xl text-sm font-bold bg-orange-500/20 text-orange-500 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
        >
          능력치 밸런스 측정하기
        </button>
      </div>

      <AbilityMeasureModal
        open={showAbilityModal}
        onClose={() => setShowAbilityModal(false)}
        onSave={(stats) => setAbilityStats(stats)}
        initialStats={abilityStats}
      />

      <div className="fade-up fade-in-2">
        <WildChallengeCards />
      </div>

      <div className="h-4" />
    </div>
  );
}
