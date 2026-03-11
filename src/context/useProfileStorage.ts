import type { UserProfile } from "@/types/profile";
import { mockProfile } from "@/data/mockUserData";

let profileData: UserProfile | null = structuredClone(mockProfile);

export function loadProfile(): UserProfile | null {
  return profileData;
}

export function saveProfile(p: UserProfile | null): void {
  profileData = p ? structuredClone(p) : null;
}
