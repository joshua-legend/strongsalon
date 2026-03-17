"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useGoal } from "@/context/GoalContext";
import { useApp } from "@/context/AppContext";
import { getDaysLeft, formatExpiry } from "@/utils/homeUtils";
import QuestStartCard from "./QuestStartCard";
import QuestGoalTracker from "./QuestGoalTracker";
import GoalCompleteCard from "./GoalCompleteCard";
import PtTicketCard from "./PtTicketCard";
import GymTicketCard from "./GymTicketCard";
import CategorySetupSheet from "./CategorySetupSheet";
import RecommendationSetupSheet from "./RecommendationSetupSheet";

export default function HomeTab() {
  const { user } = useUser();
  const { goalSetting, activeQuest, isGoalReached, primaryGoal } = useGoal();
  const { openStrengthSetup, setOpenStrengthSetup, openRecommendationSetup, setOpenRecommendationSetup } = useApp();
  const [showStrengthSheet, setShowStrengthSheet] = useState(false);
  const [showRecommendationSheet, setShowRecommendationSheet] = useState(false);

  useEffect(() => {
    if (openStrengthSetup) {
      setShowStrengthSheet(true);
      setOpenStrengthSetup(false);
    }
  }, [openStrengthSetup, setOpenStrengthSetup]);

  useEffect(() => {
    if (openRecommendationSetup) {
      setShowRecommendationSheet(true);
      setOpenRecommendationSetup(false);
    }
  }, [openRecommendationSetup, setOpenRecommendationSetup]);

  const ptRemaining = user?.remainingSessions ?? 0;
  const ptTotal = user?.totalSessions ?? 0;
  const membershipExpiry = user?.membershipExpiry;
  const membershipDaysLeft = membershipExpiry ? Math.max(0, getDaysLeft(membershipExpiry)) : null;
  const membershipExpiryFmt = membershipExpiry ? formatExpiry(membershipExpiry) : null;

  const openFullSetup = () => setShowRecommendationSheet(true);

  const questSection = (() => {
    if (isGoalReached) return <GoalCompleteCard onOpenFullSetup={openFullSetup} />;
    if (goalSetting && !activeQuest) return <QuestStartCard onOpenFullSetup={openFullSetup} />;
    return <QuestGoalTracker onOpenFullSetup={openFullSetup} />;
  })();

  return (
    <div className="px-4 py-4 space-y-4">
      {questSection}

      <CategorySetupSheet
        open={showStrengthSheet}
        onClose={() => setShowStrengthSheet(false)}
        categoryId="strength"
        primaryGoal={primaryGoal}
        onComplete={() => setShowStrengthSheet(false)}
      />

      <RecommendationSetupSheet
        open={showRecommendationSheet}
        onClose={() => setShowRecommendationSheet(false)}
        onComplete={() => setShowRecommendationSheet(false)}
      />

      <div className="space-y-3 pb-4">
        <PtTicketCard
          remaining={ptRemaining}
          total={ptTotal}
          nextPtDate={user?.nextPtDate}
          nextPtTime={user?.nextPtTime}
          trainerName={user?.trainerName}
        />
        <GymTicketCard daysLeft={membershipDaysLeft} expiryFormatted={membershipExpiryFmt} />
      </div>
    </div>
  );
}
