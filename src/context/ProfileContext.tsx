"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { UserProfile } from "@/types/profile";
import { mockProfile } from "@/data/mockUserData";

interface ProfileContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(
    () => structuredClone(mockProfile)
  );

  const setProfile = useCallback((p: UserProfile | null) => {
    setProfileState(p);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
