"use client";

import { useUser } from "@/context/UserContext";
import { useGoal } from "@/context/GoalContext";
import { getDaysLeft, formatExpiry } from "@/utils/homeUtils";
import QuestStartCard from "./QuestStartCard";
import QuestGoalTracker from "./QuestGoalTracker";
import GoalCompleteCard from "./GoalCompleteCard";
import PtTicketCard from "./PtTicketCard";
import GymTicketCard from "./GymTicketCard";

export default function HomeTab() {
  const { user } = useUser();
  const { goalSetting, activeQuest, isGoalReached } = useGoal();

  const ptRemaining = user?.remainingSessions ?? 0;
  const ptTotal = user?.totalSessions ?? 0;
  const membershipExpiry = user?.membershipExpiry;
  const membershipDaysLeft = membershipExpiry ? Math.max(0, getDaysLeft(membershipExpiry)) : null;
  const membershipExpiryFmt = membershipExpiry ? formatExpiry(membershipExpiry) : null;

  const questSection = (() => {
    if (isGoalReached) return <GoalCompleteCard />;
    if (goalSetting && !activeQuest) return <QuestStartCard />;
    return <QuestGoalTracker />;
  })();

  return (
    <div className="px-4 py-4 space-y-4">
      {questSection}

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
