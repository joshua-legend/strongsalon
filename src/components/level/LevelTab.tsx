"use client";

import CategorySetupSheet from "@/components/home/CategorySetupSheet";
import GoalCompleteCard from "@/components/home/GoalCompleteCard";
import QuestGoalTracker from "@/components/home/QuestGoalTracker";
import QuestStartCard from "@/components/home/QuestStartCard";
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

  const questSection = (() => {
    if (isGoalReached) {
      return <GoalCompleteCard onOpenFullSetup={openFullSetup} />;
    }
    if (goalSetting && !activeQuest) {
      return <QuestStartCard onOpenFullSetup={openFullSetup} />;
    }
    return <QuestGoalTracker onOpenFullSetup={openFullSetup} />;
  })();

  return (
    <div className="px-4 py-4 space-y-4">
      {questSection}
      <PremiumLevelDashboard />

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
