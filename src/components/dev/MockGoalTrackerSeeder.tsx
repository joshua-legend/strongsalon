"use client";

import { useEffect } from "react";
import { seedMockGoalTrackerData } from "@/utils/seedMockGoalTrackerData";
import { useAuth } from "@/context/AuthContext";

/**
 * 골트래커 UI 검토용: 로그인 후 ?seed=1 쿼리로 더미 데이터 시드 (개발 모드에서만)
 */
export default function MockGoalTrackerSeeder() {
  const { accountData, updateAccountData } = useAuth();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;
    if (!accountData) return;

    const forceSeed = new URLSearchParams(window.location.search).get("seed") === "1";
    if (!forceSeed) return;

    seedMockGoalTrackerData(updateAccountData);
    window.history.replaceState({}, "", window.location.pathname);
  }, [accountData, updateAccountData]);

  return null;
}
