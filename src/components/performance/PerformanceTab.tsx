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
        <AbilityRadarChart
          stats={abilityStats}
          growthDelta={{ target: "하체 근력", val: "+3.2%" }}
          onMeasureClick={() => setShowAbilityModal(true)}
        />
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
