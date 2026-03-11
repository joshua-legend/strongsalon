import type { UserProfile, ActiveQuest } from "@/types/quest";

let profileData: UserProfile | null = null;
let questData: ActiveQuest | null = null;

export const PROFILE_KEY = "fitlog-user-profile";
export const QUEST_KEY = "fitlog-active-quest";

export function loadProfile(): UserProfile | null {
  return profileData;
}

export function loadQuest(): ActiveQuest | null {
  return questData;
}

export function saveProfile(p: UserProfile | null): void {
  profileData = p ? structuredClone(p) : null;
}

export function saveQuest(q: ActiveQuest | null): void {
  questData = q ? structuredClone(q) : null;
}
