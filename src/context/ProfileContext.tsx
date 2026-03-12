"use client";

import React, { createContext, useContext, useCallback } from "react";
import type { UserProfile } from "@/types/profile";
import { useAuth } from "./AuthContext";

interface ProfileContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { accountData } = useAuth();
  const profile = accountData?.profile ?? null;

  const setProfile = useCallback((_p: UserProfile | null) => {
    // 읽기 전용: accountData에서 제공
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
