"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { UserProfile, ActiveQuest } from "@/types/quest";
import { purposeOptions } from "@/config/purposeOptions";

const PROFILE_KEY = "fitlog-user-profile";
const QUEST_KEY = "fitlog-active-quest";

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    const fullPurpose = purposeOptions.find((p) => p.id === parsed.purpose.id);
    if (!fullPurpose) return null;
    return { ...parsed, purpose: fullPurpose };
  } catch {
    return null;
  }
}

function loadQuest(): ActiveQuest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveQuest;
  } catch {
    return null;
  }
}

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
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [activeQuest, setActiveQuestState] = useState<ActiveQuest | null>(null);

  useEffect(() => {
    setUserProfileState(loadProfile());
    setActiveQuestState(loadQuest());
  }, []);

  const setUserProfile = useCallback((p: UserProfile | null) => {
    setUserProfileState(p);
    if (p) {
      try {
        const { purpose } = p;
        const toSave = {
          ...p,
          purpose: {
            id: purpose.id,
            label: purpose.label,
            desc: purpose.desc,
            unit: purpose.unit,
            weeklyDelta: purpose.weeklyDelta,
            metricKey: purpose.metricKey,
          },
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(toSave));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(PROFILE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const setActiveQuest = useCallback((q: ActiveQuest | null) => {
    setActiveQuestState(q);
    if (q) {
      try {
        localStorage.setItem(QUEST_KEY, JSON.stringify(q));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(QUEST_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const isGoalReached = (() => {
    if (!userProfile || !activeQuest) return false;
    const { weeklyDelta } = userProfile.purpose;
    const { latestMetric } = activeQuest;
    const { targetValue } = userProfile;
    return weeklyDelta < 0
      ? latestMetric <= targetValue
      : latestMetric >= targetValue;
  })();

  const recordWeek = useCallback(
    (inputValue: number) => {
      if (!userProfile || !activeQuest) return;
      const { weeklyDelta } = userProfile.purpose;
      const { targetValue: finalTarget } = userProfile;
      const weekTarget = activeQuest.latestMetric + weeklyDelta;

      const passed =
        weeklyDelta < 0 ? inputValue <= weekTarget : inputValue >= weekTarget;

      // 최종 목표 즉시 달성 — 실측값이 최종 목표 도달/초과 시 바로 완료
      const finalReached =
        weeklyDelta < 0
          ? inputValue <= finalTarget
          : inputValue >= finalTarget;
      const newLatestMetric = finalReached ? finalTarget : (passed ? weekTarget : activeQuest.latestMetric);

      const newHistory = [
        ...activeQuest.history,
        {
          week: activeQuest.currentWeek,
          recorded: inputValue,
          target: weekTarget,
          passed,
        },
      ];

      setActiveQuest({
        currentWeek: activeQuest.currentWeek + 1,
        latestMetric: newLatestMetric,
        history: newHistory,
        streak: passed ? activeQuest.streak + 1 : 0,
        bestStreak: Math.max(
          activeQuest.bestStreak,
          passed ? activeQuest.streak + 1 : 0
        ),
      });
    },
    [userProfile, activeQuest, setActiveQuest]
  );

  const extendGoal = useCallback(() => {
    if (!userProfile || !activeQuest) return;
    const { weeklyDelta } = userProfile.purpose;
    const extraWeeks = 8;
    const newTarget = activeQuest.latestMetric + weeklyDelta * extraWeeks;

    setUserProfile({
      ...userProfile,
      startValue: activeQuest.latestMetric,
      targetValue: newTarget,
    });
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
      value={{
        userProfile,
        activeQuest,
        setUserProfile,
        setActiveQuest,
        recordWeek,
        extendGoal,
        resetQuest,
        isGoalReached,
      }}
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
