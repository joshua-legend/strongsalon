"use client";

import { useEffect } from "react";
import { seedMockGoalTrackerData } from "@/utils/seedMockGoalTrackerData";
import { loadGoalSetting } from "@/context/useGoalStorage";

const SEED_FLAG = "fitlog-goal-tracker-mock-seeded";

/**
 * 골트래커 UI 검토용: localStorage가 비어있으면 더미 데이터 시드 후 새로고침
 * ?seed=1 쿼리로 강제 시드 가능 (개발 모드에서만)
 */
export default function MockGoalTrackerSeeder() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;

    const forceSeed = new URLSearchParams(window.location.search).get("seed") === "1";

    if (!forceSeed && sessionStorage.getItem(SEED_FLAG)) return;

    const hasData = loadGoalSetting() != null;
    if (!forceSeed && hasData) {
      sessionStorage.setItem(SEED_FLAG, "1");
      return;
    }

    seedMockGoalTrackerData();
    sessionStorage.setItem(SEED_FLAG, "1");
    if (forceSeed) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    window.location.reload();
  }, []);

  return null;
}
