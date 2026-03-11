"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { UserProfile, ActiveQuest } from "@/types/quest";
import { loadProfile, loadQuest, saveProfile, saveQuest } from "./useQuestStorage";

interface QuestContextValue {
  userProfile: UserProfile | null;
  activeQuest: ActiveQuest | null;
  setUserProfile: (p: UserProfile | null) => void;
  setActiveQuest: (q: ActiveQuest | null) => void;
  recordWeek: (inputValue: number) => void;
  extendGoal: () => void;
  resetQuest: () => void;
  isGoalReached: boolean;
}

const QuestContext = createContext<QuestContextValue | null>(null);

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => loadProfile());
  const [activeQuest, setActiveQuestState] = useState<ActiveQuest | null>(() => loadQuest());

  const setUserProfile = useCallback((p: UserProfile | null) => {
    setUserProfileState(p);
    saveProfile(p);
  }, []);

  const setActiveQuest = useCallback((q: ActiveQuest | null) => {
    setActiveQuestState(q);
    saveQuest(q);
  }, []);

  const isGoalReached = (() => {
    if (!userProfile || !activeQuest) return false;
    const { weeklyDelta } = userProfile.purpose;
    const { latestMetric } = activeQuest;
    const { targetValue } = userProfile;
    return weeklyDelta < 0 ? latestMetric <= targetValue : latestMetric >= targetValue;
  })();

  const recordWeek = useCallback(
    (inputValue: number) => {
      if (!userProfile || !activeQuest) return;
      const { weeklyDelta } = userProfile.purpose;
      const { targetValue: finalTarget } = userProfile;
      const weekTargetRaw = activeQuest.latestMetric + weeklyDelta;
      const weekTarget = Math.ceil(weekTargetRaw * 100) / 100;

      const passed = weeklyDelta < 0 ? inputValue <= weekTarget : inputValue >= weekTarget;
      const finalReached = weeklyDelta < 0 ? inputValue <= finalTarget : inputValue >= finalTarget;
      const newLatestMetric = finalReached ? finalTarget : (passed ? weekTarget : activeQuest.latestMetric);

      const newHistory = [
        ...activeQuest.history,
        { week: activeQuest.currentWeek, recorded: inputValue, target: weekTarget, passed },
      ];

      setActiveQuest({
        currentWeek: activeQuest.currentWeek + 1,
        latestMetric: newLatestMetric,
        history: newHistory,
        streak: passed ? activeQuest.streak + 1 : 0,
        bestStreak: Math.max(activeQuest.bestStreak, passed ? activeQuest.streak + 1 : 0),
      });
    },
    [userProfile, activeQuest, setActiveQuest]
  );

  const extendGoal = useCallback(() => {
    if (!userProfile || !activeQuest) return;
    const { weeklyDelta } = userProfile.purpose;
    const extraWeeks = 8;
    const newTarget = activeQuest.latestMetric + weeklyDelta * extraWeeks;

    setUserProfile({ ...userProfile, startValue: activeQuest.latestMetric, targetValue: newTarget });
    setActiveQuest({
      currentWeek: 1,
      latestMetric: activeQuest.latestMetric,
      history: [],
      streak: 0,
      bestStreak: activeQuest.bestStreak,
    });
  }, [userProfile, activeQuest, setUserProfile, setActiveQuest]);

  const resetQuest = useCallback(() => {
    setActiveQuest(null);
    setUserProfile(null);
  }, [setActiveQuest, setUserProfile]);

  return (
    <QuestContext.Provider
      value={{ userProfile, activeQuest, setUserProfile, setActiveQuest, recordWeek, extendGoal, resetQuest, isGoalReached }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export function useQuest() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used within QuestProvider");
  return ctx;
}
