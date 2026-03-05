"use client";

import { member } from "@/data/member";
import { useApp } from "@/context/AppContext";
import { useAttendance } from "@/context/AttendanceContext";
import { useQuest } from "@/context/QuestContext";
import { getWeekStreak, getDaysLeft, formatExpiry, getTodayWeekIndex } from "@/utils/homeUtils";
import QuestStartCard from "./QuestStartCard";
import QuestGoalTracker from "./QuestGoalTracker";
import GoalCompleteCard from "./GoalCompleteCard";
import TodayRoutineButton from "./TodayRoutineButton";
import WeeklyStreakCard from "./WeeklyStreakCard";
import PtTicketCard from "./PtTicketCard";
import GymTicketCard from "./GymTicketCard";

export default function HomeTab() {
  const { enterWorkout } = useApp();
  const { userProfile, activeQuest, isGoalReached } = useQuest();
  const { attendance } = useAttendance();

  const weekStreak = getWeekStreak(attendance);
  const ptRemaining = member.remainingSessions ?? 0;
  const ptTotal = member.totalSessions ?? 0;
  const membershipExpiry = member.membershipExpiry;
  const membershipDaysLeft = membershipExpiry ? Math.max(0, getDaysLeft(membershipExpiry)) : null;
  const membershipExpiryFmt = membershipExpiry ? formatExpiry(membershipExpiry) : null;
  const todayIdx = getTodayWeekIndex();

  const questSection = (() => {
    if (isGoalReached) return <GoalCompleteCard />;
    if (!activeQuest) return <QuestStartCard />;
    return <QuestGoalTracker />;
  })();

  return (
    <div className="px-4 py-4 space-y-4">
      {questSection}

      <TodayRoutineButton onClick={enterWorkout} />

      <WeeklyStreakCard weekStreak={weekStreak} todayIdx={todayIdx} />

      <div className="space-y-3 pb-4">
        <PtTicketCard
          remaining={ptRemaining}
          total={ptTotal}
          nextPtDate={member.nextPtDate}
          trainerName={member.trainerName}
        />
        <GymTicketCard daysLeft={membershipDaysLeft} expiryFormatted={membershipExpiryFmt} />
      </div>
    </div>
  );
}
