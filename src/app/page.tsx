"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/shell/AppShell";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { ToastProvider } from "@/components/ui/Toast";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import HomeTab from "@/components/home/HomeTab";
import LevelTab from "@/components/level/LevelTab";
import RecordTab from "@/components/record/RecordTab";
import StatsTab from "@/components/stats/StatsTab";
import PerformanceTab from "@/components/performance/PerformanceTab";
import ExerciseInfoTab from "@/components/exercise-info/ExerciseInfoTab";
import WorkoutTabContent from "@/components/workout/WorkoutTabContent";

export default function Page() {
  return (
    <ToastProvider>
      <PageContent />
    </ToastProvider>
  );
}

function PageContent() {
  const router = useRouter();
  const { currentAccountId, ready } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    if (ready && !currentAccountId) {
      router.replace("/login");
    }
  }, [ready, currentAccountId, router]);

  if (!ready || !currentAccountId) {
    return null;
  }

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
    return <WorkoutTabContent />;
  }

  return (
    <>
      <div style={{ display: activeTab === "home" ? "block" : "none" }}>
        <HomeTab />
      </div>
      <div style={{ display: activeTab === "level" ? "block" : "none" }}>
        <LevelTab />
      </div>
      <div style={{ display: activeTab === "record" ? "block" : "none" }}>
        <RecordTab />
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
