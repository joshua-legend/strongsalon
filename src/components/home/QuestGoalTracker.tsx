"use client";

import UnifiedGoalCard from "./UnifiedGoalCard";

interface QuestGoalTrackerProps {
  onOpenFullSetup?: () => void;
}

export default function QuestGoalTracker({ onOpenFullSetup }: QuestGoalTrackerProps) {
  return (
    <div className="space-y-4">
      <UnifiedGoalCard onOpenFullSetup={onOpenFullSetup} />
    </div>
  );
}
