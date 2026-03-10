"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import type { UserProfile } from "@/types/profile";
import ProfileSetup from "./ProfileSetup";

export default function OnboardingWizard() {
  const { profile: savedProfile, setProfile } = useProfile();
  const [profile, setProfileLocal] = useState<UserProfile | null>(savedProfile);

  useEffect(() => {
    if (savedProfile) setProfileLocal(savedProfile);
  }, [savedProfile]);

  const handleProfileComplete = (p: UserProfile) => {
    setProfile(p);
    setProfileLocal(p);
    // 프로필만 저장 후 홈으로 이동 (부모 리렌더로 자동)
  };

  return (
    <div className="min-h-dvh bg-neutral-950 px-4 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <ProfileSetup onComplete={handleProfileComplete} />
      </div>
    </div>
  );
}
