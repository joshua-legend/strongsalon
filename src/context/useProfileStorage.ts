import type { UserProfile } from "@/types/profile";

const PROFILE_KEY = "fitlog-v3-profile";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (
      !parsed.nickname ||
      !parsed.gender ||
      !parsed.birthDate ||
      !parsed.height ||
      !parsed.weight ||
      !parsed.experience
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile | null): void {
  if (p) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
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
