"use client";

import AppShell from "@/components/shell/AppShell";
import { useApp } from "@/context/AppContext";
import { useProfile } from "@/context/ProfileContext";
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
  const { profile } = useProfile();

  const needsOnboarding = !profile;
  if (needsOnboarding) {
    return <OnboardingWizard />;
  }
  return (
    <AppShell>
      <TabContent />
    </AppShell>
  );
}

function TabContent() {
  const { activeTab, theme } = useApp();

  if (theme === "workout") {
    return <WorkoutPage />;
  }

  return (
    <>
      <div style={{ display: activeTab === "home" ? "block" : "none" }}>
        <HomeTab />
      </div>
      <div style={{ display: activeTab === "stats" ? "block" : "none" }}>
        <StatsTab />
      </div>
      <div style={{ display: activeTab === "performance" ? "block" : "none" }}>
        <PerformanceTab />
      </div>
      <div
        style={{ display: activeTab === "exercise-info" ? "block" : "none" }}
      >
        <ExerciseInfoTab />
      </div>
    </>
  );
}
