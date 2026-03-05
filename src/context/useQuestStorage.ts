'use client';

import type { UserProfile, ActiveQuest } from "@/types/quest";
import { purposeOptions } from "@/config/purposeOptions";

export const PROFILE_KEY = "fitlog-user-profile";
export const QUEST_KEY = "fitlog-active-quest";

export function loadProfile(): UserProfile | null {
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

export function loadQuest(): ActiveQuest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveQuest;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile | null): void {
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
}

export function saveQuest(q: ActiveQuest | null): void {
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
}
