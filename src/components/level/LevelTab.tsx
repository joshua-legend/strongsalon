"use client";

import CategorySetupSheet from "@/components/home/CategorySetupSheet";
import RecommendationSetupSheet from "@/components/home/RecommendationSetupSheet";
import { useApp } from "@/context/AppContext";
import { useGoal } from "@/context/GoalContext";
import PremiumLevelDashboard from "./PremiumLevelDashboard";

export default function LevelTab() {
  const { goalSetting, activeQuest, isGoalReached, primaryGoal } = useGoal();
  const {
    openStrengthSetup,
    setOpenStrengthSetup,
    openRecommendationSetup,
    setOpenRecommendationSetup,
  } = useApp();

  const openFullSetup = () => setOpenRecommendationSetup(true);

  return (
    <div className="px-4 py-4 space-y-4">
      <PremiumLevelDashboard
        onOpenFullSetup={openFullSetup}
        hasGoalSetting={Boolean(goalSetting)}
        hasActiveQuest={Boolean(activeQuest)}
        isGoalReached={isGoalReached}
      />

      <CategorySetupSheet
        open={openStrengthSetup}
        onClose={() => setOpenStrengthSetup(false)}
        categoryId="strength"
        primaryGoal={primaryGoal}
        onComplete={() => setOpenStrengthSetup(false)}
      />

      <RecommendationSetupSheet
        open={openRecommendationSetup}
        onClose={() => setOpenRecommendationSetup(false)}
        onComplete={() => setOpenRecommendationSetup(false)}
      />
    </div>
  );
}
