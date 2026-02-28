"use client";

import { useState } from "react";
import { member } from "@/data/member";
import { attendance } from "@/data/attendance";
import { useApp } from "@/context/AppContext";
import { getWeekStreak, getDaysLeft, formatExpiry, getTodayWeekIndex } from "@/utils/homeUtils";
import DirectiveCard from "./DirectiveCard";
import TodayRoutineButton from "./TodayRoutineButton";
import WeeklyStreakCard from "./WeeklyStreakCard";
import PtTicketCard from "./PtTicketCard";
import GymTicketCard from "./GymTicketCard";
import TargetSliderModal from "./TargetSliderModal";

export default function HomeTab() {
  const { enterWorkout } = useApp();

  const weekStreak = getWeekStreak(attendance);
  const ptRemaining = member.remainingSessions ?? 0;
  const ptTotal = member.totalSessions ?? 0;
  const membershipExpiry = member.membershipExpiry;
  const membershipDaysLeft = membershipExpiry ? Math.max(0, getDaysLeft(membershipExpiry)) : null;
  const membershipExpiryFmt = membershipExpiry ? formatExpiry(membershipExpiry) : null;
  const todayIdx = getTodayWeekIndex();

  const [showSliderModal, setShowSliderModal] = useState(false);

  return (
    <div className="px-4 py-4 space-y-4">
      <DirectiveCard onOpenSlider={() => setShowSliderModal(true)} />

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

      <TargetSliderModal
        open={showSliderModal}
        onClose={() => setShowSliderModal(false)}
        onConfirm={() => setShowSliderModal(false)}
      />
    </div>
  );
}
