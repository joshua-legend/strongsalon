"use client";

import { useState } from "react";
import AppShell from "@/components/shell/AppShell";
import { useApp } from "@/context/AppContext";
import { useQuest } from "@/context/QuestContext";
import { ToastProvider } from "@/components/ui/Toast";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import HomeTab from "@/components/home/HomeTab";
import StatsTab from "@/components/stats/StatsTab";
import PerformanceTab from "@/components/performance/PerformanceTab";
import ExerciseInfoTab from "@/components/exercise-info/ExerciseInfoTab";
import WorkoutPage from "@/components/workout/WorkoutPage";

export default function Page() {
  return (
    <ToastProvider>
      <PageContent />
    </ToastProvider>
  );
}

function PageContent() {
  const { userProfile } = useQuest();
  const [showGoalSetup, setShowGoalSetup] = useState(false);

  if (!userProfile && showGoalSetup) {
    return <OnboardingWizard />;
  }
  return (
    <AppShell>
      <TabContent onGoalSetupRequest={() => setShowGoalSetup(true)} />
    </AppShell>
  );
}

function TabContent({
  onGoalSetupRequest,
}: {
  onGoalSetupRequest: () => void;
}) {
  const { activeTab, theme } = useApp();

  if (theme === "workout") {
    return <WorkoutPage />;
  }

  return (
    <>
      <div style={{ display: activeTab === "home" ? "block" : "none" }}>
        <HomeTab onGoalSetupRequest={onGoalSetupRequest} />
      </div>
      <div style={{ display: activeTab === "performance" ? "block" : "none" }}>
        <PerformanceTab />
      </div>
      <div style={{ display: activeTab === "stats" ? "block" : "none" }}>
        <StatsTab />
      </div>
      <div style={{ display: activeTab === "exercise-info" ? "block" : "none" }}>
        <ExerciseInfoTab />
      </div>
    </>
  );
}
