"use client";

import { useMemo } from "react";
import { CircleAlert } from "lucide-react";
import CategorySetupSheet from "@/components/home/CategorySetupSheet";
import RecommendationSetupSheet from "@/components/home/RecommendationSetupSheet";
import { useApp } from "@/context/AppContext";
import { useGoal } from "@/context/GoalContext";
import { isLevelSetupComplete as getIsLevelSetupComplete } from "@/utils/levelSetup";
import PremiumLevelDashboard from "./PremiumLevelDashboard";

export default function LevelTab() {
  const { categorySettings, primaryGoal } = useGoal();
  const {
    openStrengthSetup,
    setOpenStrengthSetup,
    openRecommendationSetup,
    setOpenRecommendationSetup,
  } = useApp();

  const openFullSetup = () => setOpenRecommendationSetup(true);
  const isLevelSetupComplete = useMemo(
    () => getIsLevelSetupComplete(categorySettings),
    [categorySettings]
  );

  return (
    <div className="px-4 py-4 space-y-4">
      {isLevelSetupComplete ? (
        <PremiumLevelDashboard onOpenFullSetup={openFullSetup} />
      ) : (
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <div className="flex items-center gap-2">
            <CircleAlert className="w-4 h-4" style={{ color: "var(--accent-main)" }} />
            <p className="text-[10px] font-bold tracking-[0.14em]" style={{ color: "var(--accent-main)" }}>
              LEVEL SETUP REQUIRED
            </p>
          </div>
          <p className="text-[14px] font-bold mt-1" style={{ color: "var(--text-main)" }}>
            인바디 · 카디오 · 스트렝스 전체 설정이 필요합니다
          </p>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--text-sub)" }}>
            레벨 탭에서 데이터 설정을 완료하면 나이/성별 보정을 반영한 컴포넌트가 바로 활성화됩니다.
          </p>
          <button
            type="button"
            onClick={openFullSetup}
            className="mt-4 h-11 px-4 rounded-xl text-[12px] font-bold border"
            style={{
              borderColor: "var(--accent-main)",
              backgroundColor: "var(--accent-bg)",
              color: "var(--accent-main)",
            }}
          >
            전체 설정 시작하기
          </button>
        </div>
      )}

      <CategorySetupSheet
        open={openStrengthSetup}
        onClose={() => setOpenStrengthSetup(false)}
        categoryId="strength"
        primaryGoal={primaryGoal}
        onComplete={() => setOpenStrengthSetup(false)}
      />

      <RecommendationSetupSheet
        open={!isLevelSetupComplete && openRecommendationSetup}
        onClose={() => setOpenRecommendationSetup(false)}
        onComplete={() => setOpenRecommendationSetup(false)}
      />
    </div>
  );
}
