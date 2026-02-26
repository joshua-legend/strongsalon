"use client";

import AppShell from "@/components/shell/AppShell";
import { useApp } from "@/context/AppContext";
import { ToastProvider } from "@/components/ui/Toast";
import HomeTab from "@/components/home/HomeTab";
import StatsTab from "@/components/stats/StatsTab";
import PerformanceTab from "@/components/performance/PerformanceTab";
import RankingTab from "@/components/ranking/RankingTab";
import WorkoutPage from "@/components/workout/WorkoutPage";

export default function Page() {
  return (
    <ToastProvider>
      <AppShell>
        <TabContent />
      </AppShell>
    </ToastProvider>
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
      <div style={{ display: activeTab === "performance" ? "block" : "none" }}>
        <PerformanceTab />
      </div>
      <div style={{ display: activeTab === "stats" ? "block" : "none" }}>
        <StatsTab />
      </div>
      <div style={{ display: activeTab === "ranking" ? "block" : "none" }}>
        <RankingTab />
      </div>
    </>
  );
}
